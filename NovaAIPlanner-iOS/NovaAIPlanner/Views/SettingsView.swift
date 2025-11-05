//
//  SettingsView.swift
//  NovaAIPlanner
//
//  Settings and preferences view
//

import SwiftUI
import FirebaseAuth
import GoogleSignIn

struct SettingsView: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) var dismiss
    @State private var showingSignOutAlert = false
    @State private var showingDeleteAlert = false
    
    var body: some View {
        NavigationView {
            List {
                // Account Section
                Section("Account") {
                    if let user = appState.currentUser {
                        HStack {
                            if let photoURL = user.profile?.imageURL(withDimension: 40) {
                                AsyncImage(url: photoURL) { image in
                                    image.resizable().aspectRatio(contentMode: .fill)
                                } placeholder: {
                                    Circle().fill(Color.gray.opacity(0.3))
                                }
                                .frame(width: 40, height: 40)
                                .clipShape(Circle())
                            }
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text(user.profile?.name ?? "User")
                                    .font(.headline)
                                Text(user.profile?.email ?? "")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                        }
                        
                        Button(action: { showingSignOutAlert = true }) {
                            Text("Sign Out")
                                .foregroundColor(.red)
                        }
                    } else {
                        Button(action: signInWithGoogle) {
                            HStack {
                                Image(systemName: "person.circle")
                                Text("Sign in with Google")
                            }
                        }
                    }
                }
                
                // Appearance Section
                Section("Appearance") {
                    Picker("Theme", selection: $appState.themeMode) {
                        Text("Light").tag(ThemeMode.light)
                        Text("Dark").tag(ThemeMode.dark)
                        Text("System").tag(ThemeMode.system)
                    }
                    
                    NavigationLink("Background Theme") {
                        BackgroundThemeView()
                    }
                }
                
                // General Section
                Section("General") {
                    Picker("Language", selection: $appState.language) {
                        Text("English").tag("en")
                        Text("한국어").tag("ko")
                    }
                    
                    NavigationLink("Notifications") {
                        NotificationSettingsView()
                    }
                    
                    Toggle("Offline Mode", isOn: $appState.isOfflineMode)
                        .onChange(of: appState.isOfflineMode) { _ in
                            appState.saveUserPreferences()
                        }
                }
                
                // Sync Section
                if appState.currentUser != nil {
                    Section("Cloud Sync") {
                        Toggle("Auto Sync", isOn: $appState.isAutoSyncEnabled)
                            .onChange(of: appState.isAutoSyncEnabled) { _ in
                                appState.saveUserPreferences()
                            }
                    }
                }
                
                // AI Section
                Section("AI Features") {
                    SecureField("Gemini API Key", text: $appState.apiKey)
                        .onChange(of: appState.apiKey) { _ in
                            appState.saveUserPreferences()
                        }
                    
                    Text("Get your API key from ai.google.dev")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                // Data Management
                Section("Data") {
                    Button("Export Data") {
                        exportData()
                    }
                    
                    Button("Import Data") {
                        // Import functionality
                    }
                    
                    Button(role: .destructive, action: { showingDeleteAlert = true }) {
                        Text("Delete All Data")
                    }
                }
                
                // About Section
                Section("About") {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("2.0")
                            .foregroundColor(.secondary)
                    }
                    
                    HStack {
                        Text("Developer")
                        Spacer()
                        Text("Kim Kyumin")
                            .foregroundColor(.secondary)
                    }
                    
                    Link("Usage Guide", destination: URL(string: "https://github.com")!)
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        appState.saveUserPreferences()
                        dismiss()
                    }
                }
            }
            .alert("Sign Out", isPresented: $showingSignOutAlert) {
                Button("Cancel", role: .cancel) { }
                Button("Sign Out", role: .destructive) {
                    signOut()
                }
            } message: {
                Text("Are you sure you want to sign out?")
            }
            .alert("Delete All Data", isPresented: $showingDeleteAlert) {
                Button("Cancel", role: .cancel) { }
                Button("Delete", role: .destructive) {
                    deleteAllData()
                }
            } message: {
                Text("This will permanently delete all your goals and data. This action cannot be undone.")
            }
        }
    }
    
    // MARK: - Actions
    private func signInWithGoogle() {
        guard let presentingViewController = UIApplication.shared.windows.first?.rootViewController else {
            return
        }
        
        GIDSignIn.sharedInstance.signIn(withPresenting: presentingViewController) { result, error in
            if let error = error {
                print("Sign-In Error: \(error.localizedDescription)")
                return
            }
            
            guard let user = result?.user else { return }
            appState.currentUser = user
            
            // Firebase authentication
            guard let idToken = user.idToken?.tokenString else { return }
            let credential = GoogleAuthProvider.credential(withIDToken: idToken, accessToken: user.accessToken.tokenString)
            
            Auth.auth().signIn(with: credential) { _, error in
                if let error = error {
                    print("Firebase Auth Error: \(error.localizedDescription)")
                }
            }
        }
    }
    
    private func signOut() {
        GIDSignIn.sharedInstance.signOut()
        try? Auth.auth().signOut()
        appState.currentUser = nil
    }
    
    private func exportData() {
        // Export data to JSON file
        let viewModel = GoalViewModel()
        let data = [
            "goals": viewModel.goals,
            "folders": viewModel.folders
        ] as [String : Any]
        
        if let jsonData = try? JSONSerialization.data(withJSONObject: data),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            // Share sheet
            let activityVC = UIActivityViewController(activityItems: [jsonString], applicationActivities: nil)
            UIApplication.shared.windows.first?.rootViewController?.present(activityVC, animated: true)
        }
    }
    
    private func deleteAllData() {
        UserDefaults.standard.removeObject(forKey: "goals")
        UserDefaults.standard.removeObject(forKey: "folders")
        
        if let userId = Auth.auth().currentUser?.uid {
            // Delete from Firebase
            let db = Firestore.firestore()
            db.collection("users").document(userId).collection("goals").getDocuments { snapshot, _ in
                snapshot?.documents.forEach { $0.reference.delete() }
            }
            db.collection("users").document(userId).collection("folders").getDocuments { snapshot, _ in
                snapshot?.documents.forEach { $0.reference.delete() }
            }
        }
    }
}

// MARK: - Background Theme View
struct BackgroundThemeView: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.colorScheme) var colorScheme
    
    private let themes = [
        ("default", "Default"),
        ("pink", "Pink"),
        ("cherry_noir", "Cherry Noir"),
        ("blue", "Blue"),
        ("deep_ocean", "Deep Ocean"),
        ("green", "Green"),
        ("forest_green", "Forest Green"),
        ("purple", "Purple"),
        ("royal_purple", "Royal Purple")
    ]
    
    var body: some View {
        List {
            ForEach(themes, id: \.0) { theme in
                Button(action: {
                    appState.backgroundTheme = theme.0
                    appState.saveUserPreferences()
                }) {
                    HStack {
                        Text(theme.1)
                            .foregroundColor(.primary)
                        Spacer()
                        if appState.backgroundTheme == theme.0 {
                            Image(systemName: "checkmark")
                                .foregroundColor(.accentColor)
                        }
                    }
                }
            }
        }
        .navigationTitle("Background Theme")
        .navigationBarTitleDisplayMode(.inline)
    }
}

// MARK: - Notification Settings View
struct NotificationSettingsView: View {
    @State private var deadlineAlerts = true
    @State private var suggestions = true
    @State private var achievements = true
    @State private var reminders = true
    
    var body: some View {
        List {
            Section("Notification Types") {
                Toggle("Deadline Alerts", isOn: $deadlineAlerts)
                Toggle("Daily Suggestions", isOn: $suggestions)
                Toggle("Achievement Celebrations", isOn: $achievements)
                Toggle("General Reminders", isOn: $reminders)
            }
            
            Section("Reminder Time") {
                DatePicker("Start Time", selection: .constant(Date()), displayedComponents: .hourAndMinute)
                DatePicker("End Time", selection: .constant(Date()), displayedComponents: .hourAndMinute)
            }
            
            Section {
                Button("Request Notification Permission") {
                    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .badge, .sound]) { granted, _ in
                        print("Notification permission: \(granted)")
                    }
                }
            }
        }
        .navigationTitle("Notifications")
        .navigationBarTitleDisplayMode(.inline)
    }
}
