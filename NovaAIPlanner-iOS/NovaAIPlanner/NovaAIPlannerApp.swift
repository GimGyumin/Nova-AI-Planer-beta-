//
//  NovaAIPlannerApp.swift
//  NovaAIPlanner
//
//  Created by Nova Team
//  iOS SwiftUI Implementation - Portrait Mode
//

import SwiftUI
import Firebase
import GoogleSignIn

@main
struct NovaAIPlannerApp: App {
    @StateObject private var appState = AppState()
    
    init() {
        // Configure Firebase
        FirebaseApp.configure()
        
        // Lock orientation to portrait
        UIDevice.current.setValue(UIInterfaceOrientation.portrait.rawValue, forKey: "orientation")
        UINavigationController.attemptRotationToDeviceOrientationChange()
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .preferredColorScheme(appState.themeMode == .dark ? .dark : appState.themeMode == .light ? .light : nil)
                .onAppear {
                    // Restore authentication state
                    GIDSignIn.sharedInstance.restorePreviousSignIn { user, error in
                        if let user = user {
                            appState.currentUser = user
                        }
                    }
                }
        }
    }
}

// MARK: - App State Management
class AppState: ObservableObject {
    @Published var currentUser: GIDGoogleUser?
    @Published var goals: [Goal] = []
    @Published var folders: [Folder] = []
    @Published var themeMode: ThemeMode = .system
    @Published var backgroundTheme: String = "default"
    @Published var language: String = Locale.current.language.languageCode?.identifier ?? "en"
    @Published var isAutoSyncEnabled: Bool = true
    @Published var apiKey: String = ""
    @Published var isOfflineMode: Bool = false
    
    init() {
        loadUserPreferences()
    }
    
    private func loadUserPreferences() {
        if let themeRawValue = UserDefaults.standard.string(forKey: "themeMode"),
           let theme = ThemeMode(rawValue: themeRawValue) {
            themeMode = theme
        }
        backgroundTheme = UserDefaults.standard.string(forKey: "backgroundTheme") ?? "default"
        language = UserDefaults.standard.string(forKey: "language") ?? Locale.current.language.languageCode?.identifier ?? "en"
        isAutoSyncEnabled = UserDefaults.standard.bool(forKey: "isAutoSyncEnabled")
        apiKey = UserDefaults.standard.string(forKey: "apiKey") ?? ""
        isOfflineMode = UserDefaults.standard.bool(forKey: "isOfflineMode")
    }
    
    func saveUserPreferences() {
        UserDefaults.standard.set(themeMode.rawValue, forKey: "themeMode")
        UserDefaults.standard.set(backgroundTheme, forKey: "backgroundTheme")
        UserDefaults.standard.set(language, forKey: "language")
        UserDefaults.standard.set(isAutoSyncEnabled, forKey: "isAutoSyncEnabled")
        UserDefaults.standard.set(apiKey, forKey: "apiKey")
        UserDefaults.standard.set(isOfflineMode, forKey: "isOfflineMode")
    }
}

enum ThemeMode: String {
    case light
    case dark
    case system
}
