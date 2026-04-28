# Aram Seivom - Social Impact Platform

This project is a scalable, production-ready full-stack web application built using **React.js, Tailwind CSS, Google Firebase, and Google Cloud Functions**. It enables role-based volunteer coordination and emergency report management.

## Tech Stack
- **Frontend:** React.js + Vite + Tailwind CSS
- **Backend / API:** Firebase Cloud Functions (Node.js)
- **Database:** Firebase Firestore (Realtime NoSQL)
- **Authentication:** Firebase Authentication
- **Hosting:** Firebase Hosting

## Deliverables

### 1. Full React Source Code
The `frontend/` directory contains a complete React + Vite application. Key dashboards are located in `frontend/src/pages/`:
- `AdminDashboard.jsx` (Real-time analytics and task management)
- `VolunteerDashboard.jsx` (Task acceptance and completion)
- `ReporterDashboard.jsx` (Report submission and status tracking)

### 2. Firebase Setup Steps
To set up this project with your own Firebase project:
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Firestore Database**, **Authentication** (Email/Password), and **Storage**.
3. Register a new Web App in Project Settings.
4. Copy the Firebase config object.
5. In `frontend/src/firebase.js`, replace the demo configuration with your actual Firebase config.
6. Install Firebase tools: `npm install -g firebase-tools`
7. Login to Firebase CLI: `firebase login`
8. Initialize your project: `firebase init` (Select Hosting, Firestore, Functions, and link it to your created project).

### 3. Firestore Collections Structure

- **`users`**
  - `uid` (String)
  - `email` (String)
  - `role` (String: "admin", "volunteer", "reporter")
  - `fullName` (String)
  - `phone` (String)
  - `city` (String)
  - `createdAt` (Timestamp)
  - `approved` (Boolean)

- **`reports`**
  - `reporterUid` (String)
  - `reporterName` (String)
  - `category` (String)
  - `description` (String)
  - `location` (String)
  - `priority` (String: Set automatically by AI Cloud Function)
  - `status` (String: "Pending", "In Progress", "Completed")
  - `assignedVolunteerUid` (String, optional)
  - `createdAt` (Timestamp)

- **`tasks`**
  - `reportId` (String)
  - `volunteerUid` (String)
  - `status` (String: "In Progress", "Completed")
  - `startedAt` (Timestamp)
  - `completedAt` (Timestamp)

### 4. Auth Role Management
- Roles are assigned during registration in the `users` Firestore collection.
- The React App uses `AuthContext` to fetch the user role and redirect them appropriately:
  - Admins to `/admin-dashboard`
  - Volunteers to `/volunteer-dashboard`
  - Reporters to `/reporter-dashboard`
- Admin accounts must be created manually or by directly modifying the `role` field in Firestore to `"admin"`.

### 5. Cloud Functions
The `functions/` directory contains serverless APIs:
- `analyzeReport`: Triggered on document creation in the `reports` collection. It analyzes the description and automatically assigns a priority level ("Low", "Medium", "High", "Critical") to simulate AI/Gemini processing.
- `onTaskComplete`: Triggered on document updates in the `tasks` collection to manage cascading status changes or notifications.

### 6. Deployment
Deploying the entire project to Google Cloud / Firebase:
1. Navigate to the `frontend/` directory and build the project:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Navigate to `functions/` and install dependencies:
   ```bash
   cd ../functions
   npm install
   ```
3. Deploy everything using Firebase CLI from the project root:
   ```bash
   firebase deploy
   ```
This single command will deploy Firestore rules, Cloud Functions, and Host the React application on Firebase Hosting.

## Demo Credentials
Once deployed and database populated, you can create demo users:
- **Admin**: admin@aidsync.com (Must manually set role to "admin" in Firestore)
- **Volunteer**: volunteer@aidsync.com
- **Reporter**: reporter@aidsync.com
- **Password**: 123456
