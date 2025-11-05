# Nova AI Planner - iOS (SwiftUI)

## 🎯 Overview
Native iOS implementation of Nova AI Planner with SwiftUI, optimized for portrait orientation. This app maintains all features from the web version while providing a native iOS experience.

## ✨ Features

### Core Features
- **WOOP Framework**: 5-step goal creation (Wish, Outcome, Obstacle, Plan, Settings)
- **Goal Management**: Create, edit, delete, and track goals
- **Folder Organization**: Organize goals into folders with custom colors
- **Calendar Views**: 3-day, weekly, and monthly calendar views
- **WOOP Cards**: Visual cards displaying complete WOOP goals
- **Recurring Goals**: Set goals to repeat on specific days with streak tracking

### Cloud & Sync
- **Firebase Integration**: Cloud storage with Firestore
- **Google Sign-In**: Secure authentication
- **Auto-Sync**: Automatic synchronization across devices
- **Offline Mode**: Full functionality without internet connection

### Customization
- **Theme Modes**: Light, Dark, and System auto-switch
- **Background Themes**: 9 different background color schemes
- **Multi-language**: English and Korean support

### AI Features
- **Gemini AI Integration**: AI-powered goal suggestions
- **Smart Sorting**: AI-based priority sorting
- **Goal Feedback**: Real-time feedback on goal quality

## 📱 Requirements
- iOS 16.0+
- Xcode 15.0+
- Swift 5.9+

## 🏗️ Architecture

### Project Structure
```
NovaAIPlanner/
├── NovaAIPlannerApp.swift      # App entry point
├── ContentView.swift            # Main view with tab navigation
├── Models.swift                 # Data models
├── GoalViewModel.swift          # Business logic & Firebase sync
└── Views/
    ├── GoalListView.swift       # Goal list with filters
    ├── GoalDetailView.swift     # Goal details with WOOP info
    ├── GoalCreateView.swift     # 5-step goal creation wizard
    ├── CalendarView.swift       # Calendar with multiple views
    ├── WOOPCardsView.swift      # WOOP framework cards
    └── SettingsView.swift       # Settings and preferences
```

### Dependencies
- **Firebase** (10.0.0+): Backend services
  - FirebaseAuth: User authentication
  - FirebaseFirestore: Cloud database
  - FirebaseAnalytics: Usage analytics
- **GoogleSignIn** (7.0.0+): Google authentication

## 🚀 Getting Started

### 1. Prerequisites
Install Xcode from the Mac App Store.

### 2. Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add an iOS app to your Firebase project
3. Download `GoogleService-Info.plist`
4. Place it in the `NovaAIPlanner` directory
5. Enable Authentication (Google Sign-In) in Firebase Console
6. Enable Firestore Database in Firebase Console

### 3. Google Sign-In Setup
1. In Firebase Console, go to Authentication > Sign-in method
2. Enable Google Sign-In
3. Copy the iOS URL Scheme from GoogleService-Info.plist
4. Add it to Info.plist under URL Types

### 4. Build & Run
1. Open `NovaAIPlanner.xcodeproj` in Xcode
2. Select a simulator or connected device
3. Press Cmd+R to build and run

## 🎨 Features Comparison with Web App

| Feature | Web App | iOS App | Status |
|---------|---------|---------|--------|
| WOOP Goal Creation | ✅ | ✅ | Complete |
| Goal Management | ✅ | ✅ | Complete |
| Folder Organization | ✅ | ✅ | Complete |
| Calendar View | ✅ | ✅ | Complete |
| Firebase Sync | ✅ | ✅ | Complete |
| Google Sign-In | ✅ | ✅ | Complete |
| Theme Switching | ✅ | ✅ | Complete |
| Multi-language | ✅ | ✅ | Complete |
| Offline Mode | ✅ | ✅ | Complete |
| Push Notifications | ⚠️ | ✅ | iOS Native |
| PWA Install | ✅ | N/A | Not Applicable |

## 📐 Design Principles

### Portrait-Only Orientation
The app is locked to portrait orientation for optimal mobile experience:
```swift
INFOPLIST_KEY_UISupportedInterfaceOrientations = UIInterfaceOrientationPortrait
```

### SwiftUI Best Practices
- **MVVM Architecture**: Clear separation of views and business logic
- **Observable Objects**: Reactive data flow with @Published properties
- **Environment Objects**: Shared state across views
- **Async/Await**: Modern concurrency for Firebase operations

### UI/UX Principles
- **Native iOS Design**: Follows Apple Human Interface Guidelines
- **Consistent Navigation**: Bottom tab bar for main sections
- **Progressive Disclosure**: 5-step wizard for complex goal creation
- **Haptic Feedback**: Tactile responses for user actions
- **Dark Mode**: Full support with automatic switching

## 🔧 Configuration

### Info.plist Keys
```xml
<key>CFBundleDisplayName</key>
<string>Nova AI Planner</string>

<key>UISupportedInterfaceOrientations</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
</array>

<key>UIRequiresFullScreen</key>
<true/>

<key>LSApplicationCategoryType</key>
<string>public.app-category.productivity</string>
```

## 🔐 Security

### Data Protection
- All user data stored in Firebase Firestore
- Local data encrypted using iOS Keychain (UserDefaults for non-sensitive data)
- Secure authentication with Google OAuth 2.0

### Privacy
- No personal data collected without explicit consent
- Firebase Analytics can be disabled in settings
- Offline mode available for privacy-conscious users

## 📱 Testing

### Unit Tests
```bash
# Run tests from Xcode
Product > Test (Cmd+U)
```

### UI Tests
```bash
# Run UI tests
Product > Test (Cmd+U with UI Test target selected)
```

### Device Testing
Recommended testing on:
- iPhone SE (3rd gen) - Small screen
- iPhone 14 - Standard screen
- iPhone 14 Pro Max - Large screen
- iPad (Portrait mode)

## 🚀 Deployment

### TestFlight
1. Archive the app: Product > Archive
2. Upload to App Store Connect
3. Submit for TestFlight review
4. Share TestFlight link with beta testers

### App Store
1. Complete App Store Connect metadata
2. Provide screenshots (required sizes)
3. Submit for App Store review
4. Monitor review status

## 🌐 Localization

### Supported Languages
- English (en)
- Korean (ko)

### Adding New Languages
1. Add language in Xcode project settings
2. Create Localizable.strings file
3. Update translation dictionaries in views
4. Test with language switcher in Settings

## 🤝 Contributing

This is a direct iOS port of the web application. When contributing:
1. Maintain feature parity with web app
2. Follow Swift and SwiftUI best practices
3. Ensure portrait-only compatibility
4. Test on multiple device sizes
5. Update this README with any changes

## 📄 License

© 2025 Kim Kyumin. All Rights Reserved.

## 🆘 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/GimGyumin/Nova-AI-Planer-beta-/issues)
- Email: support@nova-planner.com

## 🎯 Roadmap

### Planned Features
- [ ] Apple Watch companion app
- [ ] Widgets for home screen
- [ ] Siri Shortcuts integration
- [ ] Share extension for quick goal creation
- [ ] iCloud sync as alternative to Firebase
- [ ] Advanced AI features with on-device ML

### In Progress
- [x] Portrait-only iOS implementation
- [x] Firebase cloud sync
- [x] Google Sign-In
- [x] Theme customization
- [x] Multi-language support

### Completed
- [x] Core goal management
- [x] WOOP framework implementation
- [x] Calendar views
- [x] Folder organization
- [x] Offline mode
