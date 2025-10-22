# 📸 EchoLens (A Vintage PhotoBooth)

A charming web-based photobooth that captures your memories with authentic vintage film aesthetics! Create beautiful photo strips with classic filters, collaborate with friends, and save your photos to the cloud.

**� Live Demo:** [kaushikasemwal.github.io/vintage-photobooth](https://kaushikasemwal.github.io/vintage-photobooth/)

---

## ✨ Features at a Glance

### 🎨 Vintage Aesthetics
- **7 authentic vintage filters** (Sepia, Kodachrome, Polaroid, Film, Fade, Cyanotype, Daguerreotype)
- **3 layout styles** (vertical strip, 2×2 grid, postcard style)
- **6 border options** (ornate gold, clean, dashed, scalloped, film strip, double)
- **Custom text** and automatic date stamping

### 🤝 Collaborative Sessions
- **Host-controlled capture** - One person controls timing for everyone
- **Real-time sync** - Photos from all participants combine into one strip
- **Distributed photos** - Photos divided equally among participants (max 4 people)
- **Easy session codes** - 6-digit codes to join sessions

### � Authentication & Storage
- **Google Sign-In** - Quick one-click authentication
- **Email/Password** - Traditional account creation
- **Guest Mode** - Use without signing in (photos not saved)
- **Cloud Gallery** - Photos saved to Firebase Storage (logged-in users)
- **Multi-device access** - View your photos from any device

### 🗣️ Voice Selection
- Choose from all available system voices
- Optional voice guidance during photo capture
- Preferences saved per user account

### 📷 Smart Photo Capture
- Live camera preview with countdown timer
- Authentic camera flash effect
- Lighting detection and tips
- Easy retake option

---

## 🚀 Quick Start

### Using the Live Site

1. **Visit:** [kaushikasemwal.github.io/vintage-photobooth](https://kaushikasemwal.github.io/vintage-photobooth/)
2. **Choose sign-in option** (Google, Email, or Guest)
3. **Allow camera access** when prompted
4. **Start taking photos!** 📸

### Running Locally

```bash
# Clone the repository
git clone https://github.com/kaushikasemwal/vintage-photobooth.git
cd vintage-photobooth

# Serve locally (choose one method)
python -m http.server 8000        # Python
npx serve .                       # Node.js
php -S localhost:8000             # PHP

# Open browser
# Navigate to http://localhost:8000
```

**⚠️ Important:** Camera requires HTTPS or localhost!

---

## 📚 Documentation

**📖 [Complete Setup & Feature Guide](./DOCUMENTATION.md)** - Everything you need to know:

- 🔥 **Firebase Authentication Setup** - Step-by-step guide to enable Google/Email sign-in
- 🤝 **Collaborative Features** - How to create and join collaborative sessions
- 🗣️ **Voice Selection** - Choosing and configuring voice assistants
- 📖 **User Guide** - Taking photos, gallery management, customization
- 🚨 **Troubleshooting** - Common issues and solutions
- 💡 **Tips & Best Practices** - Get the most out of your photobooth

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Authentication:** Firebase Authentication (Google OAuth, Email/Password)
- **Storage:** Firebase Cloud Storage (user galleries)
- **Database:** Firebase Realtime Database (collaborative sessions)
- **APIs:** MediaDevices (camera), Canvas (image processing), Web Speech (voice)
- **Deployment:** GitHub Pages (HTTPS enabled)

---

## � Key Features Details

### Solo Photos
- Choose 2-4 photos per strip
- Apply vintage filters in real-time
- Customize borders and layouts
- Add custom text headers
- Download instantly

### Collaborative Sessions
- Host creates session with 6-digit code
- Up to 4 participants can join
- Host controls photo timing
- All cameras capture simultaneously
- Photos combine into single strip
- Everyone gets the combined result

### Gallery (Logged-In Users)
- Automatic cloud backup to Firebase Storage
- Access from any device with same account
- Download photos anytime
- Delete unwanted photos
- Organized by timestamp

### Guest Mode
- No sign-in required
- Perfect for events and quick use
- Photos NOT saved to gallery
- Download strips immediately

---

## 🎯 Project Structure

```
vintage-photobooth/
├── index.html              # Main UI structure with auth screens
├── styles.css              # Vintage-themed styling
├── script.js               # Core photobooth logic (~1700 lines)
├── firebase-config.js      # Firebase initialization
├── DOCUMENTATION.md        # Complete setup & feature guide
├── README.md              # This file
└── package.json           # Project metadata
```

---

## 🔒 Privacy & Security

- ✅ **Local Processing** - All photos processed in your browser
- ✅ **Secure Authentication** - Firebase Auth with OAuth 2.0
- ✅ **Private Galleries** - Only you can access your photos
- ✅ **No Server Upload** - Guest mode photos never leave your device
- ✅ **HTTPS Encrypted** - All data transmission encrypted
- ✅ **User Consent** - Voice guidance requires explicit permission

---

## 🚀 Deployment

### GitHub Pages (Recommended)

1. Push code to GitHub repository
2. Go to **Settings** → **Pages**
3. Select **main branch** → **Save**
4. Visit `https://yourusername.github.io/vintage-photobooth/`

**Automatically includes:**
- ✅ HTTPS (required for camera access)
- ✅ Custom domain support
- ✅ Free hosting

### Firebase Setup Required

For authentication and cloud storage to work, you need to:

1. Create a Firebase project
2. Enable Authentication (Google + Email/Password)
3. Enable Storage and Realtime Database
4. Configure security rules
5. Add your domain to authorized domains

**📖 [Full Firebase Setup Guide](./DOCUMENTATION.md#firebase-authentication-setup)** - Detailed step-by-step instructions

---

## 🤝 Contributing

Contributions welcome! Feel free to:
- 🐛 Report bugs or suggest features
- 🔧 Submit pull requests
- 📝 Improve documentation
- 🎨 Add new vintage filters or border styles

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- Inspired by classic photo booths and vintage photography
- Built with modern web technologies for nostalgic experiences
- Firebase for authentication and cloud storage
- GitHub Pages for free HTTPS hosting

---

## 📞 Support

**Need help?**
- 📖 Check the [Complete Documentation](./DOCUMENTATION.md)
- 🚨 See [Troubleshooting Section](./DOCUMENTATION.md#troubleshooting)
- 🐛 [Open an issue](https://github.com/kaushikasemwal/vintage-photobooth/issues)

---

**Ready to create vintage memories? [Start taking photos now! 📸](https://kaushikasemwal.github.io/vintage-photobooth/)**