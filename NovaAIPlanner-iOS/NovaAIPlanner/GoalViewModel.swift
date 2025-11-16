//
//  GoalViewModel.swift
//  NovaAIPlanner
//
//  ViewModel for goal management with Firebase sync
//

import Foundation
import Combine
import FirebaseFirestore
import FirebaseAuth

class GoalViewModel: ObservableObject {
    @Published var goals: [Goal] = []
    @Published var folders: [Folder] = []
    @Published var selectedFolder: String? = nil
    @Published var filterState: FilterState = .all
    @Published var sortOrder: SortOrder = .manual
    @Published var isSyncing = false
    @Published var showError = false
    @Published var errorMessage = ""
    
    var appState: AppState?
    private var db = Firestore.firestore()
    private var cancellables = Set<AnyCancellable>()
    private var goalsListener: ListenerRegistration?
    private var foldersListener: ListenerRegistration?
    
    enum FilterState {
        case all
        case active
        case completed
    }
    
    enum SortOrder {
        case manual
        case deadline
        case newest
        case alphabetical
    }
    
    init() {
        loadGoals()
    }
    
    deinit {
        goalsListener?.remove()
        foldersListener?.remove()
    }
    
    // MARK: - Load Goals
    func loadGoals() {
        // Load from UserDefaults first (offline support)
        if let data = UserDefaults.standard.data(forKey: "goals"),
           let decoded = try? JSONDecoder().decode([Goal].self, from: data) {
            self.goals = decoded
        }
        
        if let data = UserDefaults.standard.data(forKey: "folders"),
           let decoded = try? JSONDecoder().decode([Folder].self, from: data) {
            self.folders = decoded
        }
        
        // Then sync from Firebase if logged in
        if Auth.auth().currentUser != nil {
            loadGoalsFromFirebase()
            loadFoldersFromFirebase()
        }
    }
    
    // MARK: - Firebase Sync
    func loadGoalsFromFirebase() {
        guard let userId = Auth.auth().currentUser?.uid else { return }
        
        isSyncing = true
        
        // Real-time listener for goals
        goalsListener = db.collection("users").document(userId).collection("goals")
            .addSnapshotListener { [weak self] snapshot, error in
                guard let self = self else { return }
                
                self.isSyncing = false
                
                if let error = error {
                    self.errorMessage = error.localizedDescription
                    self.showError = true
                    return
                }
                
                guard let documents = snapshot?.documents else { return }
                
                self.goals = documents.compactMap { doc in
                    try? doc.data(as: Goal.self)
                }
                
                self.saveGoalsLocally()
            }
    }
    
    func loadFoldersFromFirebase() {
        guard let userId = Auth.auth().currentUser?.uid else { return }
        
        foldersListener = db.collection("users").document(userId).collection("folders")
            .addSnapshotListener { [weak self] snapshot, error in
                guard let self = self else { return }
                
                if let error = error {
                    print("Error loading folders: \(error.localizedDescription)")
                    return
                }
                
                guard let documents = snapshot?.documents else { return }
                
                self.folders = documents.compactMap { doc in
                    try? doc.data(as: Folder.self)
                }
                
                self.saveFoldersLocally()
            }
    }
    
    // MARK: - Save Data
    func saveGoalsLocally() {
        if let encoded = try? JSONEncoder().encode(goals) {
            UserDefaults.standard.set(encoded, forKey: "goals")
        }
    }
    
    func saveFoldersLocally() {
        if let encoded = try? JSONEncoder().encode(folders) {
            UserDefaults.standard.set(encoded, forKey: "folders")
        }
    }
    
    func syncGoalToFirebase(_ goal: Goal) {
        guard let userId = Auth.auth().currentUser?.uid else { return }
        guard appState?.isAutoSyncEnabled == true else { return }
        
        let goalRef = db.collection("users").document(userId).collection("goals").document(goal.id)
        
        do {
            try goalRef.setData(from: goal)
        } catch {
            print("Error syncing goal: \(error.localizedDescription)")
        }
    }
    
    // MARK: - CRUD Operations
    func addGoal(_ goal: Goal) {
        var newGoal = goal
        newGoal.lastModified = Date()
        newGoal.lastModifiedBy = Auth.auth().currentUser?.uid
        
        goals.append(newGoal)
        saveGoalsLocally()
        
        if Auth.auth().currentUser != nil {
            syncGoalToFirebase(newGoal)
        }
    }
    
    func updateGoal(_ goal: Goal) {
        if let index = goals.firstIndex(where: { $0.id == goal.id }) {
            var updatedGoal = goal
            updatedGoal.lastModified = Date()
            updatedGoal.lastModifiedBy = Auth.auth().currentUser?.uid
            updatedGoal.version += 1
            
            goals[index] = updatedGoal
            saveGoalsLocally()
            
            if Auth.auth().currentUser != nil {
                syncGoalToFirebase(updatedGoal)
            }
        }
    }
    
    func deleteGoal(_ goal: Goal) {
        goals.removeAll { $0.id == goal.id }
        saveGoalsLocally()
        
        if let userId = Auth.auth().currentUser?.uid {
            db.collection("users").document(userId).collection("goals").document(goal.id).delete()
        }
    }
    
    func toggleGoalCompletion(_ goal: Goal) {
        var updatedGoal = goal
        updatedGoal.completed.toggle()
        
        if updatedGoal.completed {
            updatedGoal.lastCompletedDate = Date()
            updatedGoal.streak += 1
        }
        
        updateGoal(updatedGoal)
    }
    
    // MARK: - Folder Operations
    func addFolder(_ folder: Folder) {
        folders.append(folder)
        saveFoldersLocally()
        
        if let userId = Auth.auth().currentUser?.uid {
            let folderRef = db.collection("users").document(userId).collection("folders").document(folder.id)
            try? folderRef.setData(from: folder)
        }
    }
    
    func updateFolder(_ folder: Folder) {
        if let index = folders.firstIndex(where: { $0.id == folder.id }) {
            folders[index] = folder
            saveFoldersLocally()
            
            if let userId = Auth.auth().currentUser?.uid {
                let folderRef = db.collection("users").document(userId).collection("folders").document(folder.id)
                try? folderRef.setData(from: folder)
            }
        }
    }
    
    func deleteFolder(_ folder: Folder) {
        folders.removeAll { $0.id == folder.id }
        saveFoldersLocally()
        
        // Move goals in this folder to root
        for i in 0..<goals.count {
            if goals[i].folderId == folder.id {
                goals[i].folderId = nil
            }
        }
        saveGoalsLocally()
        
        if let userId = Auth.auth().currentUser?.uid {
            db.collection("users").document(userId).collection("folders").document(folder.id).delete()
        }
    }
    
    // MARK: - Filtering & Sorting
    var filteredGoals: [Goal] {
        var filtered = goals
        
        // Filter by folder
        if let folderId = selectedFolder {
            filtered = filtered.filter { $0.folderId == folderId }
        }
        
        // Filter by state
        switch filterState {
        case .all:
            break
        case .active:
            filtered = filtered.filter { !$0.completed }
        case .completed:
            filtered = filtered.filter { $0.completed }
        }
        
        // Sort
        switch sortOrder {
        case .manual:
            break
        case .deadline:
            filtered.sort { (g1, g2) -> Bool in
                guard let d1 = g1.deadline else { return false }
                guard let d2 = g2.deadline else { return true }
                return d1 < d2
            }
        case .newest:
            filtered.sort { ($0.lastModified ?? Date.distantPast) > ($1.lastModified ?? Date.distantPast) }
        case .alphabetical:
            filtered.sort { $0.wish < $2.wish }
        }
        
        return filtered
    }
}
