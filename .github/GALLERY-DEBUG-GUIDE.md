# Gallery Save Debugging Guide

## Issue Reported
Solo session pictures not being saved to gallery.

## Changes Made (Commit: 4d481b4)

### 1. Enhanced Logging in `saveToGallery()`
Added comprehensive console logs to track:
- `isGuest` status
- `currentUser` existence  
- Firebase upload progress
- Success/failure messages

### 2. Made `takePhoto()` Async
- Changed `function takePhoto()` → `async function takePhoto()`
- Now awaits `saveToGallery()` to ensure completion
- Added try-catch for better error handling

### 3. Added Safety Checks
- Early return if `currentUser` is null
- Better error messages

---

## How to Debug

### Step 1: Open Browser Console
1. Visit: https://kaushikasemwal.github.io/vintage-photobooth/
2. Press `F12` to open Developer Tools
3. Go to **Console** tab

### Step 2: Sign In (Not Guest!)
Choose either:
- **Google Sign-In** (recommended)
- **Email/Password** (create account if needed)

**⚠️ DO NOT use "Continue as Guest"** - guests cannot save to gallery by design!

### Step 3: Take Solo Photos
1. Click **"Start Solo Session"**
2. Allow camera access
3. Click **"Take Photos"**
4. Watch console for these logs:

```
Expected Console Output:
═══════════════════════════════════════════════
Photo captured successfully! 1
💾 saveToGallery called
   isGuest: false
   currentUser: exists
   currentUser.uid: [your-user-id]
📤 Uploading to Firebase Storage: users/[uid]/gallery/[timestamp].jpg
✅ Blob uploaded successfully
✅ Photo saved to Firebase Storage and Database
═══════════════════════════════════════════════
```

### Step 4: Check Gallery
1. After capture, click **"View Gallery"**
2. Your photos should appear

---

## Debugging Scenarios

### ❌ Scenario 1: "Guest Mode" Message
```
Console shows:
👤 Guest mode: Photo not saved to gallery
```

**Problem:** You're in guest mode  
**Solution:** Logout and sign in with Google or Email

---

### ❌ Scenario 2: "No current user"
```
Console shows:
⚠️ No current user - cannot save to gallery
```

**Problem:** Authentication not complete  
**Solution:** 
1. Check Firebase Console → Authentication
2. Verify you're logged in (check user info bar)
3. Try signing out and back in

---

### ❌ Scenario 3: Firebase Upload Error
```
Console shows:
💾 saveToGallery called
   isGuest: false
   currentUser: exists
   currentUser.uid: [your-id]
📤 Uploading to Firebase Storage: users/[uid]/gallery/[timestamp].jpg
❌ Failed to save to gallery: [error message]
```

**Problem:** Firebase Storage permission issue  
**Solution:**
1. Go to Firebase Console → Storage → Rules
2. Verify rules are set correctly:

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

3. Click **"Publish"**

---

### ❌ Scenario 4: Database Permission Issue
```
Console shows:
✅ Blob uploaded successfully
❌ Failed to save to gallery: PERMISSION_DENIED
```

**Problem:** Realtime Database permission issue  
**Solution:**
1. Go to Firebase Console → Realtime Database → Rules
2. Verify rules include:

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

3. Click **"Publish"**

---

### ✅ Scenario 5: Success!
```
Console shows:
💾 saveToGallery called
   isGuest: false
   currentUser: exists
   currentUser.uid: abc123xyz
📤 Uploading to Firebase Storage: users/abc123xyz/gallery/1728756123456.jpg
✅ Blob uploaded successfully
✅ Photo saved to Firebase Storage and Database
```

**Result:** Photo successfully saved!  
**Verify:** Check gallery - photo should appear

---

## Manual Firebase Check

### Check Storage Directly
1. Go to: https://console.firebase.google.com/project/vintage-photobooth/storage
2. Navigate: `users/[your-uid]/gallery/`
3. You should see `.jpg` files with timestamps

### Check Database Directly
1. Go to: https://console.firebase.google.com/project/vintage-photobooth/database
2. Navigate: `users → [your-uid] → gallery`
3. You should see entries with:
   - `timestamp`
   - `session`
   - `downloadURL`

---

## Common Issues & Solutions

### Issue: "Firebase not initialized"
**Console:**
```
Uncaught ReferenceError: firebase is not defined
```

**Solution:**
- Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- Clear cache and reload

---

### Issue: Photos Saved Locally Only
**Console:**
```
⚠️ Falling back to localStorage
✅ Photo saved to localStorage
```

**Problem:** `currentUser` is falsy  
**Solution:**
- Sign out and sign back in
- Check authentication status
- Verify Firebase Auth is enabled

---

### Issue: Slow Gallery Save
**Symptoms:**
- Long delay after "Photo captured"
- Gallery save times out

**Possible Causes:**
- Large photo file size
- Slow internet connection
- Firebase Storage quota reached

**Solutions:**
- Check internet speed
- Verify Firebase quota in console
- Photos are already compressed to 0.9 quality

---

## Testing Checklist

Test these scenarios in order:

### Solo Session (Logged In)
- [ ] Sign in with Google
- [ ] Take 2 solo photos
- [ ] Check console logs show successful save
- [ ] View gallery - both photos appear
- [ ] Refresh page
- [ ] View gallery again - photos still there

### Solo Session (Guest)
- [ ] Sign in as guest
- [ ] Take 2 photos
- [ ] Console shows: "Guest mode: Photo not saved"
- [ ] View gallery - no photos (expected)

### Collaborative Session (Logged In)
- [ ] Sign in with Google
- [ ] Create collaborative session
- [ ] Take 2 photos
- [ ] Console shows successful save
- [ ] Click "End Session"
- [ ] Collab strip saved to gallery
- [ ] View gallery - all photos there

---

## Expected Behavior Summary

| Mode | User Type | Save to Gallery? | Console Message |
|------|-----------|------------------|-----------------|
| Solo | Logged In | ✅ Yes | "Photo saved to Firebase Storage" |
| Solo | Guest | ❌ No | "Guest mode: Photo not saved" |
| Collaborative | Logged In | ✅ Yes (all photos) | "Photo saved to Firebase Storage" |
| Collaborative | Guest | ❌ No | "Guest mode: Photo not saved" |
| End Session | Logged In | ✅ Yes (collab strip) | "Collaborative strip saved" |
| End Session | Guest | ❌ No | "Guest mode - not saved" |

---

## What I Fixed

### Before:
```javascript
function takePhoto() {
    // ... photo capture code ...
    photos.push(photoData);
    saveToGallery(photoData);  // ❌ Not awaited, might fail silently
}

async function saveToGallery(photoData) {
    if (isGuest) return;
    // ❌ No logging, hard to debug
    // ❌ No null check for currentUser
    await photoRef.put(blob);
    // ... rest of code
}
```

### After:
```javascript
async function takePhoto() {  // ✅ Now async
    // ... photo capture code ...
    photos.push(photoData);
    
    try {
        await saveToGallery(photoData);  // ✅ Awaited!
    } catch (error) {
        console.error('Error saving to gallery:', error);  // ✅ Error handling
    }
}

async function saveToGallery(photoData) {
    console.log('💾 saveToGallery called');  // ✅ Debug logs
    console.log('   isGuest:', isGuest);
    console.log('   currentUser:', currentUser ? 'exists' : 'null');
    
    if (isGuest) {
        console.log('👤 Guest mode: Photo not saved to gallery');
        return;
    }
    
    if (!currentUser) {  // ✅ Null check
        console.log('⚠️ No current user - cannot save to gallery');
        return;
    }
    
    // ... upload with detailed logging
    console.log('📤 Uploading to Firebase Storage:', path);
    await photoRef.put(blob);
    console.log('✅ Blob uploaded successfully');
    // ... rest with more logs
}
```

---

## Next Steps

1. **Test the fix:**
   - Visit the live site
   - Open console (F12)
   - Sign in (not as guest!)
   - Take photos
   - Watch console logs

2. **Report back:**
   - Copy console logs
   - Let me know what you see
   - Check gallery works

3. **If still broken:**
   - Send me the console output
   - Check Firebase Console for errors
   - Verify Storage & Database rules

---

## Live Site
🌐 **https://kaushikasemwal.github.io/vintage-photobooth/**

## Firebase Console
🔥 **https://console.firebase.google.com/project/vintage-photobooth**

---

**Changes deployed:** October 12, 2025  
**Commit:** `4d481b4`  
**Status:** ✅ Live and ready for testing
