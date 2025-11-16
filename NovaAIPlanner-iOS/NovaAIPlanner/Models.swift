//
//  Models.swift
//  NovaAIPlanner
//
//  Data models matching web app structure
//

import Foundation
import FirebaseFirestore

// MARK: - Goal Model
struct Goal: Identifiable, Codable {
    var id: String = UUID().uuidString
    var wish: String
    var outcome: String
    var obstacle: String
    var plan: String
    var isRecurring: Bool
    var recurringDays: [Int] // 0=Monday, 6=Sunday
    var deadline: Date?
    var completed: Bool
    var lastCompletedDate: Date?
    var streak: Int
    var folderId: String?
    var ownerId: String?
    var category: String?
    var lastModified: Date?
    var lastModifiedBy: String?
    var version: Int
    var collaborators: [Collaborator]?
    var isSharedGoal: Bool?
    
    init(wish: String = "", outcome: String = "", obstacle: String = "", plan: String = "",
         isRecurring: Bool = false, recurringDays: [Int] = [], deadline: Date? = nil,
         completed: Bool = false, streak: Int = 0, folderId: String? = nil,
         category: String? = nil, version: Int = 1) {
        self.wish = wish
        self.outcome = outcome
        self.obstacle = obstacle
        self.plan = plan
        self.isRecurring = isRecurring
        self.recurringDays = recurringDays
        self.deadline = deadline
        self.completed = completed
        self.streak = streak
        self.folderId = folderId
        self.category = category
        self.version = version
        self.lastModified = Date()
    }
}

// MARK: - Folder Model
struct Folder: Identifiable, Codable {
    var id: String = UUID().uuidString
    var name: String
    var ownerId: String
    var createdAt: Date
    var updatedAt: Date
    var collaborators: [Collaborator]?
    var ownerEmail: String?
    var color: String?
    var isShared: Bool?
    var collaborationSettings: CollaborationSettings?
    
    init(name: String, ownerId: String, color: String? = nil) {
        self.name = name
        self.ownerId = ownerId
        self.createdAt = Date()
        self.updatedAt = Date()
        self.color = color
    }
}

// MARK: - Collaborator Model
struct Collaborator: Codable, Identifiable {
    var id: String { userId }
    var userId: String
    var email: String
    var displayName: String?
    var photoURL: String?
    var role: CollaboratorRole
    var addedAt: Date
    
    enum CollaboratorRole: String, Codable {
        case owner
        case editor
        case viewer
    }
}

// MARK: - Collaboration Settings
struct CollaborationSettings: Codable {
    var enabled: Bool
    var showPresence: Bool
    var showEditingState: Bool
    var enableConflictDetection: Bool
    var allowGuestView: Bool
    var requireApproval: Bool
    
    init() {
        self.enabled = false
        self.showPresence = true
        self.showEditingState = true
        self.enableConflictDetection = true
        self.allowGuestView = false
        self.requireApproval = true
    }
}

// MARK: - User Presence
struct UserPresence: Identifiable {
    var id: String { userId }
    var userId: String
    var displayName: String
    var photoURL: String?
    var isOnline: Bool
    var lastSeen: Date
    var currentFolder: String?
}

// MARK: - Editing State
struct EditingState {
    var goalId: String
    var userId: String
    var userName: String
    var startTime: Date
    var folderId: String
}

// MARK: - Conflict Info
struct ConflictInfo {
    var goalId: String
    var conflictType: ConflictType
    var localVersion: Goal
    var serverVersion: Goal
    var lastModifiedBy: String
    var lastModifiedAt: Date
    
    enum ConflictType {
        case concurrentEdit
        case versionMismatch
    }
}

// MARK: - Notification Settings
struct NotificationSettings: Codable {
    var deadlineAlerts: Bool
    var suggestions: Bool
    var achievements: Bool
    var reminders: Bool
    var startTime: String // "09:00"
    var endTime: String // "21:00"
    
    init() {
        self.deadlineAlerts = true
        self.suggestions = true
        self.achievements = true
        self.reminders = true
        self.startTime = "09:00"
        self.endTime = "21:00"
    }
}

// MARK: - Reminder Model
struct Reminder: Identifiable, Codable {
    var id: String = UUID().uuidString
    var title: String
    var description: String?
    var date: Date?
    var time: Date?
    var isRecurring: Bool
    var recurringType: RecurringType
    var enabled: Bool
    
    enum RecurringType: String, Codable {
        case none
        case daily
        case weekly
        case monthly
    }
    
    init(title: String, description: String? = nil, date: Date? = nil,
         time: Date? = nil, isRecurring: Bool = false,
         recurringType: RecurringType = .none, enabled: Bool = true) {
        self.title = title
        self.description = description
        self.date = date
        self.time = time
        self.isRecurring = isRecurring
        self.recurringType = recurringType
        self.enabled = enabled
    }
}
