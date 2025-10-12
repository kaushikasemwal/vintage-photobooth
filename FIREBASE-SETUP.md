# 🔥 Firebase Setup Instructions for Real-Time Collaboration

## Step 1: Get Your Firebase Configuration

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Find your project** (vintage-photobooth or whatever you named it)
3. **Get your config**:
   - Click the gear icon → "Project settings"
   - Scroll to "Your apps" section
   - If you haven't added a web app yet:
     - Click the `</>` icon to add a web app
     - Name it "vintage-photobooth-web"
     - Don't check Firebase Hosting
     - Click "Register app"
   - Copy the `firebaseConfig` object

## Step 2: Update firebase-config.js

Replace the placeholder values in `firebase-config.js` with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com", 
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com/",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 3: Set Up Realtime Database

1. **In Firebase Console** → "Realtime Database"
2. **Create Database** (if not done already)
3. **Choose location** (e.g., us-central1)
4. **Security Rules** - Start in test mode for now:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Important**: We'll make this more secure later!

## Step 4: Test Collaboration

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add Firebase real-time collaboration"
   git push
   ```

2. **Test locally**:
   - Open your PhotoBooth in two browser tabs
   - Create a collaborative session in one tab
   - Join with the session code in the other tab
   - Take photos and see them sync in real-time!

3. **Deploy to GitHub Pages** - your live site will update automatically

## Step 5: Make Database Secure (Optional)

Once everything works, update your Realtime Database rules:

```json
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": true,
        ".write": true,
        ".validate": "$sessionId.length === 6"
      }
    }
  }
}
```

## 🎉 What You'll Get

✅ **Real-time photo sharing** - Photos appear instantly for all session participants  
✅ **Live participant count** - See who's in your session  
✅ **Push notifications** - Get notified when friends take photos  
✅ **Session persistence** - Sessions survive page refreshes  
✅ **Cross-device sync** - Works across phones, tablets, computers  

## 🚀 Ready to Test!

1. Update `firebase-config.js` with your real config
2. Push to GitHub 
3. Test collaboration with friends!

Your PhotoBooth will now support real-time collaboration! 📸✨