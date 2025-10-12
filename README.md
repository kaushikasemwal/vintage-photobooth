# 📸 Vintage PhotoBooth

A charming web-based vintage photo booth that captures your memories with classic film filters and customizable photo strips. Create stunning vintage-style photo strips right in your browser!

## 🎭 [Live Demo](https://yourusername.github.io/vintage-photobooth)

*Replace `yourusername` with your actual GitHub username after deployment*

## ✨ Features

### 🎨 Vintage Filters
- **Classic Sepia** - Warm brown vintage tones
- **1950s Kodachrome** - Vibrant retro colors
- **1970s Polaroid** - Soft faded instant camera look
- **1980s Film** - Classic film camera style
- **Vintage Fade** - Aged paper effect
- **Cyanotype** - Blueprint blue photography style
- **Daguerreotype** - Early photography silver tones

### 🖼️ Customizable Photo Strips
- **Multiple Layouts**: Classic vertical, wide grid, or postcard style
- **Photo Count**: Choose 2, 3, or 4 photos per strip
- **Border Styles**: Ornate gold, simple clean, decorative dashed, vintage scalloped, film strip, or elegant double
- **Custom Headers**: Add personalized text to your photo strips
- **Date Stamps**: Automatic date stamping on final strips

### 📱 Smart Features
- **Live Filter Preview** - See filters applied in real-time
- **Lighting Detection** - Smart lighting analysis with recommendations
- **Voice Guidance** - Optional sultry voice prompts (user consent required)
- **Countdown Timer** - Dramatic 3-2-1 countdown for perfect poses
- **Flash Effect** - Realistic camera flash simulation

### 🗂️ Gallery & Sharing
- **Local Gallery** - Saves all photos to browser storage
- **Batch Downloads** - Download individual photos or complete strips
- **Session Codes** - Share sessions with friends for collaborative photo taking
- **Responsive Design** - Works on desktop, tablet, and mobile devices

### 🔒 Privacy First
- **Local Processing** - All photos processed locally in your browser
- **No Server Upload** - Images never leave your device
- **Optional Voice** - Voice guidance requires explicit user consent
- **Transparent Storage** - Clear explanation of local storage usage

## 🚀 Quick Start

### Option 1: Use the Live Demo
Simply visit the [Live Demo](https://yourusername.github.io/vintage-photobooth) and start taking photos!

### Option 2: Run Locally
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vintage-photobooth.git
   cd vintage-photobooth
   ```

2. **Serve the files**
   ```bash
   # Option A: Using Python
   python -m http.server 8000
   
   # Option B: Using Node.js
   npx serve .
   
   # Option C: Using any local server
   ```

3. **Open in browser**
   Navigate to `http://localhost:8000` (or your server's URL)

### Camera Requirements
- **HTTPS Required**: Modern browsers require HTTPS for camera access
- **Permissions**: Allow camera access when prompted
- **Supported Browsers**: Chrome, Firefox, Safari, Edge (latest versions)

## 📋 How to Use

1. **Start a Session**
   - Choose solo session or create a collaborative session
   - Allow camera access when prompted
   - Optionally enable voice guidance

2. **Customize Your Strip**
   - Select number of photos (2-4)
   - Choose layout style (classic, wide, or postcard)
   - Pick a vintage filter
   - Select border style
   - Add custom header text

3. **Take Photos**
   - Click "Start Capture" to begin the photo sequence
   - Follow the countdown and strike poses
   - Watch the dramatic flash effect!

4. **Download & Share**
   - Download the complete photo strip
   - Download individual photos
   - View all photos in the gallery
   - Share your session code with friends

## 🛠️ Technical Features

### Performance Optimizations
- **Throttled Rendering** - Smooth 30fps filter preview
- **Low-Resolution Preview** - Efficient live filtering with full-res capture
- **Resource Cleanup** - Proper camera stream and interval management
- **Responsive Canvas** - Adaptive photo strip sizing

### Accessibility
- **ARIA Support** - Full screen reader compatibility
- **Keyboard Navigation** - Complete keyboard support
- **Focus Management** - Proper focus flow between screens
- **Live Regions** - Dynamic content announcements
- **High Contrast** - Clear visual indicators and buttons

### Browser Compatibility
- **Modern Web APIs** - MediaDevices, Canvas, Web Speech
- **Graceful Degradation** - Fallbacks for unsupported features
- **Mobile Optimized** - Touch-friendly interface
- **Responsive Design** - Works across all screen sizes

## 🔧 Development

### Project Structure
```
vintage-photobooth/
├── index.html          # Main HTML structure with accessibility
├── styles.css          # Vintage-themed styling and responsive design
├── script.js           # Core functionality and filter implementations
└── README.md           # Documentation (this file)
```

### Key Components
- **State Management** - Centralized application state
- **Filter Engine** - Real-time image processing
- **Camera Interface** - MediaDevices API integration
- **Strip Composer** - Dynamic photo strip generation
- **Gallery System** - Local storage management

## 🎯 Deployment

This project is designed for easy deployment to GitHub Pages:

1. **Push to GitHub** - Upload your code to a GitHub repository
2. **Enable Pages** - Go to Settings > Pages > Deploy from main branch
3. **HTTPS Automatic** - GitHub Pages provides HTTPS for camera access
4. **Custom Domain** - Optional: configure your own domain

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs or suggest features
- Submit pull requests
- Improve documentation
- Add new vintage filters or border styles

## 🙏 Acknowledgments

- Inspired by classic photo booths and vintage photography
- Built with modern web technologies for nostalgic experiences
- Special thanks to the vintage photography community for filter inspiration

---

**Ready to create some vintage memories? [Start taking photos now!](https://yourusername.github.io/vintage-photobooth)**