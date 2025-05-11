# X Clone

A Twitter/X clone built with HTML, CSS, JavaScript, and Firebase. This application demonstrates modern web development practices and real-time functionality.

## Features

- User Authentication with Google
- Real-time Post Feed
- User Profiles with:
  - Custom Profile Picture
  - Banner Image
  - Bio
  - Social Media Links
- User Search
- Responsive Design

## Setup

1. Make sure you have a Firebase project set up at [Firebase Console](https://console.firebase.google.com/)

2. Enable the following Firebase services:

   - Authentication (Google provider)
   - Firestore Database
   - Storage

3. Update Firebase configuration in `firebase-config.js` with your project's credentials

4. Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

5. Set up Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /banners/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Usage

1. Open `login.html` in a web browser
2. Sign in with your Google account
3. Update your profile information
4. Start posting and interacting with other users

## File Structure

- `index.html` - Main application page
- `login.html` - Authentication page
- `profile.html` - User profile page
- `styles.css` - Application styles
- `firebase-config.js` - Firebase configuration
- `auth.js` - Authentication logic
- `app.js` - Main application logic
- `profile.js` - Profile page logic
- `assets/` - Default images and icons

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Firebase
  - Authentication
  - Firestore
  - Storage
- Font Awesome Icons

## Development

To modify the application:

1. Update styles in `styles.css`
2. Modify page layouts in HTML files
3. Update functionality in JavaScript files
4. Test changes locally before deployment

## Security Considerations

- All user data is stored securely in Firebase
- Authentication state is properly managed
- File uploads are restricted to authenticated users
- Database rules prevent unauthorized access
- Cross-site scripting (XSS) prevention implemented

## License

MIT License - Feel free to use this code for your own projects
