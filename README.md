# 🚀 Recruitment Portal 2026

A modern, high-performance recruitment application designed to provide a frictionless experience for candidates. Built with a focus on UX and conversion, this portal features a custom "Lazy Registration" flow, allowing applicants to engage with the questionnaire immediately and seamlessly authenticate via Google upon submission.

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router)
* **Authentication:** Better Auth (Google OAuth)
* **Backend & Database:** Firebase (via Firebase Admin SDK)
* **Styling & UI:** Tailwind CSS, Framer Motion, Lucide React
* **Form State & Validation:** React Hook Form, Zod

## ✨ Key Features

* **Frictionless "Lazy Registration":** Candidates fill out their application *before* signing in. Form state is preserved in local storage during the Google OAuth redirect and automatically submitted upon return.
* **Premium UI/UX:** A responsive, dark-mode "Glassmorphism" aesthetic with smooth Framer Motion animations.
* **Secure Backend Validation:** Server-side enforcement capping users at a maximum of 2 department applications.
* **Type-Safe Forms:** Strict client-side and server-side validation using Zod.

---

## 💻 How to Run This Project (Local Setup)

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine. You will also need active projects in the **Google Cloud Console** (for OAuth) and **Firebase**.

### 2. Installation
Clone the repository and install the required dependencies. *(Note: Always run a fresh install rather than copying a `node_modules` folder from another machine).*
```bash
git clone <your-repo-url>
cd recruitment-portal
npm install
