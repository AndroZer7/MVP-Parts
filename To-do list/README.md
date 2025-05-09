# Firebase Todo List Application

A simple, real-time todo list application built with vanilla JavaScript and Firebase 9. The application features Google Authentication and real-time data synchronization using Firebase Firestore.

## Features

- Google Authentication
- Real-time todo list updates
- Add and delete tasks
- Secure data access with Firebase Security Rules
- Modern ES6+ JavaScript with modules

## Project Structure

```txt
To-do list/
├── firebase-config.js  # Firebase configuration and initialization
├── index.html         # Main application page
├── login.html        # Authentication page
├── styles.css        # Application styles
└── todo.js          # Main application logic
```

## How It Works

### Authentication (`login.html`, `firebase-config.js`)

- Uses Firebase Authentication with Google provider
- Implements modern modular Firebase v9 SDK
- Redirects to main app after successful login
- Manages user sessions automatically

```javascript
// Authentication flow
1. User clicks "Login with Google"
2. Google popup appears
3. After successful login, redirects to index.html
```

### Todo List (`todo.js`, `index.html`)

- Real-time todo list management using Firestore
- Tasks are associated with the authenticated user
- Real-time updates using Firestore snapshots
- Secure data access with user-specific queries

Features:

1. Add new tasks
2. Delete existing tasks
3. Real-time updates across devices
4. User-specific task lists

### Security

Firebase Security Rules ensure that:

- Users can only read their own tasks
- Users can only create tasks with their user ID
- Users can only delete their own tasks
- All operations require authentication

Required Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Setup Requirements

1. Firebase project with:

   - Authentication enabled (Google provider)
   - Firestore database created
   - Proper security rules configured

2. Web browser requirements:
   - Modern browser with ES6+ support
   - Allow firestore.googleapis.com domain
   - Disable ad blockers or add exceptions for Firebase domains

## Troubleshooting

Common issues:

1. "Missing or insufficient permissions"

   - Check Firebase security rules
   - Verify user is authenticated
   - Check task userId matches current user

2. Network Errors

   - Check ad blocker settings
   - Allow Firebase domains
   - Verify internet connection

3. Authentication Issues
   - Ensure Google Authentication is enabled in Firebase Console
   - Check for proper redirect handling
   - Verify Firebase configuration
