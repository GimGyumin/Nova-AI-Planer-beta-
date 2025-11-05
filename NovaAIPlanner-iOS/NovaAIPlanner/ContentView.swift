//
//  ContentView.swift
//  NovaAIPlanner
//
//  Main view with tab-based navigation
//

import SwiftUI
import GoogleSignIn
import FirebaseAuth

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var goalViewModel = GoalViewModel()
    @State private var selectedTab = 0
    @State private var showingSettings = false
    @State private var showingGoalCreate = false
    
    var body: some View {
        NavigationView {
            ZStack {
                // Background gradient based on theme
                backgroundGradient
                    .ignoresSafeArea()
                
                // Main tab view
                TabView(selection: $selectedTab) {
                    // Goals List View
                    GoalListView(viewModel: goalViewModel, onAdd: {
                        showingGoalCreate = true
                    })
                    .tabItem {
                        Label("Goals", systemImage: "list.bullet")
                    }
                    .tag(0)
                    
                    // Calendar View
                    CalendarView(goals: goalViewModel.goals)
                    .tabItem {
                        Label("Calendar", systemImage: "calendar")
                    }
                    .tag(1)
                    
                    // WOOP View
                    WOOPCardsView(goals: goalViewModel.goals)
                    .tabItem {
                        Label("WOOP", systemImage: "sparkles")
                    }
                    .tag(2)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { showingSettings = true }) {
                        Image(systemName: "gearshape.fill")
                            .foregroundColor(.primary)
                    }
                }
                
                ToolbarItem(placement: .principal) {
                    Text(localizedString("my_goals_title"))
                        .font(.headline)
                        .foregroundColor(.primary)
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    if appState.currentUser != nil {
                        HStack(spacing: 12) {
                            // Sync status indicator
                            if goalViewModel.isSyncing {
                                ProgressView()
                                    .scaleEffect(0.8)
                            }
                            
                            // User avatar
                            if let photoURL = appState.currentUser?.profile?.imageURL(withDimension: 32) {
                                AsyncImage(url: photoURL) { image in
                                    image
                                        .resizable()
                                        .aspectRatio(contentMode: .fill)
                                } placeholder: {
                                    Circle()
                                        .fill(Color.gray.opacity(0.3))
                                }
                                .frame(width: 32, height: 32)
                                .clipShape(Circle())
                            }
                        }
                    } else {
                        Button(action: { signInWithGoogle() }) {
                            HStack {
                                Image(systemName: "person.circle")
                                Text("Sign In")
                            }
                            .foregroundColor(.primary)
                        }
                    }
                }
            }
            .sheet(isPresented: $showingSettings) {
                SettingsView()
                    .environmentObject(appState)
            }
            .sheet(isPresented: $showingGoalCreate) {
                GoalCreateView(viewModel: goalViewModel)
                    .environmentObject(appState)
            }
        }
        .navigationViewStyle(StackNavigationViewStyle()) // Force portrait
        .onAppear {
            goalViewModel.appState = appState
            goalViewModel.loadGoals()
        }
    }
    
    // MARK: - Background Gradient
    private var backgroundGradient: some View {
        Group {
            switch appState.backgroundTheme {
            case "pink":
                LinearGradient(colors: [Color(red: 1, green: 0.95, blue: 0.98), Color(red: 1, green: 0.9, blue: 0.95)], startPoint: .topLeading, endPoint: .bottomTrailing)
            case "cherry_noir":
                LinearGradient(colors: [Color(red: 0.2, green: 0.1, blue: 0.15), Color(red: 0.3, green: 0.15, blue: 0.2)], startPoint: .topLeading, endPoint: .bottomTrailing)
            case "blue":
                LinearGradient(colors: [Color(red: 0.95, green: 0.98, blue: 1), Color(red: 0.9, green: 0.95, blue: 1)], startPoint: .topLeading, endPoint: .bottomTrailing)
            case "deep_ocean":
                LinearGradient(colors: [Color(red: 0.1, green: 0.15, blue: 0.25), Color(red: 0.15, green: 0.2, blue: 0.35)], startPoint: .topLeading, endPoint: .bottomTrailing)
            case "green":
                LinearGradient(colors: [Color(red: 0.95, green: 1, blue: 0.95), Color(red: 0.9, green: 1, blue: 0.9)], startPoint: .topLeading, endPoint: .bottomTrailing)
            case "forest_green":
                LinearGradient(colors: [Color(red: 0.1, green: 0.2, blue: 0.15), Color(red: 0.15, green: 0.25, blue: 0.2)], startPoint: .topLeading, endPoint: .bottomTrailing)
            case "purple":
                LinearGradient(colors: [Color(red: 0.98, green: 0.95, blue: 1), Color(red: 0.95, green: 0.9, blue: 1)], startPoint: .topLeading, endPoint: .bottomTrailing)
            case "royal_purple":
                LinearGradient(colors: [Color(red: 0.2, green: 0.1, blue: 0.3), Color(red: 0.3, green: 0.15, blue: 0.4)], startPoint: .topLeading, endPoint: .bottomTrailing)
            default:
                Color(uiColor: .systemBackground)
            }
        }
    }
    
    // MARK: - Google Sign In
    private func signInWithGoogle() {
        guard let presentingViewController = UIApplication.shared.windows.first?.rootViewController else {
            return
        }
        
        GIDSignIn.sharedInstance.signIn(withPresenting: presentingViewController) { result, error in
            if let error = error {
                print("Google Sign-In Error: \(error.localizedDescription)")
                return
            }
            
            guard let user = result?.user else { return }
            appState.currentUser = user
            
            // Authenticate with Firebase
            guard let idToken = user.idToken?.tokenString else { return }
            let credential = GoogleAuthProvider.credential(withIDToken: idToken, accessToken: user.accessToken.tokenString)
            
            Auth.auth().signIn(with: credential) { authResult, error in
                if let error = error {
                    print("Firebase Auth Error: \(error.localizedDescription)")
                    return
                }
                
                // Load user data after successful sign-in
                goalViewModel.loadGoalsFromFirebase()
            }
        }
    }
    
    // MARK: - Localization Helper
    private func localizedString(_ key: String) -> String {
        // Simple localization - in production, use proper localization files
        let translations: [String: [String: String]] = [
            "ko": [
                "my_goals_title": "나의 목표",
                "all_goals": "전체",
                "add_new_goal": "새로운 목표 추가"
            ],
            "en": [
                "my_goals_title": "My Goals",
                "all_goals": "All",
                "add_new_goal": "Add New Goal"
            ]
        ]
        
        return translations[appState.language]?[key] ?? key
    }
}

// MARK: - Preview
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(AppState())
    }
}
