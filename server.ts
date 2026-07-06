import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Schema } from "@google/genai";
import 'dotenv/config';

const app = express();
app.use(express.json({ limit: "50mb" })); // Increase limit for large JSON payloads

const PORT = 3000;
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const crmRecordSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    created_at: { type: Type.STRING, description: "Lead creation date (convertible via new Date())" },
    name: { type: Type.STRING, description: "Lead name" },
    email: { type: Type.STRING, description: "Primary email. If multiple, use first and put rest in crm_note" },
    country_code: { type: Type.STRING, description: "Country code (e.g., +91, +1)" },
    mobile_without_country_code: { type: Type.STRING, description: "Mobile number. If multiple, use first and put rest in crm_note" },
    company: { type: Type.STRING, description: "Company name" },
    city: { type: Type.STRING, description: "City" },
    state: { type: Type.STRING, description: "State" },
    country: { type: Type.STRING, description: "Country" },
    lead_owner: { type: Type.STRING, description: "Lead owner" },
    crm_status: { type: Type.STRING, description: "One of: GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE. Else empty string." },
    crm_note: { type: Type.STRING, description: "Remarks, follow-up notes, extra phones, extra emails, other useful info." },
    data_source: { type: Type.STRING, description: "One of: leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots. Else empty string." },
    possession_time: { type: Type.STRING, description: "Property possession time" },
    description: { type: Type.STRING, description: "Additional description" }
  }
};

const responseSchema: Schema = {
  type: Type.ARRAY,
  items: crmRecordSchema
};

app.post("/api/import", async (req, res) => {
  try {
    const { rows } = req.body;
    
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: "Invalid or empty rows array" });
    }

    const BATCH_SIZE = 20;
    const allExtractedRecords: any[] = [];
    
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      
      const prompt = `You are an intelligent data extraction assistant. Map the provided array of raw CSV row objects into a standardized CRM format.
      
Rules:
1. Allowed CRM Status Values: Only use one of GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, BAD_LEAD, SALE_DONE. If none match confidently, leave it empty.
2. Allowed Data Source Values: Only use one of leads_on_demand, meridian_tower, eden_park, varah_swamy, sarjapur_plots. If none match confidently, leave it empty.
3. Date Format: created_at must be convertible using JavaScript: new Date(created_at).
4. CRM Notes: Use crm_note for remarks, follow-up notes, additional comments, extra phone numbers, extra email addresses, or any useful info that doesn't fit elsewhere.
5. Multiple Emails or Mobile Numbers: Use the first in the dedicated field and append remaining to crm_note.
6. Each input row must map to exactly one output object in the returned array in the same order.

Raw CSV Rows (JSON format):
${JSON.stringify(batch, null, 2)}`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.1 // Low temperature for more deterministic mapping
        }
      });
      
      const jsonStr = aiResponse.text?.trim() || "[]";
      try {
        const extracted = JSON.parse(jsonStr);
        if (Array.isArray(extracted)) {
          allExtractedRecords.push(...extracted);
        }
      } catch (parseError) {
        console.error("Error parsing AI response for batch", parseError);
        console.log("Raw AI Response:", jsonStr);
        // Push nulls or empties to maintain length or skip? Let's just continue
      }
    }

    // Filter logic: Skip if neither email nor mobile
    const successfullyParsed: any[] = [];
    const skippedRecords: any[] = [];
    
    // In case the AI skipped some or returned fewer, we map by index if possible, 
    // but the AI is instructed to return 1:1.
    allExtractedRecords.forEach((record, index) => {
      const hasEmail = record.email && record.email.trim().length > 0;
      const hasMobile = record.mobile_without_country_code && record.mobile_without_country_code.trim().length > 0;
      
      if (!hasEmail && !hasMobile) {
        skippedRecords.push({ original: rows[index] || {}, reason: "Missing both email and mobile number", extracted: record });
      } else {
        successfullyParsed.push(record);
      }
    });

    res.json({
      success: true,
      totalImported: successfullyParsed.length,
      totalSkipped: skippedRecords.length,
      successfullyParsed,
      skippedRecords
    });

  } catch (error: any) {
    console.error("Import error:", error);
    res.status(500).json({ error: error.message || "Failed to process import" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:\${PORT}`);
  });
}

startServer();
