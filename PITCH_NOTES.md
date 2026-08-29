# 🎙️ SATHI (साथी) - Pitch Script & Presentation Notes
*A 2-minute spoken pitch script in plain language (zero jargon) for judges and evaluators.*

---

### 1. The Real-World Problem (30 seconds)
"Good morning, judges. If you travel just 15 kilometers outside Kopargaon in Ahmednagar district, you will meet students with incredible ambition, but two harsh realities:
First, **electricity and internet connectivity are completely unpredictable**. When the power goes out or mobile towers lose signal, learning stops. Video-heavy streaming apps like YouTube or Coursera fail instantly.
Second, **the language barrier is real**. Most technical platforms are in English, but our rural students think, speak, and learn best in **Marathi (मराठी)**.
Finally, when students finish a training course, they walk away with no formal proof of competence and no direct way to reach local employers."

---

### 2. What SATHI Does (30 seconds)
"We built **SATHI (साथी - companion/friend)** — a practical vocational and digital skill companion tailored for rural training centers.
Students learn high-value, village-relevant skills like **Computer Literacy & MahaDBT schemes**, and **Modern Tailoring & Garment Making**.
Instead of heavy videos, SATHI uses **lightweight interactive text, clear vector diagrams, and built-in voice narration** in spoken Marathi and English. It downloads once and works forever as a PWA or installable Android App."

---

### 3. Why It Works 100% Offline (25 seconds)
"SATHI is built **offline-first**.
Using browser-based local storage (IndexedDB), every single lesson, diagram, quiz, and certificate generator lives directly inside the student's phone or laptop.
Students can study in a farm shed with **zero internet**.
When they complete quizzes or apply for jobs, their progress is saved locally. As soon as they reach a school Wi-Fi or mobile signal, a single tap on **'Sync Now'** synchronizes everything to the institute's server in the background."

---

### 4. Why Language Matters (15 seconds)
"We didn't just translate button labels — every single lesson, tip, and quiz explanation is written in **natural, authentic Marathi** alongside standard English terms.
With one tap on the top bar, students can switch between Marathi and English, making digital literacy feel familiar, respectful, and empowering."

---

### 5. The Real-World Outcomes (20 seconds)
"Most importantly, SATHI unlocks two tangible outcomes:
1. **Verifiable Skill Certificates**: Passing our 5-question practical quiz instantly generates an official, downloadable PDF certificate stamped with a unique verification code (`SATHI-KPG-2026-XXXX`) that any employer or teacher can look up.
2. **Kopargaon Local Opportunity Board**: Certified students unlock direct applications for real local jobs — like solar maintenance apprenticeships, sugar factory data clerks, and self-help group tailoring units. Students can apply even while offline."

---

### 6. Closing Punchline
"SATHI proves that lack of bandwidth should never mean lack of opportunity. It turns any basic device in a rural village into an accredited, employment-ready vocational companion. Thank you!"

---

## 📋 Quick Reference Card for Q&A

| Question Judges Might Ask | Simple Answer |
|---|---|
| *How does it work without internet?* | The app stores all course content, quiz logs, and certificates in the device's local database (IndexedDB). It never calls a remote server to load a lesson. |
| *What happens to videos when offline?* | We deliberately eliminated heavy video streaming. We use ultra-lightweight SVG vector diagrams and synthetic audio narration which take less than 50 KB per course. |
| *Can certificates be forged?* | No. Each certificate has an auto-generated verification code (e.g. `GS-KPG-2026-8419`) linked to the student's name, grade, and timestamp, verifiable via the Teacher/Admin Portal. |
| *Can new courses be added?* | Yes, courses and translations are modular JSON files. A local teacher can add a new course or language in minutes without touching any code. |
