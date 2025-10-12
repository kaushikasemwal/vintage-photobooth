# 🎉 Vintage Photobooth - Collaborative Features Guide

## Overview
Your Vintage Photobooth now supports **host-controlled collaborative sessions** where one person controls the photo capture and everyone's photos combine into a single beautiful strip!

---

## 🌟 Two Collaborative Modes

### Mode 1: Standard Collaboration (Individual Strips)
Everyone captures their own photos independently and shares them with the group.

**How it works:**
1. One person creates a session and shares the 6-digit code
2. Friends join using the code
3. Each person captures their own photo strip
4. Photos sync in real-time so everyone can see each other's work
5. Each person downloads their own individual strip

---

### Mode 2: Host-Controlled Group Session (Combined Strip) ⭐ NEW!
The host controls when photos are taken, and everyone's photos combine into ONE collaborative strip.

**How it works:**
1. **Host creates session** - Click "Create Collaborative Session"
2. **Share the code** - Give the 6-digit code to your friends
3. **Friends join** - They click "Join Session" and enter the code
4. **Everyone positions themselves** - All participants get their cameras ready
5. **Host triggers capture** - When host clicks "👑 Capture All (Host)", ALL cameras capture simultaneously!
6. **Photos sync** - Everyone's photos upload to the collaborative session
7. **Create combined strip** - Click "🎉 Create Collaborative Strip" to combine everyone's photos into ONE strip!

---

## 👑 Host vs Participant Controls

### Host (Session Creator)
- **Button says:** "👑 Capture All (Host)"
- **Can:** Trigger photo capture for entire group
- **Controls:** All settings (filters, photo count, border style)

### Participants (Session Joiners)
- **Button says:** "⏳ Waiting for Host..." (disabled)
- **Can:** See their camera preview and prepare poses
- **Responds:** Automatically captures when host triggers

---

## 📸 Creating a Collaborative Strip

After everyone has taken photos:

1. Click **"🎉 Create Collaborative Strip (All Participants)"** button
2. Wait while the system collects all photos from all participants
3. The strip will show:
   - All photos from all participants
   - Each person's name under their photo
   - Date and session info
   - Beautiful vintage styling

**Layout:** Photos are arranged in a grid that adapts based on the number of photos.

---

## 🎨 Features of Collaborative Strips

- **Dynamic Layout:** Automatically adjusts grid based on total photo count
- **Name Labels:** Each photo shows the participant's name
- **Session Info:** Date and session code printed on strip
- **Participant List:** "With: [names]" footer showing everyone involved
- **Vintage Style:** Same beautiful borders and styling as individual strips
- **Downloadable:** Can be downloaded just like any other strip

---

## 🔔 Real-Time Notifications

You'll see notifications when:
- "📸 [Name] just took a photo!" - Someone captures a photo
- "📸 Capturing group photo! Everyone smile!" - Host triggers group capture
- "✨ Collaborative strip created!" - Combined strip is ready

---

## 💡 Tips for Best Results

1. **Test Your Camera First** - Make sure everyone can see their preview before starting
2. **Good Lighting** - Ensure all participants have adequate lighting
3. **Count Down Together** - Host can announce "Get ready... 3... 2... 1..." before clicking capture
4. **Strike a Pose** - Participants should be ready and looking at their cameras
5. **Wait for Upload** - Give photos a moment to sync before creating the collaborative strip
6. **Multiple Takes** - You can do multiple photo sessions in one collaborative session!

---

## 🚀 Getting Started Example

**Scenario:** 3 friends want to create a group photo strip

1. **Alice** (host):
   - Opens photobooth
   - Clicks "Create Collaborative Session"
   - Gets code: `ABC123`
   - Shares code with Bob and Carol

2. **Bob & Carol** (participants):
   - Open photobooth
   - Click "Join Session"
   - Enter code: `ABC123`
   - See "Connected to session ABC123"

3. **Everyone**:
   - Gets camera ready
   - Alice announces: "Everyone ready?"
   - Alice clicks "👑 Capture All (Host)"
   - All 3 cameras capture simultaneously!
   - Photos sync in real-time

4. **Creating the Strip**:
   - Alice (or anyone) clicks "🎉 Create Collaborative Strip"
   - System collects all 12 photos (4 from each person)
   - Creates one strip with all photos labeled
   - Everyone can download the same collaborative strip

---

## 🎯 Use Cases

- **Family Gatherings** - Everyone in different rooms captures together
- **Remote Friends** - Create group strips from different cities
- **Events** - Wedding guests, party attendees create collaborative memories
- **Teams** - Remote coworkers create fun team photo strips
- **Long Distance** - Friends/family separated by distance still capture moments together

---

## 📱 Device Compatibility

Works on:
- Desktop computers with webcams
- Laptops with built-in cameras
- Tablets with front/back cameras
- Smartphones (both Android and iOS)

**Note:** All participants need camera access enabled in their browser.

---

## 🔧 Technical Details

- **Real-time Sync:** Firebase Realtime Database
- **Simultaneous Capture:** Command broadcasting system
- **Photo Storage:** Up to 1MB per photo in Firebase
- **Session Duration:** Sessions remain active while participants are connected
- **Auto-cleanup:** Inactive users removed after 30 seconds of inactivity

---

## ❓ Troubleshooting

**"Button says waiting for host"**
- You're a participant, not the host. Only the person who created the session can trigger captures.

**"Photos not syncing"**
- Check internet connection
- Ensure session code is correct
- Wait a few seconds for Firebase sync

**"Collaborative strip button not showing"**
- Make sure you're in an active collaborative session
- Ensure other participants have taken photos
- Try refreshing the page

**"Can't create collaborative strip"**
- Verify that other participants' photos have uploaded (check notifications)
- Try clicking the button again after waiting a few seconds

---

## 🎨 Customization Options

All standard features work in collaborative mode:
- ✅ Vintage filters (sepia, polaroid, kodachrome, etc.)
- ✅ Custom borders (ornate, simple, none)
- ✅ Photo count selection (2-4 photos per person)
- ✅ Voice announcements
- ✅ Downloadable high-quality JPG strips

---

Enjoy creating collaborative vintage memories! 📸✨
