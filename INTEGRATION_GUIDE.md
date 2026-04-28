# 🔗 Integration Complete - Setup Guide

## ✅ What's Already Connected

The `aram-report-analyser-main` Python AI logic has been **fully ported** into Firebase Cloud Functions.

### Architecture:
```
Frontend (React) → Firestore → Cloud Functions (Node.js with Gemini AI) → Firestore
```

No Python server needed! Everything runs on Firebase.

---

## 📋 Setup Instructions

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Initialize Firebase (if not done)
```bash
firebase init
# Select: Firestore, Functions, Hosting
# Link to your Firebase project
```

### 3. Set Gemini API Key
```bash
firebase functions:config:set gemini.key="YOUR_GEMINI_API_KEY_HERE"
```

Get your Gemini API key from: https://aistudio.google.com/apikey

### 4. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Functions:**
```bash
cd functions
npm install
```

**Backend (optional - for testing):**
```bash
cd backend
npm install
```

### 5. Update Firebase Config

Edit `frontend/src/firebase.js` with your actual Firebase project config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 6. Deploy Everything
```bash
# From project root
firebase deploy
```

This deploys:
- Cloud Functions (with Gemini AI)
- Firestore rules
- Frontend to Firebase Hosting

---

## 🧪 Testing Locally

### Test Functions Locally:
```bash
cd functions
npm run serve
```

### Test Frontend Locally:
```bash
cd frontend
npm run dev
```

---

## 🔄 How It Works

### When a Reporter submits a report:

1. **Frontend** (`ReporterDashboard.jsx`) → Adds document to Firestore `reports` collection
2. **Cloud Function** (`analyzeReport`) → Automatically triggers
3. **Gemini AI** → Analyzes description and assigns priority
4. **Matching Algorithm** → Finds top 3 volunteers based on:
   - Category match (mandatory)
   - Location match
   - Skills match
   - Profession match
   - Availability
5. **Firestore Update** → Report gets `priority` and `suggestedVolunteers` fields
6. **Real-time UI** → Admin/Volunteer dashboards update automatically

---

## 📊 Firestore Collections

### `reports`
- Created by: Reporter
- Updated by: Cloud Function (adds `priority`, `suggestedVolunteers`)
- Read by: Admin, Volunteer, Reporter

### `users`
- Created by: Registration
- Fields: `role`, `approved`, `city`, `skills`, `categories`, `profession`
- Read by: Cloud Function (for matching)

### `tasks`
- Created by: Volunteer (when accepting a report)
- Updated by: Volunteer (when completing)
- Triggers: `onTaskComplete` function

### `matches`
- Created by: Cloud Function
- Contains: Report details + top 3 matched volunteers

---

## 🎯 Key Features

✅ **Gemini AI Analysis** - Automatic priority assignment  
✅ **Smart Matching** - AI-powered volunteer matching  
✅ **Real-time Updates** - Firestore listeners  
✅ **Role-based Access** - Admin, Volunteer, Reporter  
✅ **Automatic Triggers** - No manual intervention needed  

---

## 🐛 Troubleshooting

### Functions not triggering?
```bash
firebase functions:log
```

### Gemini API not working?
Check if API key is set:
```bash
firebase functions:config:get
```

### Frontend not connecting?
Verify `firebase.js` has correct config from Firebase Console.

---

## 📝 Note on `aram-report-analyser-main`

The Python scripts in this folder were the **original implementation**. The logic has been **ported to Node.js** in `functions/index.js`.

You can keep the Python folder for reference, but it's **not needed** for the project to run.

If you want to use Python scripts directly (for testing):
1. Install Python dependencies: `pip install -r req.txt`
2. Set environment variables in `.env`
3. Run: `python report_pipeline.py`

But for production, use the Firebase Cloud Functions (already integrated).
