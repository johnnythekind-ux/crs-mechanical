# 🚀 ReportForge

**AI-powered report generator that transforms simple inputs into structured, exportable reports.**

---

## 🧠 Overview

ReportForge is a full-stack application that allows users to generate structured reports using AI.

Users can input a topic, audience, tone, and context, and receive a formatted report with sections like:

- Executive Summary
- Key Points
- Supporting Insights

The app focuses heavily on **user experience, feedback, and clarity**, making AI output feel fast, reliable, and usable.

---

## ✨ Features

### 🧠 AI Report Generation
- Generates structured reports from user input
- Uses a backend API to process and return results

### ⚡ Live Build Feedback
- Simulates real-time progress:
  - Structuring outline
  - Writing executive summary
  - Generating key points
- Improves perceived performance and user trust

### 🎯 Smart UI States
- Empty state guidance
- Loading state with spinner + progress steps
- Error state handling
- Success state rendering

### 📋 Copy to Clipboard
- Extracts clean text from rendered report
- Removes markdown artifacts

### 📄 Export to PDF
- Generates formatted PDFs using `html2pdf`
- Improved margins and readability

### 🧾 Report History
- View previously generated reports
- Navigation between past outputs

---

## 🛠 Tech Stack

**Frontend**
- React
- Next.js (App Router)
- TypeScript

**Backend**
- Next.js API Routes
- OpenAI API

**Libraries**
- ReactMarkdown
- html2pdf.js

---

## 🧠 What I Learned

- Full-stack request lifecycle (UI → API → AI → Response → Render)
- Managing UI states (empty, loading, success, error)
- Improving perceived performance through feedback systems
- Handling API errors and unexpected failures gracefully
- DOM-based content extraction for export features
- Building reusable architecture for future applications

---

## 🚀 Future Improvements

- Streaming AI responses (real-time generation)
- Saved report titles
- Shareable report links
- DOCX export

---

## 📌 Why This Project Matters

This project serves as a **foundation system** for more advanced applications, including:

- Deal Analyzer
- Risk Engine
- Strategy Lab
- Acquisition IQ (full decision intelligence system)

It demonstrates the ability to build:
- Full-stack applications
- AI-integrated systems
- User-focused products

---

## 🖥️ Getting Started

```bash
npm install
npm run dev

## 📸 Screenshots

### 🏠 Builder (Empty State)
![Home](./public/screenshots/home.png)

---

### ⚙️ Generating Report
![Loading](./public/screenshots/loading.png)

---

### 📄 Generated Report
![Report](./public/screenshots/report.png)

---

### 📊 Recent Reports
![History](./public/screenshots/history.png)

---

## 📄 License

MIT
