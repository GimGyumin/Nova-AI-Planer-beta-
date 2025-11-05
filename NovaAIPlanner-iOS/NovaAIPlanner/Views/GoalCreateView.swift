//
//  GoalCreateView.swift
//  NovaAIPlanner
//
//  WOOP-based goal creation wizard (5 steps)
//

import SwiftUI

struct GoalCreateView: View {
    @ObservedObject var viewModel: GoalViewModel
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) var dismiss
    
    var editingGoal: Goal? = nil
    
    @State private var currentStep = 1
    @State private var wish = ""
    @State private var outcome = ""
    @State private var obstacle = ""
    @State private var plan = ""
    @State private var hasDeadline = false
    @State private var deadline = Date()
    @State private var isRecurring = false
    @State private var selectedDays: Set<Int> = []
    @State private var selectedCategory: String?
    
    private let totalSteps = 5
    private let categories = ["School", "Work", "Personal", "Health", "Other"]
    
    var body: some View {
        NavigationView {
            ZStack {
                // Progress bar background
                GeometryReader { geometry in
                    Rectangle()
                        .fill(Color.accentColor.opacity(0.2))
                        .frame(width: geometry.size.width * CGFloat(currentStep) / CGFloat(totalSteps), height: 4)
                        .animation(.easeInOut, value: currentStep)
                }
                .frame(height: 4)
                .frame(maxHeight: .infinity, alignment: .top)
                
                VStack(spacing: 0) {
                    // Step content
                    ScrollView {
                        VStack(alignment: .leading, spacing: 20) {
                            stepHeader
                            
                            switch currentStep {
                            case 1:
                                wishStep
                            case 2:
                                outcomeStep
                            case 3:
                                obstacleStep
                            case 4:
                                planStep
                            case 5:
                                settingsStep
                            default:
                                EmptyView()
                            }
                        }
                        .padding()
                    }
                    
                    // Navigation buttons
                    HStack(spacing: 12) {
                        if currentStep > 1 {
                            Button(action: { currentStep -= 1 }) {
                                HStack {
                                    Image(systemName: "chevron.left")
                                    Text("Back")
                                }
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.secondary.opacity(0.2))
                                .foregroundColor(.primary)
                                .cornerRadius(12)
                            }
                        }
                        
                        Button(action: handleNextOrSave) {
                            Text(currentStep == totalSteps ? "Save" : "Next")
                                .fontWeight(.semibold)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(canProceed ? Color.accentColor : Color.secondary.opacity(0.3))
                                .foregroundColor(.white)
                                .cornerRadius(12)
                        }
                        .disabled(!canProceed)
                    }
                    .padding()
                    .background(Color(uiColor: .systemBackground))
                }
            }
            .navigationTitle(editingGoal == nil ? "New Goal" : "Edit Goal")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                }
            }
            .onAppear {
                if let goal = editingGoal {
                    wish = goal.wish
                    outcome = goal.outcome
                    obstacle = goal.obstacle
                    plan = goal.plan
                    hasDeadline = goal.deadline != nil
                    if let deadline = goal.deadline {
                        self.deadline = deadline
                    }
                    isRecurring = goal.isRecurring
                    selectedDays = Set(goal.recurringDays)
                    selectedCategory = goal.category
                }
            }
        }
    }
    
    // MARK: - Step Header
    private var stepHeader: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Step \(currentStep)/\(totalSteps)")
                .font(.caption)
                .foregroundColor(.secondary)
            
            Text(stepTitle)
                .font(.title2)
                .fontWeight(.bold)
            
            Text(stepDescription)
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
    }
    
    private var stepTitle: String {
        switch currentStep {
        case 1: return "🎯 WISH (소망)"
        case 2: return "✅ OUTCOME (결과)"
        case 3: return "⚠️ OBSTACLE (장애물)"
        case 4: return "📋 PLAN (계획)"
        case 5: return "⚙️ Settings"
        default: return ""
        }
    }
    
    private var stepDescription: String {
        switch currentStep {
        case 1: return "What do you wish to achieve?"
        case 2: return "What's the best possible outcome?"
        case 3: return "What internal obstacle might stop you?"
        case 4: return "If-Then plan to overcome the obstacle"
        case 5: return "Set deadline and recurrence"
        default: return ""
        }
    }
    
    // MARK: - Step 1: Wish
    private var wishStep: some View {
        VStack(alignment: .leading, spacing: 12) {
            TextField("Enter your wish...", text: $wish, axis: .vertical)
                .textFieldStyle(.roundedBorder)
                .lineLimit(3...6)
            
            TipBox(text: "Be specific and measurable. Example: Lose 5kg in 3 months")
        }
    }
    
    // MARK: - Step 2: Outcome
    private var outcomeStep: some View {
        VStack(alignment: .leading, spacing: 12) {
            TextField("Enter the best outcome...", text: $outcome, axis: .vertical)
                .textFieldStyle(.roundedBorder)
                .lineLimit(3...6)
            
            TipBox(text: "Imagine the best possible result. Example: Feel healthier and more confident")
        }
    }
    
    // MARK: - Step 3: Obstacle
    private var obstacleStep: some View {
        VStack(alignment: .leading, spacing: 12) {
            TextField("Enter the main obstacle...", text: $obstacle, axis: .vertical)
                .textFieldStyle(.roundedBorder)
                .lineLimit(3...6)
            
            TipBox(text: "What internal barrier might stop you? Example: Feeling too tired after work")
        }
    }
    
    // MARK: - Step 4: Plan
    private var planStep: some View {
        VStack(alignment: .leading, spacing: 12) {
            TextField("Enter your If-Then plan...", text: $plan, axis: .vertical)
                .textFieldStyle(.roundedBorder)
                .lineLimit(3...6)
            
            TipBox(text: "If [obstacle], then I will... Example: If I feel tired, then I'll do 10 minutes of stretching")
        }
    }
    
    // MARK: - Step 5: Settings
    private var settingsStep: some View {
        VStack(alignment: .leading, spacing: 20) {
            // Category
            VStack(alignment: .leading, spacing: 8) {
                Text("Category")
                    .font(.headline)
                
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(categories, id: \.self) { category in
                            CategoryChip(title: category, isSelected: selectedCategory == category) {
                                selectedCategory = category
                            }
                        }
                    }
                }
            }
            
            Divider()
            
            // Deadline
            Toggle("Set Deadline", isOn: $hasDeadline)
                .font(.headline)
            
            if hasDeadline {
                DatePicker("Deadline", selection: $deadline, displayedComponents: .date)
            }
            
            Divider()
            
            // Recurring
            Toggle("Recurring Goal", isOn: $isRecurring)
                .font(.headline)
            
            if isRecurring {
                VStack(alignment: .leading, spacing: 12) {
                    Text("Select Days")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    
                    HStack(spacing: 8) {
                        ForEach(0..<7) { day in
                            DayButton(day: day, isSelected: selectedDays.contains(day)) {
                                if selectedDays.contains(day) {
                                    selectedDays.remove(day)
                                } else {
                                    selectedDays.insert(day)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    // MARK: - Validation
    private var canProceed: Bool {
        switch currentStep {
        case 1: return !wish.isEmpty
        case 2: return !outcome.isEmpty
        case 3: return !obstacle.isEmpty
        case 4: return !plan.isEmpty
        case 5: return true
        default: return false
        }
    }
    
    // MARK: - Actions
    private func handleNextOrSave() {
        if currentStep < totalSteps {
            withAnimation {
                currentStep += 1
            }
        } else {
            saveGoal()
        }
    }
    
    private func saveGoal() {
        let newGoal = Goal(
            wish: wish,
            outcome: outcome,
            obstacle: obstacle,
            plan: plan,
            isRecurring: isRecurring,
            recurringDays: Array(selectedDays).sorted(),
            deadline: hasDeadline ? deadline : nil,
            completed: editingGoal?.completed ?? false,
            streak: editingGoal?.streak ?? 0,
            folderId: editingGoal?.folderId,
            category: selectedCategory,
            version: (editingGoal?.version ?? 0) + 1
        )
        
        if let editingGoal = editingGoal {
            var updatedGoal = newGoal
            updatedGoal.id = editingGoal.id
            viewModel.updateGoal(updatedGoal)
        } else {
            viewModel.addGoal(newGoal)
        }
        
        dismiss()
    }
}

// MARK: - Helper Components
struct TipBox: View {
    let text: String
    
    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            Image(systemName: "lightbulb.fill")
                .foregroundColor(.yellow)
            Text(text)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(12)
        .background(Color.accentColor.opacity(0.1))
        .cornerRadius(8)
    }
}

struct CategoryChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline)
                .fontWeight(isSelected ? .semibold : .regular)
                .foregroundColor(isSelected ? .white : .primary)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isSelected ? Color.accentColor : Color.secondary.opacity(0.2))
                .cornerRadius(20)
        }
    }
}

struct DayButton: View {
    let day: Int
    let isSelected: Bool
    let action: () -> Void
    
    private let dayLabels = ["M", "T", "W", "T", "F", "S", "S"]
    
    var body: some View {
        Button(action: action) {
            Text(dayLabels[day])
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(isSelected ? .white : .primary)
                .frame(width: 40, height: 40)
                .background(isSelected ? Color.accentColor : Color.secondary.opacity(0.2))
                .clipShape(Circle())
        }
    }
}
