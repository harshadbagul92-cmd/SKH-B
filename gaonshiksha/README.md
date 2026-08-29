# SATHI (साथी) - Rural Learning & Skill Companion

> **Offline-First • Bilingual (Marathi / English) • Verifiable Skill Certificates • Local Opportunity Board**  
> Built for the real-world conditions of rural training institutions and schools in **Kopargaon and Ahmednagar district, Maharashtra**.

---

## 🌟 Overview & Problem Statement
In rural Maharashtra (such as the Godavari river belt near Kopargaon, Shirdi, and Rahata), vocational students face three major challenges:
1. **Unreliable Electricity & Internet**: Frequent load-shedding and spotty mobile network make video streaming and cloud-only platforms unusable.
2. **Language Barrier**: Most technical education is in English, whereas students are most comfortable in conversational Marathi (मराठी).
3. **Missing Link to Real Livelihoods**: Students finish courses without formal proof of competence or direct connection to local employers.

**SATHI (साथी - companion/friend)** solves this with a **100% Offline-First PWA & Mobile App**, comprehensive **Bilingual Learning Engine**, **Auto-Generated Verifiable PDF Certificates**, and a **Local Opportunity Board** connecting graduates with regional agro-industries, solar projects, and cooperatives.

---

## 🚀 Key Features

### 1. 100% Offline-First Architecture (Zero-Internet Operation)
- Built with **IndexedDB (Dexie.js)** and **Service Worker (PWA)** caching.
- **Pre-downloaded Course Packs**: All lessons, questions, audio scripts, and diagrams work completely without internet.
- **Lightweight SVG Vector Illustrations** (0 KB data overhead vs heavy videos).
- **In-App Network Simulator Toggle**: Judges and testers can switch between `Online 🟢` and `Offline 🔴` with 1 tap to test offline resilience.
- **Offline Sync Queue**: Automatically queues quiz attempts, progress updates, and job applications in IndexedDB and pushes them to the Node.js backend when connectivity is restored or via "Sync Now".

### 2. Complete Marathi (मराठी) & English Bilingual Support
- **1-Tap Language Toggle** in the header.
- 100% of UI labels, buttons, navigation, and badges are translated.
- Full course lessons, audio narration scripts, key takeaways, practical tips, and quizzes exist in authentic conversational Marathi alongside English terminology.
- Extensible JSON translation dictionary (`src/locales/mr.json`, `src/locales/en.json`).

### 3. Dual Real-World Outcomes
1. **Verifiable Skill Certificate**:
   - Auto-generated upon passing the 5-question course quiz with $\ge 60\%$ score.
   - Unique verification ID (e.g., `SATHI-KPG-2026-8419`), student name, village, score, grade, and official Kopargaon Skill Academy Seal.
   - 1-Click **Downloadable PDF Certificate** generated client-side via `jspdf`.
2. **Local Opportunity Board (Kopargaon & Ahmednagar)**:
   - Seeded with 5 realistic local jobs & apprenticeships (e.g. *Godavari Biorefineries Data Entry, Saibaba Solar Apprentice, Kopargaon SHG Tailoring Unit, APMC Market Accounts Assistant*).
   - Dynamic course-prerequisite locking.
   - Offline "Mark Interest / Apply" form queued directly in IndexedDB.

### 4. Dual User Roles (Student & Teacher / Admin)
- **Student View**: Dashboard, Course Catalogue, Interactive Lessons, Audio Narration Player, Quiz, Certificates, and Job Board.
- **Teacher / Admin Portal**: Roster of enrolled students, synced completion metrics, CSV export for attendance/reports, and an instant **Certificate Verification Scanner Tool**.

---

## 📚 Seeded Sample Content

### Course 1: संगणक व डिजिटल साक्षरता आणि महाऑनलाईन कौशल्ये (Basic Computer & Digital Skills)
- **Lesson 1**: संगणकाची ओळख, विंडोज आणि मराठी टायपिंग (Computer Fundamentals & Marathi Typing)
- **Lesson 2**: एमएस वर्ड, एक्सेल आणि हिशोब व्यवस्थापन (MS Word, Excel & Rural Business Records)
- **Lesson 3**: महाडीबीटी, डीजीलॉकर आणि ऑनलाइन सायबर सुरक्षा (MahaDBT, DigiLocker & Cyber Safety)
- **Quiz**: 5 bilingual questions with immediate scoring and explanations.

### Course 2: आधुनिक शिलाई, कपडे कटिंग व बुटीक व्यवसाय (Modern Tailoring & Boutique Business)
- **Lesson 1**: शिलाई यंत्राचे भाग, तेल घालणे व प्राथमिक टाके (Machine Anatomy, Maintenance & Stitches)
- **Lesson 2**: अचूक मापे, पेपर पॅटर्न आणि ब्लाउज कटिंग (Body Measurements & Pattern Drafting)
- **Lesson 3**: फिनिशिंग, शिलाई दर ठरवणे आणि स्थानिक बुटीक व्यवसाय (Finishing, Pricing & SHG Enterprise)
- **Quiz**: 5 bilingual practical workshop questions.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | Fast, responsive Single Page & Progressive Web App |
| **Styling** | Tailwind CSS | Saffron & Emerald rural palette, responsive on low-end mobile |
| **Local Storage** | Dexie.js (IndexedDB) | Complete on-device persistence for courses, quizzes, certs, and sync queue |
| **Offline Caching**| Service Worker / PWA | Caches app shell and assets for offline use |
| **Certificates** | jsPDF + Canvas | Client-side verifiable vector PDF generation |
| **Celebrations** | Canvas-Confetti | Instant reward animation on quiz pass |
| **Backend API** | Node.js + Express | Lightweight sync endpoint and certificate validator |
| **Data Store** | Persistent JSON / SQLite | Records student progress and synced job applications |

---

## ⚡ How to Run the App Locally

### Prerequisites
Node.js (v18+) and npm.

### 1. Start the Express Backend Server
In the project directory (`gaonshiksha`):
```bash
node server/index.js
```
*The server will start on `http://localhost:5000`.*

### 2. Start the Frontend Dev Server
In a new terminal window:
```bash
npm run dev
```
*Open `http://localhost:5173/` in your browser.*

---

## 🎯 Demo Walkthrough Guide for Judges

1. **Test Language Switching**: Click the `मराठी ➔ EN` button in the top bar to switch entire UI and course lessons between Marathi and English.
2. **Test Offline Mode**:
   - Click the **Network Simulator** toggle in the top bar (`Online` ➔ `Offline (Simulated)`).
   - Notice the orange offline reassurance banner.
   - Navigate courses and lessons — everything loads instantly from IndexedDB with 0 network calls.
3. **Take a Course & Quiz**:
   - Click *संगणक व डिजिटल साक्षरता* ➔ Open Lesson 1.
   - Click the **Audio Narration** button to test the voice reader.
   - Step through the lessons and click **Take Final Quiz**.
   - Answer the 5 questions (Option A for each) and click **Submit Answers**.
   - Observe the confetti celebration and score breakdown!
4. **Download Verifiable Certificate**:
   - Click **Claim & Download Certificate**.
   - Click **Download PDF** to export an official certificate with verification code `GS-KPG-2026-XXXX`.
5. **Apply for a Local Opportunity**:
   - Go to **Local Opportunities**.
   - Click **Apply Now** on the unlocked *Data Entry Operator* posting.
   - Submit the application — it is safely queued offline in IndexedDB.
6. **Sync to Backend**:
   - Toggle network back to `Online` and click **Sync Now**.
   - Watch the pending badge update and records commit to the Express backend.
7. **Teacher / Admin Portal**:
   - Switch role to **Teacher Portal** in the header.
   - Paste the certificate verification code into the **Verification Lookup Tool** to validate authenticity.
