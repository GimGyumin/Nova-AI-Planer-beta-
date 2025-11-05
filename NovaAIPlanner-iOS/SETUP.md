# Nova AI Planner - iOS Implementation

## Quick Start Guide

### Prerequisites
- macOS with Xcode 15.0+ installed
- iOS 16.0+ device or simulator
- Firebase account
- Google Cloud account for Gemini AI (optional)

### Setup Steps

1. **Open the Project**
   ```bash
   cd NovaAIPlanner-iOS
   open NovaAIPlanner.xcodeproj
   ```

2. **Install Dependencies**
   - Dependencies are managed via Swift Package Manager
   - Xcode will automatically resolve packages on first build
   - Required packages:
     - Firebase iOS SDK
     - GoogleSignIn iOS SDK

3. **Configure Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Add an iOS app
   - Download `GoogleService-Info.plist`
   - Add it to the NovaAIPlanner folder in Xcode

4. **Configure Google Sign-In**
   - Open `GoogleService-Info.plist`
   - Find `REVERSED_CLIENT_ID`
   - Open `Info.plist`
   - Replace `YOUR_CLIENT_ID` in CFBundleURLSchemes with the reversed client ID

5. **Build and Run**
   - Select a target device or simulator
   - Press Cmd+R or click the Play button
   - The app will launch in portrait mode

### Features Implemented

✅ **Goal Management**
- Create goals using WOOP framework (5-step wizard)
- Edit and delete goals
- Mark goals as complete
- Recurring goals with streak tracking

✅ **Organization**
- Folder-based organization
- Category tags
- Filter and sort options

✅ **Views**
- List view with filters
- Calendar view (3-day, week, month)
- WOOP cards view

✅ **Synchronization**
- Firebase Firestore integration
- Google Sign-In authentication
- Auto-sync with toggle option
- Offline mode with local storage

✅ **Customization**
- Light/Dark/System theme modes
- 9 background color schemes
- English and Korean language support

✅ **Settings**
- Account management
- Theme preferences
- Notification settings
- Data import/export

### Architecture

```
MVVM Pattern:
- Models: Data structures (Goal, Folder, etc.)
- ViewModels: Business logic (GoalViewModel)
- Views: SwiftUI views
- AppState: Global app state management
```

### Key Files

- `NovaAIPlannerApp.swift`: App entry point with Firebase config
- `ContentView.swift`: Main tab-based navigation
- `Models.swift`: All data models
- `GoalViewModel.swift`: Core business logic
- `Views/`: All SwiftUI view components

### Portrait-Only Configuration

The app is configured for portrait-only orientation:
- Info.plist: `UISupportedInterfaceOrientations` set to Portrait only
- `UIRequiresFullScreen` is enabled
- Orientation is locked programmatically in the app delegate

### Testing

Run the app on different devices to ensure proper layout:
- iPhone SE (smallest screen)
- iPhone 14 (standard screen)
- iPhone 14 Pro Max (largest screen)
- iPad (portrait mode only)

### Troubleshooting

**Build Errors:**
- Clean build folder: Shift+Cmd+K
- Resolve packages: File > Packages > Resolve Package Versions
- Check Xcode version compatibility

**Firebase Issues:**
- Verify GoogleService-Info.plist is in the correct location
- Check bundle identifier matches Firebase console
- Ensure Firestore and Auth are enabled

**Google Sign-In Issues:**
- Verify REVERSED_CLIENT_ID in URL schemes
- Check Google Sign-In is enabled in Firebase Auth
- Test on a real device (simulators may have issues)

### Next Steps

1. Test all features thoroughly
2. Add custom branding and icons
3. Configure push notifications
4. Submit to TestFlight for beta testing
5. Prepare App Store listing

### Support

For issues or questions:
- Check the main README.md for detailed documentation
- Review Firebase and GoogleSignIn official documentation
- Check Xcode console for error messages

---

**Note**: This is a complete iOS implementation maintaining feature parity with the web application, optimized for portrait orientation.
