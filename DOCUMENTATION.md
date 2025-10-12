# 📚 Complete Setup & Feature Guide

Welcome to the Vintage PhotoBooth documentation! This guide covers everything you need to know.

---

## 📋 Table of Contents

1. [Firebase Authentication Setup](#firebase-authentication-setup)
2. [Collaborative Features Guide](#collaborative-features)
3. [Voice Selection & Settings](#voice-selection)
4. [User Guide](#user-guide)
5. [Troubleshooting](#troubleshooting)

---

# 🔥 Firebase Authentication Setup

Complete guide to enable Google Sign-In, Email/Password authentication, and cloud storage.

## Quick Setup (5-10 minutes)

### Step 1: Enable Authentication

1. Go to **https://console.firebase.google.com/**
2. Select **"vintage-photobooth"** project
3. Click **"Authentication"** → **"Get started"**
4. Click **"Sign-in method"** tab

**Enable Email/Password:**
- Click "Email/Password"
- Toggle "Enable" ON
- Click "Save"

**Enable Google:**
- Click "Google"
- Toggle "Enable" ON
- Select your email from dropdown
- Click "Save"

### Step 2: OAuth Consent Screen

1. Go to **https://console.cloud.google.com/apis/credentials/consent**
2. Select your project → Choose **"External"** → Click **"CREATE"**
3. Fill in:
   - **App name:** Vintage Photobooth
   - **User support email:** Your email
   - **Authorized domains:** Click "+ ADD DOMAIN" → Enter `kaushikasemwal.github.io`
   - **Developer contact:** Your email
4. Click **"SAVE AND CONTINUE"** (3 times through the wizard)
5. **Add Test Users:**
   - Click "+ ADD USERS"
   - Add your email and testers' emails
   - Click "ADD" → "SAVE AND CONTINUE"

### Step 3: Authorize Your Domain

1. Back to **Firebase Console** → **Authentication** → **Settings** tab
2. Scroll to **"Authorized domains"**
3. Click **"Add domain"** → Enter `kaushikasemwal.github.io` → Click "Add"

### Step 4: Enable Storage

1. **Firebase Console** → **Storage** → **"Get started"**
2. Choose **"Start in test mode"** → Click **"Next"**
3. Choose location: **asia-southeast1** → Click **"Done"**

### Step 5: Secure Storage

In **Storage** → **"Rules"** tab, replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click **"Publish"**

### Step 6: Secure Database

In **Realtime Database** → **"Rules"** tab, replace with:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "sessions": {
      "$sessionId": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

Click **"Publish"**

✅ **Setup Complete!** Test by visiting your website and signing in.

---

## Common Errors & Solutions

### "This domain is not authorized for OAuth operations"

**Fix:** Add `kaushikasemwal.github.io` to Firebase Console → Authentication → Settings → Authorized domains

### "This app isn't verified"

**Normal in testing mode!** Click "Advanced" → "Go to Vintage Photobooth (unsafe)" - it's YOUR app, it's safe!

**Permanent fix:**
- Keep in Testing mode and add users to test users list, OR
- Publish your app in Google Cloud Console (removes warning but shows "unverified"), OR
- Submit for Google verification (takes 1-2 weeks)

### Photos Not Uploading

1. Check user is logged in (not guest mode)
2. Verify Storage is enabled in Firebase Console
3. Check Storage rules are configured correctly
4. Open browser console (F12) for error messages

---

# 🤝 Collaborative Features

## Overview

Host-controlled collaborative sessions where one person controls photo capture and everyone's photos combine into a single strip!

## How It Works

### For the Host:

1. **Create Session** - Click "Create Collaborative Session"
2. **Share Code** - Give the 6-digit code to friends (e.g., ABC123)
3. **Wait for Participants** - See "👥 2/4 participants" as friends join
4. **Select Photos** - Choose total number of photos (2, 3, or 4)
5. **Trigger Capture** - Click "👑 Capture All (Host)" when everyone is ready
6. **Photos Distribute** - System divides photos among participants automatically
7. **Create Strip** - Click "🎉 Create Collaborative Strip" to combine everyone's photos

### For Participants:

1. **Join Session** - Click "Join Session" and enter the code
2. **Get Camera Ready** - Position yourself for photos
3. **Wait for Host** - Your button shows "⏳ Waiting for Host..."
4. **Auto-Capture** - Your camera captures automatically when host triggers
5. **Photos Sync** - Your photos upload to the collaborative session

## Photo Distribution

Photos are divided **equally** among all participants:

| Total Photos | Participants | Photos Each |
|--------------|--------------|-------------|
| 4 photos     | 2 people     | 2 each      |
| 4 photos     | 3 people     | 1 each      |
| 4 photos     | 4 people     | 1 each      |
| 2 photos     | 2 people     | 1 each      |

**Formula:** `Photos per person = Total photos ÷ Number of participants`

## Session Limits

- **Maximum 4 participants** (including host)
- **Maximum 4 total photos** selected by host
- Sessions remain active while participants connected
- Automatic cleanup after 30 seconds of inactivity

## Real-Time Notifications

- "📸 [Name] just took a photo!" - Someone captures
- "📸 Capturing group photo! Everyone smile!" - Host triggers
- "✨ Collaborative strip created!" - Combined strip ready

## Collaborative Strip

The final collaborative strip shows:
- ✅ All photos from all participants in one strip
- ✅ Each person's name under their photo
- ✅ Dynamic grid layout based on photo count
- ✅ Date and session information
- ✅ List of all participants
- ✅ Downloadable for everyone

---

# 🗣️ Voice Selection

## Choosing Your Voice

1. **Access Camera Screen** - Start a photo session
2. **Find Voice Settings** in customization panel:
   - **Voice Assistant:** Dropdown with all available voices
   - **Enable Voice:** Toggle checkbox

## Available Voices

Voices vary by device and browser:

**Windows:**
- Microsoft Zira (Female)
- Microsoft David (Male)
- Microsoft Mark (Male)

**Mac:**
- Samantha (Female)
- Victoria (Female)
- Karen (Female)
- Alex (Male)

**Mobile:**
- Google voices
- Siri variants (iOS)
- Various language options

## Voice Preferences

**For Logged-In Users:**
- Voice selection is **saved to your account**
- Applies across all devices
- Preference stored in Firebase

**For Guest Users:**
- Voice selection **temporary** for current session only
- Reset when browser refreshes

## Voice Announcements

The voice assistant announces:
- "Get ready, darling! Strike a pose!"
- "Three... Two... One..."
- "Fabulous! Next pose!"
- "Your photos are absolutely stunning, darling!"

**Toggle off** if you prefer silent operation!

---

# 📖 User Guide

## Getting Started

### Sign-In Options

**1. Google Sign-In** (Recommended)
- One-click authentication
- Photos saved to cloud
- Access from any device

**2. Email/Password**
- Create account with email
- Secure password (min 6 characters)
- Photos saved to cloud

**3. Guest Mode**
- No sign-in required
- Quick access for events
- **Photos NOT saved to gallery**
- Download strips immediately

## Taking Photos

### Solo Session

1. Click **"Start Solo Session"**
2. **Allow camera access** when prompted
3. **Choose settings:**
   - Filter (Sepia, Kodachrome, Polaroid, etc.)
   - Number of photos (2-4)
   - Layout style
   - Border style
   - Voice assistant
4. Click **"Take Photos"**
5. Strike poses during countdown
6. View your photo strip!
7. **Download** or **View Gallery**

### Collaborative Session

**As Host:**
1. Click **"Create Collaborative Session"**
2. Share 6-digit code with friends
3. Wait for participants to join (see counter)
4. Configure settings (photos, filters, borders)
5. Click **"👑 Capture All (Host)"** when ready
6. All cameras capture simultaneously!
7. Click **"🎉 Create Collaborative Strip"** to combine photos

**As Participant:**
1. Click **"Join Session"**
2. Enter 6-digit code
3. Allow camera access
4. Wait for host to trigger capture
5. Your camera captures automatically!
6. View collaborative strip with everyone's photos

## Gallery Management

### For Logged-In Users:
- ✅ **Automatic cloud save** - Photos upload to Firebase Storage
- ✅ **Multi-device access** - View from any device with same account
- ✅ **Unlimited storage** - Firebase handles storage
- ✅ **Download anytime** - Individual photos or strips
- ✅ **Delete photos** - Remove unwanted photos
- ✅ **Organized by timestamp** - Newest first

### For Guest Users:
- ❌ **No gallery** - Photos not saved
- ✅ **Download strips** - Download immediately after capture
- ✅ **Temporary session** - Perfect for events

## Customization Options

### Filters
- **Classic Sepia** - Warm brown vintage
- **1950s Kodachrome** - Vibrant retro
- **1970s Polaroid** - Soft faded
- **1980s Film** - Classic film
- **Vintage Fade** - Aged paper
- **Cyanotype** - Blueprint blue
- **Daguerreotype** - Early silver tones

### Layouts
- **Classic Vertical Strip** - Traditional photobooth
- **Wide Grid (2×2)** - Square layout
- **Postcard Style** - Landscape format

### Borders
- **Ornate Gold** - Decorative frame
- **Simple Clean** - Minimal border
- **Decorative Dashed** - Vintage dashed line
- **Vintage Scalloped** - Classic scalloped edge
- **Film Strip** - Camera film perforations
- **Elegant Double** - Double-line border

### Custom Text
- Add personalized header text to strips
- Appears at the top of photo strip
- Date automatically added at bottom

---

# 🚨 Troubleshooting

## Authentication Issues

### Can't Sign In with Google

**Check:**
1. Domain authorized? (Firebase Console → Authentication → Settings → Authorized domains)
2. Added as test user? (Google Cloud Console → OAuth consent screen → Test users)
3. Popup blocked? (Allow popups in browser)
4. Wait 1-2 minutes after configuration changes

### "This app isn't verified" Warning

**This is normal!** Your app is in Testing mode.
- Click "Advanced" → "Go to Vintage Photobooth (unsafe)"
- Add users to test users list in Google Cloud Console
- OR submit app for verification (takes 1-2 weeks)

### Email Sign-Up Fails

**Common reasons:**
- Password too short (minimum 6 characters)
- Email already registered (try Sign In instead)
- Invalid email format
- Check browser console (F12) for error messages

## Camera Issues

### Camera Won't Enable

**Fixes:**
1. Grant camera permission when prompted
2. Check browser has camera access (Settings → Privacy → Camera)
3. Refresh page and try again
4. Try different browser (Chrome recommended)
5. HTTPS required (localhost or deployed site)

### Black Screen / No Preview

1. Check another app isn't using camera
2. Restart browser
3. Check camera works in other apps
4. Update browser to latest version

## Photo & Gallery Issues

### Photos Not Saving to Gallery

**For Logged-In Users:**
1. Check internet connection
2. Verify logged in (not guest mode)
3. Check Firebase Storage enabled
4. Check Storage rules configured
5. Browser console (F12) for errors

**For Guest Users:**
- Working as designed! Guest mode doesn't save photos
- Sign in to enable gallery

### Gallery Empty After Sign-In

1. Did you take photos while signed in?
2. Check Firebase Console → Storage for uploaded files
3. Hard refresh browser (Ctrl+Shift+R)
4. Check signed in with correct account

### Can't See Photos from Other Device

1. Signed in with **same account** on both devices?
2. Photos actually uploaded? (Check Firebase Storage)
3. Hard refresh on second device
4. Check internet connection on both devices

## Collaborative Session Issues

### Can't Join Session

**Check:**
1. Code entered correctly? (6 characters, case-sensitive)
2. Session still active? (Host must be connected)
3. Session full? (Maximum 4 participants)
4. Internet connection stable?

### Photos Not Syncing

1. All participants have internet connection?
2. Session code the same for everyone?
3. Firebase Realtime Database enabled?
4. Wait a few seconds for sync

### Host Button Not Working

1. Are you actually the host? (Created the session)
2. All participants joined? (Check counter)
3. Camera enabled and ready?
4. Try refreshing and creating new session

## Performance Issues

### Slow Photo Capture

1. Close other browser tabs
2. Good lighting helps camera focus faster
3. Newer device = better performance
4. Reduce photo count (try 2 photos instead of 4)

### Gallery Loads Slowly

1. Many photos in gallery?
2. Internet speed affects cloud loading
3. Try closing other apps/tabs
4. Firebase free tier has bandwidth limits

---

# 💡 Tips & Best Practices

## For Best Photos

1. **Good Lighting** - Natural light or bright indoor lighting
2. **Plain Background** - Simple backgrounds look better
3. **Center Yourself** - Use the live preview to position
4. **Strike Different Poses** - Vary your poses for each photo
5. **Have Fun!** - Vintage filters hide imperfections

## For Collaborative Sessions

1. **Communicate** - Tell participants when you'll trigger
2. **Test First** - Do a test run before the real photos
3. **Count Together** - "3... 2... 1..." helps synchronize
4. **Good WiFi** - All participants need stable internet
5. **Clear Codes** - Read session codes carefully (O vs 0, I vs 1)

## For Gallery Management

1. **Sign In Early** - Don't lose photos by using guest mode
2. **Download Favorites** - Keep local copies of best photos
3. **Regular Cleanup** - Delete unwanted photos to save space
4. **Organize Sessions** - Use descriptive header text

## For Privacy

1. **Guest Mode for Events** - Use guest mode for public photobooths
2. **Logout When Done** - Always logout on shared devices
3. **Delete Unwanted** - Remove photos you don't want to keep
4. **Private Gallery** - Only you can see your photos (logged in)

---

# 📊 Features Summary

## Authentication
- ✅ Google Sign-In
- ✅ Email/Password
- ✅ Guest Mode
- ✅ Secure Firebase Auth
- ✅ Multi-device access

## Photo Capture
- ✅ 7 vintage filters
- ✅ Live preview
- ✅ Countdown timer
- ✅ Voice guidance
- ✅ Flash effect
- ✅ Lighting detection

## Customization
- ✅ 2-4 photos per strip
- ✅ 3 layout styles
- ✅ 6 border options
- ✅ Custom header text
- ✅ Date stamping
- ✅ Voice selection

## Collaboration
- ✅ Real-time sessions
- ✅ Host-controlled capture
- ✅ Distributed photos
- ✅ Combined strips
- ✅ 4-participant max
- ✅ Session codes

## Storage
- ✅ Cloud gallery (logged in)
- ✅ Firebase Storage
- ✅ Multi-device sync
- ✅ Download strips
- ✅ Delete photos
- ✅ No save for guests

## Technical
- ✅ No server uploads
- ✅ Local processing
- ✅ HTTPS secure
- ✅ Responsive design
- ✅ Mobile friendly
- ✅ Modern browsers

---

# 🎉 That's Everything!

You now know everything about your Vintage PhotoBooth!

**Quick Links:**
- 🌐 **Live Site:** https://kaushikasemwal.github.io/vintage-photobooth/
- 🔥 **Firebase Console:** https://console.firebase.google.com/project/vintage-photobooth
- ☁️ **Google Cloud:** https://console.cloud.google.com/

**Need Help?**
- Check this guide's Troubleshooting section
- Check browser console (F12) for errors
- Review Firebase Console for user/storage data

Enjoy creating vintage memories! 📸✨
