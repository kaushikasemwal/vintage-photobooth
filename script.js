// Elements
const loginScreen = document.getElementById('loginScreen');
const welcomeScreen = document.getElementById('welcomeScreen');
const cameraAccessScreen = document.getElementById('cameraAccessScreen');
const captureScreen = document.getElementById('captureScreen');
const resultsScreen = document.getElementById('resultsScreen');
const galleryScreen = document.getElementById('galleryScreen');

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureCanvas = document.getElementById('captureCanvas');
const stripCanvas = document.getElementById('stripCanvas');
const ctx = canvas.getContext('2d');
const captureCtx = captureCanvas.getContext('2d');
const stripCtx = stripCanvas.getContext('2d');

const lightStatus = document.getElementById('lightStatus');
const lightText = document.getElementById('lightText');
const sessionCodeDisplay = document.getElementById('sessionCodeDisplay');
const photoCount = document.getElementById('photoCount');
const countdown = document.getElementById('countdown');
const flash = document.getElementById('flash');

let stream = null;
let photos = [];
let totalPhotos = 4; // Default, can be changed
let currentFilter = 'sepia';
let currentSession = null;
let voiceEnabled = true;
let animationId = null;
let lightingIntervalId = null;
let soloStripDataUrl = null; // Store solo strip for viewing later

// Authentication variables
let currentUser = null;
let isGuest = false;
let availableVoices = [];
let selectedVoice = null;

// Collaboration variables - Firebase powered
const MAX_PARTICIPANTS = 4; // Maximum number of participants including host
let participantCount = 1;
let sessionPhotos = [];
let userId = 'user_' + Math.random().toString(36).substr(2, 9);
let userName = 'Guest_' + Math.random().toString(36).substr(2, 4);
let sessionRef = null;
let connectedUsers = {};
let isHost = false; // Track if this user is the session host
let hostId = null; // Store the host's user ID

// Authentication Functions
function initAuth() {
    console.log('🔐 Initializing authentication...');
    
    // Listen for auth state changes
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            isGuest = false;
            userId = user.uid;
            userName = user.displayName || user.email || 'User';
            console.log('✅ User logged in:', userName);
            showWelcomeScreen();
        } else {
            currentUser = null;
            console.log('👤 No user logged in');
        }
    });
}

function showWelcomeScreen() {
    loginScreen.style.display = 'none';
    welcomeScreen.style.display = 'block';
    
    // Update user info display
    const userInfo = document.getElementById('userInfo');
    const userDisplayName = document.getElementById('userDisplayName');
    
    if (!isGuest && currentUser) {
        userInfo.style.display = 'flex';
        userDisplayName.textContent = currentUser.displayName || currentUser.email || 'User';
    } else if (isGuest) {
        userInfo.style.display = 'flex';
        userDisplayName.textContent = '👤 Guest Mode (No Save)';
    } else {
        userInfo.style.display = 'none';
    }
}

async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        console.log('✅ Google sign-in successful:', result.user.displayName);
    } catch (error) {
        console.error('❌ Google sign-in error:', error);
        alert('Google sign-in failed: ' + error.message);
    }
}

async function signInWithEmail(email, password) {
    try {
        const result = await auth.signInWithEmailAndPassword(email, password);
        console.log('✅ Email sign-in successful:', result.user.email);
    } catch (error) {
        console.error('❌ Email sign-in error:', error);
        alert('Sign-in failed: ' + error.message);
    }
}

async function signUpWithEmail(email, password) {
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    try {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        console.log('✅ Account created successfully:', result.user.email);
    } catch (error) {
        console.error('❌ Sign-up error:', error);
        alert('Sign-up failed: ' + error.message);
    }
}

function continueAsGuest() {
    isGuest = true;
    userId = 'guest_' + Math.random().toString(36).substr(2, 9);
    userName = 'Guest_' + Math.random().toString(36).substr(2, 4);
    console.log('👤 Continuing as guest:', userName);
    showWelcomeScreen();
}

function logout() {
    if (!isGuest) {
        auth.signOut().then(() => {
            console.log('👋 User logged out');
            currentUser = null;
            isGuest = false;
            loginScreen.style.display = 'block';
            welcomeScreen.style.display = 'none';
        });
    } else {
        isGuest = false;
        loginScreen.style.display = 'block';
        welcomeScreen.style.display = 'none';
    }
}

// Voice Selection Functions
function initVoiceSelection() {
    console.log('🗣️ Initializing voice selection...');
    
    // Load available voices
    function loadVoices() {
        availableVoices = speechSynthesis.getVoices();
        const voiceSelect = document.getElementById('voiceSelect');
        
        if (availableVoices.length > 0) {
            voiceSelect.innerHTML = '';
            
            // Group voices by language
            const englishVoices = availableVoices.filter(voice => voice.lang.startsWith('en'));
            const otherVoices = availableVoices.filter(voice => !voice.lang.startsWith('en'));
            
            // Add English voices first
            if (englishVoices.length > 0) {
                const englishGroup = document.createElement('optgroup');
                englishGroup.label = 'English Voices';
                englishVoices.forEach((voice, index) => {
                    const option = document.createElement('option');
                    option.value = voice.name;
                    option.textContent = `${voice.name} (${voice.lang})`;
                    if (voice.default) {
                        option.textContent += ' - Default';
                        option.selected = true;
                        selectedVoice = voice;
                    }
                    englishGroup.appendChild(option);
                });
                voiceSelect.appendChild(englishGroup);
            }
            
            // Add other voices
            if (otherVoices.length > 0) {
                const otherGroup = document.createElement('optgroup');
                otherGroup.label = 'Other Languages';
                otherVoices.forEach(voice => {
                    const option = document.createElement('option');
                    option.value = voice.name;
                    option.textContent = `${voice.name} (${voice.lang})`;
                    otherGroup.appendChild(option);
                });
                voiceSelect.appendChild(otherGroup);
            }
            
            console.log(`✅ Loaded ${availableVoices.length} voices`);
        }
    }
    
    // Load voices immediately and on change
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    // Voice select change handler
    document.getElementById('voiceSelect').addEventListener('change', (e) => {
        const voiceName = e.target.value;
        selectedVoice = availableVoices.find(voice => voice.name === voiceName);
        console.log('🎤 Voice changed to:', selectedVoice?.name);
        
        // Save preference if logged in
        if (currentUser && !isGuest) {
            database.ref(`users/${currentUser.uid}/preferences/voice`).set(voiceName);
        }
    });
    
    // Voice toggle handler
    document.getElementById('voiceToggle').addEventListener('change', (e) => {
        voiceEnabled = e.target.checked;
        console.log('🔊 Voice', voiceEnabled ? 'enabled' : 'disabled');
        
        // Save preference if logged in
        if (currentUser && !isGuest) {
            database.ref(`users/${currentUser.uid}/preferences/voiceEnabled`).set(voiceEnabled);
        }
    });
}

// Firebase collaboration functions
function initializeFirebaseSession(sessionCode, asHost = false) {
    console.log('🔥 Initializing Firebase session:', sessionCode);
    console.log('Firebase available:', !!window.firebase);
    console.log('Database available:', !!database);
    
    if (!window.firebase || !database) {
        console.error('❌ Firebase not available, using local storage fallback');
        alert('Firebase connection failed. Real-time collaboration not available.');
        return initializeLocalSession(sessionCode);
    }
    
    currentSession = sessionCode;
    sessionRef = database.ref('sessions/' + sessionCode);
    isHost = asHost;
    
    // Check if session already exists to determine host
    sessionRef.once('value').then((snapshot) => {
        const sessionData = snapshot.val();
        
        // Check participant limit before joining
        if (sessionData && sessionData.users) {
            const currentParticipants = Object.keys(sessionData.users).length;
            
            // If not already in the session and session is full, prevent joining
            if (!sessionData.users[userId] && currentParticipants >= MAX_PARTICIPANTS) {
                console.log('❌ Session is full!');
                alert(`Session is full! Maximum ${MAX_PARTICIPANTS} participants allowed (including host).`);
                currentSession = null;
                sessionRef = null;
                showScreen(welcomeScreen);
                return;
            }
        }
        
        if (!sessionData || !sessionData.hostId) {
            // This is a new session or no host set - make this user the host
            isHost = true;
            hostId = userId;
            sessionRef.child('hostId').set(userId);
            sessionRef.child('hostName').set(userName);
            console.log('👑 You are the session host!');
        } else {
            // Session exists, get host info
            hostId = sessionData.hostId;
            isHost = (hostId === userId);
            console.log(isHost ? '👑 You are the session host!' : '👥 You joined as participant');
        }
        
        updateHostControls();
    });
    
    // Listen for host control commands
    sessionRef.child('commands').on('child_added', (snapshot) => {
        const command = snapshot.val();
        if (!isHost && command.type === 'capture') {
            console.log('📸 Host initiated photo capture!');
            handleHostCommand(command);
        }
    });
    
    // Add this user to the session
    const userRef = sessionRef.child('users/' + userId);
    userRef.set({
        name: userName,
        joinedAt: firebase.database.ServerValue.TIMESTAMP,
        lastActive: firebase.database.ServerValue.TIMESTAMP,
        photoCount: 0,
        currentFilter: currentFilter,
        isHost: isHost
    });
    
    // Listen for other users joining/leaving
    sessionRef.child('users').on('value', (snapshot) => {
        connectedUsers = snapshot.val() || {};
        console.log('👥 Connected users updated:', Object.keys(connectedUsers).length);
        updateParticipantDisplay();
    });
    
    // Listen for shared photos
    sessionRef.child('photos').on('child_added', (snapshot) => {
        const photoData = snapshot.val();
        console.log('📸 New photo detected:', photoData ? 'from user ' + photoData.userId : 'null data');
        
        if (photoData && photoData.userId !== userId) {
            // Someone else took a photo!
            console.log('🎉 Receiving photo from friend:', photoData.userName);
            addSharedPhotoToSession(photoData);
        }
    });
    
    // Listen for collaborative strip being created
    sessionRef.child('collaborativeStrip').on('value', (snapshot) => {
        const stripData = snapshot.val();
        if (stripData && stripData.createdBy !== userId) {
            console.log('🎨 Collaborative strip created by:', stripData.createdByName);
            // Load and display the collaborative strip
            showSharedCollaborativeStrip(stripData);
        }
    });
    
    // Listen for session end
    sessionRef.child('sessionEnded').on('value', (snapshot) => {
        const endData = snapshot.val();
        if (endData && endData.endedBy !== userId) {
            console.log('🏁 Session ended by:', endData.endedByName);
            showNotification(`🏁 ${endData.endedByName} ended the session`);
            // Give user time to see the notification and download if needed
            setTimeout(() => {
                resetSession();
            }, 3000);
        }
    });
    
    // Keep connection alive
    userRef.child('lastActive').onDisconnect().remove();
    setInterval(() => {
        userRef.child('lastActive').set(firebase.database.ServerValue.TIMESTAMP);
    }, 5000);
}

function sharePhotoWithSession(photoDataUrl) {
    console.log('📸 Attempting to share photo with session');
    console.log('Session ref exists:', !!sessionRef);
    console.log('Current session:', currentSession);
    
    if (!sessionRef || !currentSession) {
        console.warn('❌ No active session for photo sharing');
        return;
    }
    
    console.log('🔄 Uploading photo to Firebase...');
    
    // Add photo to Firebase session
    const photoRef = sessionRef.child('photos').push();
    photoRef.set({
        userId: userId,
        userName: userName,
        photoData: photoDataUrl,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        filter: currentFilter
    }).then(() => {
        console.log('✅ Photo uploaded successfully!');
    }).catch((error) => {
        console.error('❌ Photo upload failed:', error);
        alert('Failed to share photo with session: ' + error.message);
    });
    
    // Update user's photo count
    sessionRef.child('users/' + userId + '/photoCount').set(photos.length);
}

function addSharedPhotoToSession(photoData) {
    console.log('🎨 Adding shared photo to session:', photoData.userName);
    sessionPhotos.push(photoData);
    showSharedPhotoNotification(photoData.userName);
    updateCollaborativeUI();
    console.log('📊 Total session photos:', sessionPhotos.length);
}

function showSharedPhotoNotification(userName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'shared-photo-notification';
    notification.innerHTML = `
        <div class="notification-content">
            📸 ${userName} just took a photo!
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    speak(`${userName} just took a photo!`, true);
}

function showSharedCollaborativeStrip(stripData) {
    console.log('🎨 Displaying shared collaborative strip');
    showNotification(`🎉 ${stripData.createdByName} created the collaborative strip!`);
    
    // Load the strip image onto canvas
    const img = new Image();
    img.src = stripData.stripData;
    img.onload = () => {
        stripCanvas.width = img.width;
        stripCanvas.height = img.height;
        stripCtx.clearRect(0, 0, stripCanvas.width, stripCanvas.height);
        stripCtx.drawImage(img, 0, 0);
        
        // Show results screen with the collaborative strip
        showScreen(resultsScreen);
        
        // Hide collab button, show solo strip button if available
        document.getElementById('createCollabStripBtn').style.display = 'none';
        if (soloStripDataUrl) {
            document.getElementById('viewSoloStripBtn').style.display = 'inline-block';
        }
        
        // Show end session button
        if (currentSession) {
            document.getElementById('endSessionBtn').style.display = 'inline-block';
        }
    };
}

function updateParticipantDisplay() {
    const userCount = Object.keys(connectedUsers).length;
    participantCount = userCount;
    
    // Update session display
    const sessionDisplay = document.getElementById('sessionCodeDisplay');
    if (sessionDisplay && currentSession) {
        const userNames = Object.values(connectedUsers).map(user => user.name).join(', ');
        sessionDisplay.innerHTML = `
            <strong>Session: ${currentSession}</strong><br>
            <small>👥 ${userCount} participant(s): ${userNames}</small>
        `;
    }
}

function updateCollaborativeUI() {
    // Update photo count display to include shared photos
    const totalSharedPhotos = sessionPhotos.length;
    
    // Update participant count display
    const userCount = Object.keys(connectedUsers).length;
    const sessionCodeDisplay = document.getElementById('sessionCodeDisplay');
    
    if (currentSession && sessionCodeDisplay) {
        let statusHTML = `Connected to session: <strong>${currentSession}</strong>`;
        statusHTML += `<br><small>� ${userCount}/${MAX_PARTICIPANTS} participants`;
        
        if (userCount >= MAX_PARTICIPANTS) {
            statusHTML += ` (Session Full!)`;
        }
        
        if (totalSharedPhotos > 0) {
            statusHTML += ` | 📸 ${totalSharedPhotos} shared photos`;
        }
        
        statusHTML += `</small>`;
        
        const sessionCodeText = document.getElementById('sessionCodeText');
        const copyCodeBtn = document.getElementById('copyCodeBtn');
        
        if (sessionCodeText) {
            sessionCodeText.innerHTML = statusHTML;
        }
        
        // Show copy button for host
        if (copyCodeBtn && isHost) {
            copyCodeBtn.style.display = 'inline-block';
        }
    }
}

// Host control functions
function updateHostControls() {
    const captureBtn = document.getElementById('captureBtn');
    if (!captureBtn) return;
    
    if (!currentSession) {
        // Solo mode - normal capture
        captureBtn.textContent = 'Take Photos';
        captureBtn.disabled = false;
    } else if (isHost) {
        // Host mode - can capture for everyone
        captureBtn.textContent = '👑 Capture All (Host)';
        captureBtn.disabled = false;
    } else {
        // Participant mode - wait for host
        captureBtn.textContent = '⏳ Waiting for Host...';
        captureBtn.disabled = true;
    }
}

async function handleHostCommand(command) {
    if (command.type === 'capture') {
        // Host initiated a photo capture
        showNotification('📸 Host is taking a group photo! Get ready!');
        
        // Start the full photo sequence as a participant
        console.log('Starting participant photo sequence...');
        photos = [];
        
        // Get total photos from command
        const totalPhotos = command.totalPhotos || 1;
        
        document.getElementById('captureBtn').disabled = true;
        
        // Announce start
        speak('Get ready, darling! Strike a pose!', true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        for (let i = 0; i < totalPhotos; i++) {
            console.log(`Capturing photo ${i + 1} of ${totalPhotos}`);
            photoCount.textContent = `Photo ${i + 1} of ${totalPhotos}`;
            
            // Show countdown - synchronized with host
            for (let j = 3; j > 0; j--) {
                countdown.textContent = j;
                countdown.style.display = 'flex';
                
                // Speak and show number simultaneously
                if (j === 3) speak('Three', true);
                else if (j === 2) speak('Two', true);
                else if (j === 1) speak('One', true);
                
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            // Take photo
            countdown.textContent = '📷';
            countdown.style.display = 'flex';
            speak('Gorgeous!', true);
            
            console.log('Taking photo now...');
            takePhoto();
            console.log('Photo taken, total photos:', photos.length);
            
            await new Promise(resolve => setTimeout(resolve, 300));
            countdown.style.display = 'none';
            
            // Pause between photos with encouragement
            if (i < totalPhotos - 1) {
                const encouragements = [
                    'Fabulous! Next pose!',
                    'Stunning! Keep going!',
                    'Marvelous! One more!',
                    'Perfect! Another one!'
                ];
                speak(encouragements[i % encouragements.length], true);
                await new Promise(resolve => setTimeout(resolve, 1800));
            }
        }
        
        console.log('All photos captured:', photos.length);
        photoCount.textContent = 'Photos captured! Waiting for others...';
        speak('Your photos are absolutely stunning, darling!', true);
        document.getElementById('captureBtn').disabled = false;
    }
}

function sendHostCommand(commandType, data = {}) {
    if (!isHost || !sessionRef) return;
    
    sessionRef.child('commands').push({
        type: commandType,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        hostId: userId,
        ...data
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'shared-photo-notification';
    notification.innerHTML = `
        <div class="notification-content">
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function createCollaborativeStrip() {
    console.log('🎨 Creating collaborative strip with all photos');
    
    // Collect all photos from all users
    const allCollabPhotos = [];
    
    // Add your own photos
    photos.forEach(photo => {
        allCollabPhotos.push({
            data: photo,
            userName: userName,
            userId: userId
        });
    });
    
    // Add photos from other participants
    sessionPhotos.forEach(photo => {
        allCollabPhotos.push({
            data: photo.photoData,
            userName: photo.userName,
            userId: photo.userId
        });
    });
    
    console.log(`📸 Total collaborative photos: ${allCollabPhotos.length}`);
    
    if (allCollabPhotos.length === 0) {
        alert('No photos to create strip!');
        return;
    }
    
    // Create strip with all collaborative photos
    createPhotoStripFromPhotos(allCollabPhotos);
}

function createPhotoStripFromPhotos(photoArray) {
    const headerText = document.getElementById('headerText').value || 'COLLABORATIVE MEMORIES';
    const layout = document.getElementById('layoutStyle').value;
    const borderStyle = document.getElementById('borderStyle').value;
    const numPhotos = photoArray.length;
    
    let stripWidth, photoWidth, photoHeight, stripHeight, columns, rows;
    const spacing = 15;
    const headerHeight = 70;
    const footerHeight = 70; // Increased for participant names
    
    // Configure layout dimensions
    if (layout === 'wide' || layout === 'postcard') {
        columns = Math.min(4, numPhotos);
        rows = Math.ceil(numPhotos / columns);
        
        if (layout === 'wide') {
            stripWidth = 800;
            photoWidth = Math.floor((stripWidth - (spacing * (columns + 1))) / columns);
            photoHeight = Math.floor(photoWidth * 0.75);
        } else {
            stripWidth = 900;
            photoWidth = Math.floor((stripWidth - (spacing * (columns + 1))) / columns);
            photoHeight = Math.floor(photoWidth * 0.75);
        }
    } else {
        // Classic vertical layout
        stripWidth = 400;
        photoWidth = 370;
        photoHeight = 280;
        columns = 1;
        rows = numPhotos;
    }
    
    stripHeight = headerHeight + (photoHeight * rows) + (spacing * (rows + 1)) + footerHeight;
    
    stripCanvas.width = stripWidth;
    stripCanvas.height = stripHeight;
    
    // Background
    stripCtx.fillStyle = '#faf8f5';
    stripCtx.fillRect(0, 0, stripWidth, stripHeight);
    
    // Apply border (reuse existing border code)
    applyStripBorder(borderStyle, stripWidth, stripHeight);
    
    // Header
    stripCtx.fillStyle = '#6b4423';
    stripCtx.font = 'bold 28px "Playfair Display", serif';
    stripCtx.textAlign = 'center';
    stripCtx.fillText(headerText, stripWidth / 2, 45);
    
    // Draw photos
    let loadedPhotos = 0;
    photoArray.forEach((photoObj, i) => {
        const img = new Image();
        img.src = photoObj.data;
        img.onload = () => {
            let xPos, yPos;
            
            if (columns === 1) {
                xPos = (stripWidth - photoWidth) / 2;
                yPos = headerHeight + spacing + (i * (photoHeight + spacing));
            } else {
                const col = i % columns;
                const row = Math.floor(i / columns);
                const totalPhotoWidth = (photoWidth * columns) + (spacing * (columns - 1));
                const startX = (stripWidth - totalPhotoWidth) / 2;
                
                xPos = startX + (col * (photoWidth + spacing));
                yPos = headerHeight + spacing + (row * (photoHeight + spacing));
            }
            
            stripCtx.drawImage(img, xPos, yPos, photoWidth, photoHeight);
            stripCtx.strokeStyle = '#3e2723';
            stripCtx.lineWidth = 2;
            stripCtx.strokeRect(xPos, yPos, photoWidth, photoHeight);
            
            // Add participant name under photo
            stripCtx.font = '10px "Libre Baskerville", serif';
            stripCtx.fillStyle = '#8b6914';
            stripCtx.fillText(photoObj.userName, xPos + photoWidth/2, yPos + photoHeight + 12);
            
            loadedPhotos++;
            
            if (loadedPhotos === photoArray.length) {
                // Footer with date and session info
                const date = new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                stripCtx.font = 'italic 16px "Libre Baskerville", serif';
                stripCtx.fillStyle = '#8b6914';
                stripCtx.textAlign = 'center';
                stripCtx.fillText(date, stripWidth / 2, stripHeight - 40);
                
                stripCtx.font = '12px "Libre Baskerville", serif';
                stripCtx.fillText(`Collaborative Session: ${currentSession}`, stripWidth / 2, stripHeight - 20);
                
                // Get unique participant names
                const participants = [...new Set(photoArray.map(p => p.userName))];
                stripCtx.font = '10px "Libre Baskerville", serif';
                stripCtx.fillText(`With: ${participants.join(', ')}`, stripWidth / 2, stripHeight - 5);
                
                showScreen(resultsScreen);
                
                // Save collaborative strip data URL
                const collabStripDataUrl = stripCanvas.toDataURL('image/jpeg', 0.95);
                
                // Share collaborative strip with all participants via Firebase
                if (sessionRef && currentSession) {
                    sessionRef.child('collaborativeStrip').set({
                        stripData: collabStripDataUrl,
                        createdBy: userId,
                        createdByName: userName,
                        timestamp: firebase.database.ServerValue.TIMESTAMP,
                        participants: participants
                    }).then(() => {
                        console.log('✅ Collaborative strip shared with all participants');
                        showNotification('🎉 Collaborative strip created and shared with everyone!');
                    }).catch((error) => {
                        console.error('❌ Failed to share collaborative strip:', error);
                    });
                }
                
                // Hide regular collaborative button when showing collaborative strip
                document.getElementById('createCollabStripBtn').style.display = 'none';
                
                // Show "View My Solo Strip" button if we have a solo strip saved
                if (soloStripDataUrl) {
                    document.getElementById('viewSoloStripBtn').style.display = 'inline-block';
                }
                
                // Show "End Session" button in collaborative mode
                if (currentSession) {
                    document.getElementById('endSessionBtn').style.display = 'inline-block';
                }
            }
        };
    });
}

function applyStripBorder(borderStyle, stripWidth, stripHeight) {
    if (borderStyle === 'ornate') {
        stripCtx.strokeStyle = '#8b6914';
        stripCtx.lineWidth = 8;
        stripCtx.strokeRect(10, 10, stripWidth - 20, stripHeight - 20);
        stripCtx.strokeStyle = '#c4a747';
        stripCtx.lineWidth = 3;
        stripCtx.strokeRect(15, 15, stripWidth - 30, stripHeight - 30);
    } else if (borderStyle === 'simple') {
        stripCtx.strokeStyle = '#8b6914';
        stripCtx.lineWidth = 4;
        stripCtx.strokeRect(12, 12, stripWidth - 24, stripHeight - 24);
    }
}

// Fallback local storage collaboration (original code)
function initializeLocalSession(sessionCode) {
    currentSession = sessionCode;
    updateSessionData();
    
    // Check for other participants periodically
    setInterval(() => {
        updateSessionData();
        checkForNewParticipants();
    }, 2000);
}

function updateSessionData() {
    if (!currentSession) return;
    
    const sessionKey = 'collab_session_' + currentSession;
    let sessionData = JSON.parse(localStorage.getItem(sessionKey) || '{}');
    
    // Update this user's data
    sessionData[userId] = {
        lastActive: Date.now(),
        photoCount: photos.length,
        filter: currentFilter,
        name: userName
    };
    
    localStorage.setItem(sessionKey, JSON.stringify(sessionData));
}

function checkForNewParticipants() {
    if (!currentSession) return;
    
    const sessionKey = 'collab_session_' + currentSession;
    let sessionData = JSON.parse(localStorage.getItem(sessionKey) || '{}');
    
    // Count active participants (last active within 30 seconds)
    const now = Date.now();
    const activeUsers = Object.entries(sessionData).filter(([id, data]) => 
        now - data.lastActive < 30000
    );
    
    participantCount = activeUsers.length;
    
    // Update display
    const sessionDisplay = document.getElementById('sessionCodeDisplay');
    if (sessionDisplay && currentSession) {
        const userNames = activeUsers.map(([id, data]) => data.name || 'Guest').join(', ');
        sessionDisplay.innerHTML = `
            <strong>Session: ${currentSession}</strong><br>
            <small>👥 ${participantCount} participant(s): ${userNames}</small>
        `;
    }
}

// Check for new photos from friends
function checkForNewPhotos() {
    if (!currentSession) return;
    
    const sessionPhotosKey = 'collab_photos_' + currentSession;
    const allPhotos = JSON.parse(localStorage.getItem(sessionPhotosKey) || '[]');
    
    // Find new photos from other users
    const newPhotos = allPhotos.filter(photo => 
        photo.userId !== userId && 
        !sessionPhotos.find(existing => 
            existing.userId === photo.userId && 
            existing.timestamp === photo.timestamp
        )
    );
    
    if (newPhotos.length > 0) {
        newPhotos.forEach(photo => {
            showActivity('Friend shared a photo! 📸');
        });
        sessionPhotos = allPhotos;
        updateCollaborationUI();
    }
}

// Show activity messages
function showActivity(message) {
    const activityEl = document.getElementById('recentActivity');
    if (!activityEl) return;

    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.textContent = message;
    activityEl.appendChild(activityItem);
    
    // Remove old items
    while (activityEl.children.length > 2) {
        activityEl.removeChild(activityEl.firstChild);
    }
    
    // Auto-clear
    setTimeout(() => {
        if (activityItem.parentNode) {
            activityItem.parentNode.removeChild(activityItem);
        }
    }, 3000);
}

// Update collaboration UI
function updateCollaborationUI() {
    const collaborationStatus = document.getElementById('collaborationStatus');
    const participantCountEl = document.getElementById('participantCount');
    const sessionPhotosEl = document.getElementById('sessionPhotos');
    
    if (!collaborationStatus) return;

    if (currentSession) {
        collaborationStatus.style.display = 'block';
        participantCountEl.textContent = `👥 ${participantCount} participant${participantCount !== 1 ? 's' : ''}`;
        sessionPhotosEl.textContent = `📸 ${sessionPhotos.length} photos shared`;
    } else {
        collaborationStatus.style.display = 'none';
    }
}

// Start collaboration monitoring
function startCollaboration() {
    if (!currentSession) return;
    
    // Update session data every 10 seconds
    setInterval(updateSessionData, 10000);
    
    // Check for new photos every 5 seconds
    setInterval(checkForNewPhotos, 5000);
    
    // Initial update
    updateSessionData();
    updateCollaborationUI();
}

// Performance optimization: throttle filter updates
const FILTER_THROTTLE = 50; // ms
let lastFilterTime = 0;

// Low-res preview for performance
const PREVIEW_SCALE = 0.5; // Render at 50% resolution for preview
let previewCanvas = document.createElement('canvas');
let previewCtx = previewCanvas.getContext('2d', { willReadFrequently: true });

// Voice synthesis
function speak(text, instant = false) {
    if (!voiceEnabled || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech for instant messages
    if (instant) {
        speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use selected voice if available, otherwise use default
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } else {
        // Fallback: Get available voices and select a better one
        const voices = speechSynthesis.getVoices();
        
        // Prefer female voices with natural quality
        const preferredVoices = voices.filter(voice => 
            (voice.name.includes('Female') || 
             voice.name.includes('Samantha') || 
             voice.name.includes('Victoria') ||
             voice.name.includes('Karen') ||
             voice.name.includes('Fiona') ||
             voice.name.includes('Zira') ||
             voice.lang.startsWith('en')) && 
            !voice.name.includes('Male')
        );
        
        if (preferredVoices.length > 0) {
            utterance.voice = preferredVoices[0];
        }
    }
    
    // Slower, deeper, more dramatic voice
    utterance.rate = 0.85;
    utterance.pitch = 0.95;
    utterance.volume = 1.0;
    
    speechSynthesis.speak(utterance);
}

// Load voices when available
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.getVoices();
    };
}

// Utility: Generate session code (testable)
function generateSessionCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Gallery functions (with error handling)
async function saveToGallery(photoData) {
    console.log('💾 saveToGallery called');
    console.log('   isGuest:', isGuest);
    console.log('   currentUser:', currentUser ? 'exists' : 'null');
    console.log('   currentUser.uid:', currentUser?.uid);
    
    // Don't save for guests
    if (isGuest) {
        console.log('👤 Guest mode: Photo not saved to gallery');
        return;
    }
    
    if (!currentUser) {
        console.log('⚠️ No current user - cannot save to gallery');
        return;
    }
    
    try {
        if (currentUser && !isGuest) {
            // Logged in user: Save to Firebase Storage
            const photoId = Date.now();
            const photoRef = storage.ref(`users/${currentUser.uid}/gallery/${photoId}.jpg`);
            
            console.log('📤 Uploading to Firebase Storage:', `users/${currentUser.uid}/gallery/${photoId}.jpg`);
            
            // Convert data URL to blob
            const response = await fetch(photoData);
            const blob = await response.blob();
            
            // Upload to Firebase Storage
            await photoRef.put(blob);
            
            console.log('✅ Blob uploaded successfully');
            
            // Get download URL
            const downloadURL = await photoRef.getDownloadURL();
            
            // Save metadata to Realtime Database
            await database.ref(`users/${currentUser.uid}/gallery/${photoId}`).set({
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                session: currentSession,
                downloadURL: downloadURL
            });
            
            console.log('✅ Photo saved to Firebase Storage and Database');
        } else {
            // Fallback to localStorage (should not happen with auth)
            console.log('⚠️ Falling back to localStorage');
            let gallery = JSON.parse(localStorage.getItem('photoGallery') || '[]');
            gallery.push({
                id: Date.now(),
                data: photoData,
                timestamp: new Date().toISOString(),
                session: currentSession
            });
            localStorage.setItem('photoGallery', JSON.stringify(gallery));
            console.log('✅ Photo saved to localStorage');
        }
    } catch (error) {
        console.error('❌ Failed to save to gallery:', error);
        alert('Unable to save photo to gallery: ' + error.message);
    }
}

async function loadGallery() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Loading gallery...</p>';
    
    try {
        let gallery = [];
        
        if (currentUser && !isGuest) {
            // Load from Firebase for logged-in users
            const snapshot = await database.ref(`users/${currentUser.uid}/gallery`).once('value');
            const galleryData = snapshot.val();
            
            if (galleryData) {
                gallery = Object.entries(galleryData).map(([id, data]) => ({
                    id: id,
                    data: data.downloadURL,
                    timestamp: data.timestamp,
                    session: data.session
                }));
            }
            
            console.log(`📸 Loaded ${gallery.length} photos from Firebase`);
        } else if (isGuest) {
            // Guest mode: No gallery
            grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #8b6914;">👤 Guest Mode: Photos are not saved to gallery.<br>Sign in to save your photos!</p>';
            return;
        } else {
            // Fallback to localStorage
            gallery = JSON.parse(localStorage.getItem('photoGallery') || '[]');
        }
        
        grid.innerHTML = '';
        
        if (gallery.length === 0) {
            grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No photos yet! Start taking some photos!</p>';
            return;
        }
        
        // Sort by timestamp (newest first)
        gallery.sort((a, b) => b.timestamp - a.timestamp);
        
        gallery.forEach(item => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.innerHTML = `
                <img src="${item.data}" alt="Photo from ${new Date(item.timestamp).toLocaleDateString()}">
                <div class="gallery-item-actions">
                    <button onclick="downloadGalleryItem('${item.data}', '${item.id}')" aria-label="Download photo">⬇</button>
                    <button onclick="deleteGalleryItem('${item.id}')" aria-label="Delete photo">🗑</button>
                </div>
            `;
            grid.appendChild(div);
        });
    } catch (error) {
        console.error('Failed to load gallery:', error);
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: red;">Failed to load gallery.</p>';
    }
}

window.downloadGalleryItem = function(data, id) {
    const link = document.createElement('a');
    link.download = `photo-${id}.jpg`;
    link.href = data;
    link.click();
};

window.deleteGalleryItem = async function(id) {
    if (!confirm('Are you sure you want to delete this photo?')) {
        return;
    }
    try {
        if (currentUser && !isGuest) {
            // Delete from Firebase
            await database.ref(`users/${currentUser.uid}/gallery/${id}`).remove();
            
            // Delete from Storage
            try {
                await storage.ref(`users/${currentUser.uid}/gallery/${id}.jpg`).delete();
            } catch (storageError) {
                console.warn('Storage file may not exist:', storageError);
            }
            
            console.log('✅ Photo deleted from Firebase');
        } else {
            // Delete from localStorage
            let gallery = JSON.parse(localStorage.getItem('photoGallery') || '[]');
            gallery = gallery.filter(item => item.id !== parseInt(id));
            localStorage.setItem('photoGallery', JSON.stringify(gallery));
        }
        loadGallery();
    } catch (error) {
        console.error('Failed to delete photo:', error);
        alert('Unable to delete photo: ' + error.message);
    }
};

// Apply filter to live video preview (optimized for performance)
function applyLiveFilter() {
    if (!video.videoWidth || !video.videoHeight) {
        animationId = requestAnimationFrame(applyLiveFilter);
        return;
    }
    
    // Throttle updates for better performance
    const now = performance.now();
    if (now - lastFilterTime < FILTER_THROTTLE) {
        animationId = requestAnimationFrame(applyLiveFilter);
        return;
    }
    lastFilterTime = now;
    
    // Use low-res preview for better performance
    const previewWidth = Math.floor(video.videoWidth * PREVIEW_SCALE);
    const previewHeight = Math.floor(video.videoHeight * PREVIEW_SCALE);
    
    previewCanvas.width = previewWidth;
    previewCanvas.height = previewHeight;
    
    // Draw to low-res canvas
    previewCtx.drawImage(video, 0, 0, previewWidth, previewHeight);
    
    // Apply filter to low-res version
    try {
        filters[currentFilter](previewCtx, previewWidth, previewHeight);
    } catch (error) {
        console.error('Filter error:', error);
    }
    
    // Scale up to display canvas
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(previewCanvas, 0, 0, previewWidth, previewHeight, 0, 0, canvas.width, canvas.height);
    
    animationId = requestAnimationFrame(applyLiveFilter);
}

// Lighting detection (with error handling)
function checkLighting() {
    if (!video.videoWidth) return;
    
    try {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
        tempCtx.drawImage(video, 0, 0);
        
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const data = imageData.data;
        let brightness = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
        }
        brightness = brightness / (data.length / 4);
        
        if (brightness > 120) {
            lightStatus.className = 'light-status light-good';
            lightText.textContent = 'Perfect lighting, you look marvelous!';
        } else if (brightness > 80) {
            lightStatus.className = 'light-status light-medium';
            lightText.textContent = 'Good lighting, darling!';
        } else {
            lightStatus.className = 'light-status light-poor';
            lightText.textContent = 'Low light detected - try brighter area';
        }
    } catch (error) {
        console.error('Lighting detection error:', error);
    }
}

// Filter functions
const filters = {
    sepia: (ctx, w, h) => {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
            data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
            data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        ctx.putImageData(imageData, 0, 0);
        const gradient = ctx.createRadialGradient(w/2, h/2, w/4, w/2, h/2, w*0.8);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    },
    kodachrome: (ctx, w, h) => {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.2);
            data[i + 1] = Math.min(255, data[i + 1] * 1.1);
            data[i + 2] = Math.min(255, data[i + 2] * 0.9);
        }
        ctx.putImageData(imageData, 0, 0);
    },
    polaroid: (ctx, w, h) => {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 0.9 + 20);
            data[i + 1] = Math.min(255, data[i + 1] * 0.85 + 25);
            data[i + 2] = Math.min(255, data[i + 2] * 0.95 + 15);
        }
        ctx.putImageData(imageData, 0, 0);
    },
    film: (ctx, w, h) => {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.1 + 10);
            data[i + 1] = Math.min(255, data[i + 1] * 0.95);
            data[i + 2] = Math.min(255, data[i + 2] * 0.9 + 5);
        }
        ctx.putImageData(imageData, 0, 0);
    },
    vintage: (ctx, w, h) => {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * 1.15 + 15);
            data[i + 1] = Math.min(255, data[i + 1] * 0.95 + 10);
            data[i + 2] = Math.min(255, data[i + 2] * 0.75);
        }
        ctx.putImageData(imageData, 0, 0);
        ctx.fillStyle = 'rgba(255, 248, 220, 0.1)';
        ctx.fillRect(0, 0, w, h);
    },
    cyanotype: (ctx, w, h) => {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = Math.min(255, avg * 0.3);
            data[i + 1] = Math.min(255, avg * 0.6);
            data[i + 2] = Math.min(255, avg * 1.1);
        }
        ctx.putImageData(imageData, 0, 0);
    },
    daguerreotype: (ctx, w, h) => {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const silver = avg * 0.9 + 30;
            data[i] = Math.min(255, silver * 0.95);
            data[i + 1] = Math.min(255, silver * 0.95);
            data[i + 2] = Math.min(255, silver);
        }
        ctx.putImageData(imageData, 0, 0);
        const gradient = ctx.createRadialGradient(w/2, h/2, w/5, w/2, h/2, w*0.75);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.6)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    }
};

// Show screen
function showScreen(screen) {
    [welcomeScreen, cameraAccessScreen, captureScreen, resultsScreen, galleryScreen].forEach(s => {
        s.classList.add('hidden');
        s.style.display = 'none';
    });
    screen.classList.remove('hidden');
    screen.style.display = 'block';
}

// Initialize camera
async function initCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user', width: 640, height: 480 } 
        });
        video.srcObject = stream;
        
        // Wait for video to be ready and actually playing
        video.onloadedmetadata = () => {
            video.play().then(() => {
                console.log('Video is playing:', video.videoWidth, 'x', video.videoHeight);
                showScreen(captureScreen);
                speak('Welcome to our vintage photo booth, darling! You look absolutely stunning!', true);
                applyLiveFilter();
                lightingIntervalId = setInterval(checkLighting, 1000);
            }).catch(err => {
                console.error('Video play error:', err);
                alert('Could not start video playback.');
            });
        };
    } catch (err) {
        console.error('Camera error:', err);
        alert('Camera access denied. Please allow camera access.');
        showScreen(welcomeScreen);
    }
}

// Flash effect
function showFlash() {
    flash.style.display = 'block';
    flash.style.opacity = '1';
    setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.style.display = 'none', 200);
    }, 100);
}

// Take photo
async function takePhoto() {
    // Make sure video is ready
    if (!video.videoWidth || !video.videoHeight) {
        console.error('Video not ready');
        return;
    }
    
    // Set canvas to video dimensions
    captureCanvas.width = video.videoWidth;
    captureCanvas.height = video.videoHeight;
    
    // Draw the current video frame
    captureCtx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
    
    // Apply the current filter
    try {
        filters[currentFilter](captureCtx, captureCanvas.width, captureCanvas.height);
    } catch (error) {
        console.error('Filter application error:', error);
    }
    
    // Convert to image data
    const photoData = captureCanvas.toDataURL('image/jpeg', 0.9);
    
    // Save the photo
    photos.push(photoData);
    
    // Save to gallery (await it to ensure it completes)
    try {
        await saveToGallery(photoData);
    } catch (error) {
        console.error('Error saving to gallery:', error);
    }
    
    // Share with collaborative session
    if (currentSession) {
        sharePhotoWithSession(photoData);
    }
    
    // Show flash effect
    showFlash();
    
    console.log('Photo captured successfully!', photos.length);
}

// Photo sequence
async function startPhotoSequence() {
    console.log('Starting photo sequence...');
    photos = [];
    
    // Get selected number of photos
    const photoCountElement = document.getElementById('photoCountSelect');
    let selectedTotalPhotos = parseInt(photoCountElement.value);
    console.log('Selected total photos:', selectedTotalPhotos);
    
    if (isNaN(selectedTotalPhotos) || selectedTotalPhotos < 2 || selectedTotalPhotos > 4) {
        console.error('Invalid photo count:', selectedTotalPhotos);
        selectedTotalPhotos = 4; // Default fallback
        console.log('Using default:', selectedTotalPhotos);
    }
    
    // Calculate photos per participant in collaborative session
    if (currentSession) {
        const participantCount = Object.keys(connectedUsers).length || 1;
        
        // Each participant takes equal photos - round up to ensure we get at least the selected number
        totalPhotos = Math.ceil(selectedTotalPhotos / participantCount);
        
        console.log(`👥 ${participantCount} participants, ${selectedTotalPhotos} total photos selected`);
        console.log(`📸 Each participant will take ${totalPhotos} photo(s) = ${totalPhotos * participantCount} total photos`);
        
        if (isHost) {
            showNotification(`Each of the ${participantCount} participants will take ${totalPhotos} photo(s)!`);
            // Send command to all participants with the number of photos they should take
            sendHostCommand('capture', { totalPhotos: totalPhotos });
        }
    } else {
        // Non-collaborative: use selected number
        totalPhotos = selectedTotalPhotos;
    }
    
    document.getElementById('captureBtn').disabled = true;
    
    // Announce start immediately
    speak('Get ready, darling! Strike a pose!', true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    for (let i = 0; i < totalPhotos; i++) {
        console.log(`Capturing photo ${i + 1} of ${totalPhotos}`);
        photoCount.textContent = `Photo ${i + 1} of ${totalPhotos}`;
        
        // Countdown
        for (let j = 3; j > 0; j--) {
            countdown.textContent = j;
            countdown.style.display = 'flex';
            
            // Speak and show number simultaneously
            if (j === 3) speak('Three', true);
            else if (j === 2) speak('Two', true);
            else if (j === 1) speak('One', true);
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Take photo
        countdown.textContent = '📷';
        countdown.style.display = 'flex';
        speak('Gorgeous!', true);
        
        console.log('Taking photo now...');
        takePhoto();
        console.log('Photo taken, total photos:', photos.length);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        countdown.style.display = 'none';
        
        // Pause between photos with encouragement
        if (i < totalPhotos - 1) {
            const encouragements = [
                'Fabulous! Next pose!',
                'Stunning! Keep going!',
                'Marvelous! One more!',
                'Perfect! Another one!'
            ];
            speak(encouragements[i % encouragements.length], true);
            await new Promise(resolve => setTimeout(resolve, 1800));
        }
    }
    
    console.log('All photos captured:', photos.length);
    document.getElementById('captureBtn').disabled = false;
    
    if (photos.length > 0) {
        // Always create solo strip first to save soloStripDataUrl
        photoCount.textContent = 'Creating your strip...';
        speak('Your photos are absolutely stunning, darling!', true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create solo strip (this saves soloStripDataUrl)
        await new Promise((resolve) => {
            createPhotoStrip();
            // Give it a moment to render
            setTimeout(resolve, 500);
        });
        
        // In collaborative mode, auto-create and show collaborative strip
        if (currentSession && sessionPhotos.length > 0) {
            photoCount.textContent = 'Creating collaborative strip with everyone...';
            speak('Wonderful! Creating collaborative strip, darling!', true);
            
            // Wait for other participants' photos to fully sync
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Automatically create and show collaborative strip
            console.log('🎉 Auto-creating collaborative strip...');
            await createCollaborativeStrip();
        }
    } else {
        console.error('No photos were captured!');
        alert('No photos were captured. Please try again.');
        resetSession();
    }
}

// Create strip
function createPhotoStrip() {
    const headerText = document.getElementById('headerText').value || 'VINTAGE MEMORIES';
    const layout = document.getElementById('layoutStyle').value;
    const borderStyle = document.getElementById('borderStyle').value;
    const numPhotos = photos.length;
    
    let stripWidth, photoWidth, photoHeight, stripHeight, columns, rows;
    const spacing = 15;
    const headerHeight = 70;
    const footerHeight = 50;
    
    // Configure layout dimensions based on number of photos
    if (layout === 'wide' || layout === 'postcard') {
        // Grid layout
        if (numPhotos === 2) {
            columns = 2;
            rows = 1;
        } else if (numPhotos === 3) {
            columns = 3;
            rows = 1;
        } else {
            columns = 2;
            rows = 2;
        }
        
        if (layout === 'wide') {
            stripWidth = 800;
            photoWidth = numPhotos === 2 ? 360 : (numPhotos === 3 ? 240 : 360);
            photoHeight = 270;
        } else {
            stripWidth = 900;
            photoWidth = numPhotos === 2 ? 420 : (numPhotos === 3 ? 280 : 420);
            photoHeight = 315;
        }
        stripHeight = headerHeight + (photoHeight * rows) + (spacing * (rows + 1)) + footerHeight;
    } else {
        // Classic vertical layout
        stripWidth = 400;
        photoWidth = 370;
        photoHeight = 280;
        columns = 1;
        rows = numPhotos;
        stripHeight = headerHeight + (photoHeight * rows) + (spacing * (rows + 1)) + footerHeight;
    }
    
    stripCanvas.width = stripWidth;
    stripCanvas.height = stripHeight;
    
    // Background
    stripCtx.fillStyle = '#faf8f5';
    stripCtx.fillRect(0, 0, stripWidth, stripHeight);
    
    // Border decoration based on style
    if (borderStyle === 'ornate') {
        stripCtx.strokeStyle = '#8b6914';
        stripCtx.lineWidth = 8;
        stripCtx.strokeRect(10, 10, stripWidth - 20, stripHeight - 20);
        stripCtx.strokeStyle = '#c4a747';
        stripCtx.lineWidth = 3;
        stripCtx.strokeRect(15, 15, stripWidth - 30, stripHeight - 30);
        
        // Add corner decorations
        const corners = [[20, 20], [stripWidth - 20, 20], [20, stripHeight - 20], [stripWidth - 20, stripHeight - 20]];
        stripCtx.fillStyle = '#c4a747';
        corners.forEach(([x, y]) => {
            stripCtx.beginPath();
            stripCtx.arc(x, y, 5, 0, Math.PI * 2);
            stripCtx.fill();
        });
    } else if (borderStyle === 'decorative') {
        stripCtx.strokeStyle = '#8b6914';
        stripCtx.lineWidth = 2;
        stripCtx.setLineDash([10, 5]);
        stripCtx.strokeRect(8, 8, stripWidth - 16, stripHeight - 16);
        stripCtx.setLineDash([5, 10]);
        stripCtx.strokeRect(12, 12, stripWidth - 24, stripHeight - 24);
        stripCtx.setLineDash([]);
    } else if (borderStyle === 'simple') {
        stripCtx.strokeStyle = '#8b6914';
        stripCtx.lineWidth = 4;
        stripCtx.strokeRect(12, 12, stripWidth - 24, stripHeight - 24);
    } else if (borderStyle === 'vintage') {
        // Vintage scalloped edge effect
        stripCtx.strokeStyle = '#8b6914';
        stripCtx.lineWidth = 6;
        stripCtx.strokeRect(10, 10, stripWidth - 20, stripHeight - 20);
        
        // Inner decorative line
        stripCtx.strokeStyle = '#c4a747';
        stripCtx.lineWidth = 1;
        stripCtx.setLineDash([3, 3]);
        stripCtx.strokeRect(18, 18, stripWidth - 36, stripHeight - 36);
        stripCtx.setLineDash([]);
    } else if (borderStyle === 'filmstrip') {
        // Film strip perforations
        stripCtx.fillStyle = '#8b6914';
        stripCtx.fillRect(0, 0, 15, stripHeight);
        stripCtx.fillRect(stripWidth - 15, 0, 15, stripHeight);
        
        // Add perforations
        stripCtx.fillStyle = '#faf8f5';
        for (let y = 10; y < stripHeight - 10; y += 20) {
            stripCtx.fillRect(3, y, 9, 12);
            stripCtx.fillRect(stripWidth - 12, y, 9, 12);
        }
    } else if (borderStyle === 'elegant') {
        // Elegant double border
        stripCtx.strokeStyle = '#6b4423';
        stripCtx.lineWidth = 2;
        stripCtx.strokeRect(8, 8, stripWidth - 16, stripHeight - 16);
        
        stripCtx.strokeStyle = '#c4a747';
        stripCtx.lineWidth = 4;
        stripCtx.strokeRect(14, 14, stripWidth - 28, stripHeight - 28);
        
        stripCtx.strokeStyle = '#8b6914';
        stripCtx.lineWidth = 1;
        stripCtx.strokeRect(20, 20, stripWidth - 40, stripHeight - 40);
    }
    
    // Header
    stripCtx.fillStyle = '#6b4423';
    stripCtx.font = 'bold 28px "Playfair Display", serif';
    stripCtx.textAlign = 'center';
    stripCtx.fillText(headerText, stripWidth / 2, 45);
    
    // Draw photos based on layout
    let loadedPhotos = 0;
    
    photos.forEach((photoData, i) => {
        const img = new Image();
        img.src = photoData;
        img.onload = () => {
            let xPos, yPos;
            
            if (columns === 1) {
                // Classic vertical layout
                xPos = (stripWidth - photoWidth) / 2;
                yPos = headerHeight + spacing + (i * (photoHeight + spacing));
            } else {
                // Grid layout
                const col = i % columns;
                const row = Math.floor(i / columns);
                const totalPhotoWidth = (photoWidth * columns) + (spacing * (columns - 1));
                const startX = (stripWidth - totalPhotoWidth) / 2;
                
                xPos = startX + (col * (photoWidth + spacing));
                yPos = headerHeight + spacing + (row * (photoHeight + spacing));
            }
            
            stripCtx.drawImage(img, xPos, yPos, photoWidth, photoHeight);
            
            stripCtx.strokeStyle = '#3e2723';
            stripCtx.lineWidth = 2;
            stripCtx.strokeRect(xPos, yPos, photoWidth, photoHeight);
            
            loadedPhotos++;
            
            if (loadedPhotos === photos.length) {
                const date = new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                stripCtx.font = 'italic 16px "Libre Baskerville", serif';
                stripCtx.fillStyle = '#8b6914';
                stripCtx.fillText(date, stripWidth / 2, stripHeight - 20);
                
                if (currentSession) {
                    stripCtx.font = '12px "Libre Baskerville", serif';
                    stripCtx.fillText(`Session: ${currentSession}`, stripWidth / 2, stripHeight - 5);
                }
                
                // Save solo strip data URL for later viewing
                soloStripDataUrl = stripCanvas.toDataURL('image/jpeg', 0.95);
                
                showScreen(resultsScreen);
                
                // Hide collaborative strip button and solo strip button initially
                document.getElementById('createCollabStripBtn').style.display = 'none';
                document.getElementById('viewSoloStripBtn').style.display = 'none';
            }
        };
    });
}

// Download functions (with staggered downloads for multiple photos)
function downloadStrip() {
    const link = document.createElement('a');
    link.download = `vintage-photobooth-${Date.now()}.jpg`;
    link.href = stripCanvas.toDataURL('image/jpeg', 0.95);
    link.click();
}

function downloadAllPhotos() {
    photos.forEach((photo, i) => {
        setTimeout(() => {
            const link = document.createElement('a');
            link.download = `photo-${i + 1}-${Date.now()}.jpg`;
            link.href = photo;
            link.click();
        }, i * 200); // Stagger downloads by 200ms
    });
}

// Reset (with proper cleanup)
function resetSession() {
    console.log('🔄 Resetting session...');
    
    // Clear all photo-related data
    photos = [];
    sessionPhotos = [];
    soloStripDataUrl = null;
    photoCount.textContent = '';
    
    // Clear session data
    currentSession = null;
    sessionCodeDisplay.textContent = '';
    isHost = false;
    hostId = null;
    connectedUsers = {};
    participantCount = 1;
    
    // Detach Firebase listeners if session exists
    if (sessionRef) {
        console.log('🗑️ Cleaning up Firebase listeners');
        sessionRef.child('users').off();
        sessionRef.child('photos').off();
        sessionRef.child('commands').off();
        sessionRef.child('collaborativeStrip').off();
        sessionRef.child('sessionEnded').off();
        sessionRef = null;
    }
    
    // Cleanup resources
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    if (lightingIntervalId) {
        clearInterval(lightingIntervalId);
        lightingIntervalId = null;
    }
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    
    // Clear canvases
    if (canvas.width > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (stripCanvas.width > 0) {
        stripCtx.clearRect(0, 0, stripCanvas.width, stripCanvas.height);
    }
    
    console.log('✅ Session reset complete');
    showScreen(welcomeScreen);
}

// End collaborative session - saves collaborative strip for logged-in users
async function endCollaborativeSession() {
    console.log('🏁 Ending collaborative session...');
    
    if (!currentSession) {
        console.warn('No active session to end');
        return;
    }
    
    // Get the current collaborative strip from canvas
    const collabStripDataUrl = stripCanvas.toDataURL('image/jpeg', 0.95);
    
    // Save to gallery for logged-in users (not guests)
    if (currentUser && !isGuest) {
        console.log('💾 Saving collaborative strip to gallery...');
        try {
            await saveToGallery(collabStripDataUrl);
            showNotification('✅ Collaborative strip saved to your gallery!');
        } catch (error) {
            console.error('Failed to save to gallery:', error);
            showNotification('❌ Failed to save to gallery');
        }
    } else {
        showNotification('ℹ️ Guest mode - collaborative strip not saved to gallery');
    }
    
    // Send end session command if host
    if (isHost && sessionRef) {
        console.log('📢 Broadcasting session end to all participants...');
        sessionRef.child('sessionEnded').set({
            endedBy: userId,
            endedByName: userName,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
    }
    
    // Show both strips to user before resetting
    showNotification('🎉 Session ended! Your photos are ready.');
    
    // Wait a moment, then reset
    setTimeout(() => {
        resetSession();
    }, 2000);
}

// Event listeners

// Authentication event listeners
document.getElementById('googleSignInBtn').addEventListener('click', signInWithGoogle);

document.getElementById('emailSignInBtn').addEventListener('click', () => {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    if (email && password) {
        signInWithEmail(email, password);
    } else {
        alert('Please enter both email and password');
    }
});

document.getElementById('emailSignUpBtn').addEventListener('click', () => {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    if (email && password) {
        signUpWithEmail(email, password);
    } else {
        alert('Please enter both email and password');
    }
});

document.getElementById('continueAsGuestBtn').addEventListener('click', continueAsGuest);

document.getElementById('logoutBtn').addEventListener('click', logout);

// Navigation event listeners
document.getElementById('startSoloBtn').addEventListener('click', () => {
    currentSession = null;
    showScreen(cameraAccessScreen);
});

document.getElementById('createCollabBtn').addEventListener('click', () => {
    currentSession = generateSessionCode();
    
    // Clear any old session data from Firebase before creating new session
    if (database && currentSession) {
        console.log('🗑️ Clearing old session data for:', currentSession);
        database.ref('sessions/' + currentSession).remove().then(() => {
            console.log('✅ Old session data cleared');
            // Now initialize the fresh session
            initializeFirebaseSession(currentSession, true); // Pass true to mark as host
            
            const sessionCodeText = document.getElementById('sessionCodeText');
            const copyCodeBtn = document.getElementById('copyCodeBtn');
            
            if (sessionCodeText) {
                sessionCodeText.innerHTML = `👑 You're the host! Share code: <strong>${currentSession}</strong>`;
            }
            if (copyCodeBtn) {
                copyCodeBtn.style.display = 'inline-block';
            }
            
            showScreen(cameraAccessScreen);
        }).catch((error) => {
            console.warn('⚠️ Could not clear old session:', error);
            // Continue anyway with fresh session
            initializeFirebaseSession(currentSession, true);
            
            const sessionCodeText = document.getElementById('sessionCodeText');
            const copyCodeBtn = document.getElementById('copyCodeBtn');
            
            if (sessionCodeText) {
                sessionCodeText.innerHTML = `👑 You're the host! Share code: <strong>${currentSession}</strong>`;
            }
            if (copyCodeBtn) {
                copyCodeBtn.style.display = 'inline-block';
            }
            
            showScreen(cameraAccessScreen);
        });
    } else {
        // Firebase not available, proceed normally
        initializeFirebaseSession(currentSession, true);
        
        const sessionCodeText = document.getElementById('sessionCodeText');
        const copyCodeBtn = document.getElementById('copyCodeBtn');
        
        if (sessionCodeText) {
            sessionCodeText.innerHTML = `👑 You're the host! Share code: <strong>${currentSession}</strong>`;
        }
        if (copyCodeBtn) {
            copyCodeBtn.style.display = 'inline-block';
        }
        
        showScreen(cameraAccessScreen);
    }
});

document.getElementById('joinSessionBtn').addEventListener('click', () => {
    const code = document.getElementById('sessionCodeInput').value.toUpperCase();
    if (code.length === 6) {
        initializeFirebaseSession(code, false); // Pass false for participants
        
        const sessionCodeText = document.getElementById('sessionCodeText');
        const copyCodeBtn = document.getElementById('copyCodeBtn');
        
        if (sessionCodeText) {
            sessionCodeText.innerHTML = `Joining session: <strong>${code}</strong>`;
        }
        if (copyCodeBtn) {
            copyCodeBtn.style.display = 'none'; // Hide copy button for participants
        }
        
        showScreen(cameraAccessScreen);
    } else {
        alert('Please enter a valid 6-character session code');
    }
});

document.getElementById('enableCameraBtn').addEventListener('click', initCamera);
document.getElementById('captureBtn').addEventListener('click', startPhotoSequence);
document.getElementById('downloadBtn').addEventListener('click', downloadStrip);
document.getElementById('downloadAllBtn').addEventListener('click', downloadAllPhotos);
document.getElementById('createCollabStripBtn').addEventListener('click', async () => {
    console.log('Creating collaborative strip...');
    await createCollaborativeStrip();
});

document.getElementById('viewSoloStripBtn').addEventListener('click', () => {
    console.log('Showing solo strip...');
    if (soloStripDataUrl) {
        // Load the saved solo strip back onto the canvas
        const img = new Image();
        img.src = soloStripDataUrl;
        img.onload = () => {
            stripCanvas.width = img.width;
            stripCanvas.height = img.height;
            stripCtx.clearRect(0, 0, stripCanvas.width, stripCanvas.height);
            stripCtx.drawImage(img, 0, 0);
            
            // Hide solo strip button, show collaborative strip button
            document.getElementById('viewSoloStripBtn').style.display = 'none';
            document.getElementById('endSessionBtn').style.display = 'none';
            if (currentSession && sessionPhotos.length > 0) {
                document.getElementById('createCollabStripBtn').style.display = 'inline-block';
            }
        };
    }
});

document.getElementById('endSessionBtn').addEventListener('click', async () => {
    if (confirm('End this collaborative session? The collaborative strip will be saved to your gallery (if logged in).')) {
        await endCollaborativeSession();
    }
});

document.getElementById('newSessionBtn').addEventListener('click', resetSession);
document.getElementById('backToWelcomeBtn').addEventListener('click', resetSession);

document.getElementById('viewGalleryBtn').addEventListener('click', () => {
    loadGallery();
    showScreen(galleryScreen);
});

document.getElementById('backFromGalleryBtn').addEventListener('click', () => {
    showScreen(welcomeScreen);
});

// Copy session code to clipboard
document.getElementById('copyCodeBtn').addEventListener('click', async () => {
    const copyBtn = document.getElementById('copyCodeBtn');
    const sessionCode = currentSession;
    
    if (!sessionCode) {
        alert('No session code to copy');
        return;
    }
    
    try {
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(sessionCode);
            
            // Visual feedback
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✅ Copied!';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
            
            console.log('📋 Session code copied:', sessionCode);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = sessionCode;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                
                // Visual feedback
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✅ Copied!';
                copyBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.classList.remove('copied');
                }, 2000);
                
                console.log('📋 Session code copied (fallback):', sessionCode);
            } catch (err) {
                console.error('Failed to copy:', err);
                alert('Failed to copy. Code: ' + sessionCode);
            }
            
            document.body.removeChild(textArea);
        }
    } catch (err) {
        console.error('Failed to copy session code:', err);
        alert('Failed to copy. Session code: ' + sessionCode);
    }
});


document.getElementById('clearGalleryBtn').addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear your entire gallery?')) {
        try {
            if (currentUser && !isGuest) {
                // Clear Firebase gallery
                const snapshot = await database.ref(`users/${currentUser.uid}/gallery`).once('value');
                const gallery = snapshot.val();
                
                if (gallery) {
                    // Delete all photos from Storage
                    for (const photoId in gallery) {
                        try {
                            await storage.ref(`users/${currentUser.uid}/gallery/${photoId}.jpg`).delete();
                        } catch (err) {
                            console.warn('Could not delete storage file:', err);
                        }
                    }
                    
                    // Delete all metadata from database
                    await database.ref(`users/${currentUser.uid}/gallery`).remove();
                    console.log('✅ Gallery cleared from Firebase');
                }
            } else {
                // Clear localStorage
                localStorage.removeItem('photoGallery');
            }
            loadGallery();
        } catch (error) {
            console.error('Failed to clear gallery:', error);
            alert('Unable to clear gallery.');
        }
    }
});

// Filter selection
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        // The live preview will automatically update with the new filter
    });
});

// Initialize authentication and voice selection on page load
console.log('🎬 Initializing Vintage PhotoBooth...');
initAuth();
initVoiceSelection();