# GrowEasy: AI-Powered CSV Importer

An intelligent, full-stack CSV importer built for GrowEasy that extracts, cleans, and maps arbitrary, unstructured CRM lead information into a unified target schema using LLMs. 

This application bypasses traditional hard-coded CSV parsers by utilizing Google's Gemini AI to intelligently interpret ambiguous columns, extract relevant CRM fields, and seamlessly handle messy datasets.

**Live Application URL:** (https://ai-powered-csv-importer-142562810332.asia-southeast1.run.app/)

---

## 🚀 Features & Bonus Points Achieved

*   **Intelligent AI Mapping:** Dynamically maps arbitrary columns (e.g., from Facebook Ads, Real Estate CRMs) to the standard GrowEasy CRM schema.
*   **Batch Processing & Resiliency:** The Node.js backend processes large CSVs in intelligent batches to respect LLM rate limits and ensure maximum extraction accuracy.
*   **Instant Local Preview:** Utilizes `papaparse` for lightning-fast client-side rendering of the raw CSV before any AI processing takes place.
*   **Docker Containerization (Bonus):** Fully containerized backend and frontend environments for isolated, reliable deployments.
*   **Cloud Deployment (Bonus):** Successfully deployed and hosted on Google Cloud Run for scalable, serverless execution.
*   **Responsive Modern UI:** Built with Next.js and Tailwind CSS, featuring strict loading states and clear statistical outputs (Successfully Imported vs. Skipped).

---

## 💻 Tech Stack

*   **Frontend:** Next.js, React, Tailwind CSS, PapaParse
*   **Backend:** Node.js, Express.js, CORS
*   **AI / LLM:** Google Gemini (`@google/genai` SDK)
*   **Infrastructure:** Docker, Google Cloud Run

---

## ⚙️ Local Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   Docker (Optional, for containerized execution)
*   A valid Google Gemini API Key

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
2. Backend Setup
Navigate to the backend directory, install dependencies, and set up your environment variables.

Bash
cd backend
npm install
Create a .env file in the /backend directory:

Code snippet
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
Start the backend server:

Bash
npm run dev
# The server will start on http://localhost:5000
3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies.

Bash
cd frontend
npm install
Start the Next.js development server:

Bash
npm run dev
# The client will start on http://localhost:3000
🐳 Docker Setup (Bonus)
To run the application using Docker, ensure Docker Desktop is running.

Build and Run the Backend Image:

Bash
cd backend
docker build -t groweasy-backend .
docker run -p 5000:5000 --env-file .env groweasy-backend
Build and Run the Frontend Image:

Bash
cd frontend
docker build -t groweasy-frontend .
docker run -p 3000:3000 groweasy-frontend
🧠 AI Prompt Engineering Strategy
The core extraction logic relies on a strictly structured prompt provided to the gemini-2.5-flash model. The System Instruction enforces:

Strict Status Enforcement: Only allowing specific CRM statuses (GOOD_LEAD_FOLLOW_UP, DID_NOT_CONNECT, etc.).

JSON Schema Adherence: Forcing the LLM to return application/json mapped explicitly to the defined data types.

Data Preservation: Instructing the model to map secondary emails or phone numbers into the crm_note field to prevent data loss, while skipping rows completely if both email and mobile are missing.

👨‍💻 Author
Abhinav Kumar Dixit

Role: Software Developer Intern Applicant

LinkedIn: [Insert your LinkedIn URL]

Contact: [Insert your Email/Phone]
