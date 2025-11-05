//
//  GoalListView.swift
//  NovaAIPlanner
//
//  List view for displaying and managing goals
//

import SwiftUI

struct GoalListView: View {
    @ObservedObject var viewModel: GoalViewModel
    @EnvironmentObject var appState: AppState
    @State private var showingFilterSheet = false
    @State private var selectedGoal: Goal?
    @State private var showingGoalDetail = false
    var onAdd: () -> Void
    
    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            VStack(spacing: 0) {
                // Filter and folder selector
                filterBar
                
                if viewModel.filteredGoals.isEmpty {
                    emptyStateView
                } else {
                    ScrollView {
                        LazyVStack(spacing: 12) {
                            ForEach(viewModel.filteredGoals) { goal in
                                GoalCardView(goal: goal, onToggle: {
                                    viewModel.toggleGoalCompletion(goal)
                                }, onTap: {
                                    selectedGoal = goal
                                    showingGoalDetail = true
                                })
                            }
                        }
                        .padding()
                    }
                }
            }
            
            // Floating action button
            Button(action: onAdd) {
                Image(systemName: "plus")
                    .font(.title2)
                    .fontWeight(.semibold)
                    .foregroundColor(.white)
                    .frame(width: 56, height: 56)
                    .background(Color.accentColor)
                    .clipShape(Circle())
                    .shadow(color: Color.black.opacity(0.2), radius: 8, x: 0, y: 4)
            }
            .padding()
        }
        .sheet(isPresented: $showingFilterSheet) {
            FilterSheet(viewModel: viewModel)
        }
        .sheet(item: $selectedGoal) { goal in
            GoalDetailView(goal: goal, viewModel: viewModel)
        }
    }
    
    // MARK: - Filter Bar
    private var filterBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                // Folder chips
                FolderChip(title: localizedString("all_goals"), isSelected: viewModel.selectedFolder == nil) {
                    viewModel.selectedFolder = nil
                }
                
                ForEach(viewModel.folders) { folder in
                    FolderChip(title: folder.name, isSelected: viewModel.selectedFolder == folder.id, color: folder.color) {
                        viewModel.selectedFolder = folder.id
                    }
                }
                
                // Filter button
                Button(action: { showingFilterSheet = true }) {
                    HStack(spacing: 4) {
                        Image(systemName: "line.3.horizontal.decrease.circle")
                        Text("Filter")
                    }
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(.primary)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(Color.secondary.opacity(0.1))
                    .cornerRadius(20)
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 8)
        }
        .background(Color(uiColor: .systemBackground).opacity(0.95))
    }
    
    // MARK: - Empty State
    private var emptyStateView: some View {
        VStack(spacing: 16) {
            Image(systemName: "sparkles")
                .font(.system(size: 64))
                .foregroundColor(.secondary)
            
            Text(localizedString("empty_message_all"))
                .font(.title3)
                .fontWeight(.medium)
                .foregroundColor(.secondary)
            
            Text(localizedString("empty_encouragement_1"))
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
    
    // MARK: - Localization
    private func localizedString(_ key: String) -> String {
        let translations: [String: [String: String]] = [
            "ko": [
                "all_goals": "전체",
                "empty_message_all": "+ 버튼으로 목표를 추가해보세요",
                "empty_encouragement_1": "새로운 여정의 첫 걸음을 내딛어보세요."
            ],
            "en": [
                "all_goals": "All",
                "empty_message_all": "Add a goal with the + button",
                "empty_encouragement_1": "Take the first step toward something amazing."
            ]
        ]
        
        return translations[appState.language]?[key] ?? key
    }
}

// MARK: - Folder Chip Component
struct FolderChip: View {
    let title: String
    let isSelected: Bool
    var color: String? = nil
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                if let color = color, isSelected {
                    Circle()
                        .fill(colorFromString(color))
                        .frame(width: 8, height: 8)
                }
                Text(title)
            }
            .font(.subheadline)
            .fontWeight(isSelected ? .semibold : .medium)
            .foregroundColor(isSelected ? .white : .primary)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(isSelected ? Color.accentColor : Color.secondary.opacity(0.1))
            .cornerRadius(20)
        }
    }
    
    private func colorFromString(_ colorString: String) -> Color {
        switch colorString {
        case "red": return .red
        case "orange": return .orange
        case "yellow": return .yellow
        case "green": return .green
        case "blue": return .blue
        case "purple": return .purple
        case "pink": return .pink
        default: return .accentColor
        }
    }
}

// MARK: - Goal Card Component
struct GoalCardView: View {
    let goal: Goal
    let onToggle: () -> Void
    let onTap: () -> Void
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 12) {
                // Completion toggle
                Button(action: onToggle) {
                    Image(systemName: goal.completed ? "checkmark.circle.fill" : "circle")
                        .font(.title2)
                        .foregroundColor(goal.completed ? .green : .secondary)
                }
                .buttonStyle(PlainButtonStyle())
                
                // Goal content
                VStack(alignment: .leading, spacing: 4) {
                    Text(goal.wish)
                        .font(.body)
                        .fontWeight(.medium)
                        .foregroundColor(.primary)
                        .strikethrough(goal.completed)
                    
                    if !goal.outcome.isEmpty {
                        Text(goal.outcome)
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .lineLimit(1)
                    }
                    
                    HStack(spacing: 8) {
                        // Deadline indicator
                        if let deadline = goal.deadline {
                            HStack(spacing: 4) {
                                Image(systemName: "calendar")
                                    .font(.caption2)
                                Text(deadlineText(deadline))
                                    .font(.caption)
                            }
                            .foregroundColor(deadlineColor(deadline))
                        }
                        
                        // Recurring indicator
                        if goal.isRecurring {
                            HStack(spacing: 4) {
                                Image(systemName: "repeat")
                                    .font(.caption2)
                                if goal.streak > 0 {
                                    Image(systemName: "flame.fill")
                                        .font(.caption2)
                                    Text("\(goal.streak)")
                                        .font(.caption)
                                }
                            }
                            .foregroundColor(.orange)
                        }
                        
                        // Category badge
                        if let category = goal.category {
                            Text(category)
                                .font(.caption2)
                                .fontWeight(.medium)
                                .foregroundColor(.white)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.accentColor.opacity(0.8))
                                .cornerRadius(4)
                        }
                    }
                }
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .padding()
            .background(cardBackground)
            .cornerRadius(12)
            .shadow(color: Color.black.opacity(colorScheme == .dark ? 0.3 : 0.05), radius: 4, x: 0, y: 2)
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private var cardBackground: some View {
        RoundedRectangle(cornerRadius: 12)
            .fill(Color(uiColor: colorScheme == .dark ? .secondarySystemBackground : .systemBackground))
    }
    
    private func deadlineText(_ deadline: Date) -> String {
        let calendar = Calendar.current
        let today = calendar.startOfDay(for: Date())
        let deadlineDay = calendar.startOfDay(for: deadline)
        let days = calendar.dateComponents([.day], from: today, to: deadlineDay).day ?? 0
        
        if days == 0 {
            return "D-Day"
        } else if days > 0 {
            return "D-\(days)"
        } else {
            return "\(abs(days))일 지남"
        }
    }
    
    private func deadlineColor(_ deadline: Date) -> Color {
        let calendar = Calendar.current
        let days = calendar.dateComponents([.day], from: Date(), to: deadline).day ?? 0
        
        if days < 0 {
            return .red
        } else if days <= 3 {
            return .orange
        } else {
            return .secondary
        }
    }
}

// MARK: - Filter Sheet
struct FilterSheet: View {
    @ObservedObject var viewModel: GoalViewModel
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        NavigationView {
            List {
                Section("Filter") {
                    FilterOption(title: "All Goals", isSelected: viewModel.filterState == .all) {
                        viewModel.filterState = .all
                    }
                    FilterOption(title: "Active", isSelected: viewModel.filterState == .active) {
                        viewModel.filterState = .active
                    }
                    FilterOption(title: "Completed", isSelected: viewModel.filterState == .completed) {
                        viewModel.filterState = .completed
                    }
                }
                
                Section("Sort By") {
                    FilterOption(title: "Manual", isSelected: viewModel.sortOrder == .manual) {
                        viewModel.sortOrder = .manual
                    }
                    FilterOption(title: "Deadline", isSelected: viewModel.sortOrder == .deadline) {
                        viewModel.sortOrder = .deadline
                    }
                    FilterOption(title: "Newest", isSelected: viewModel.sortOrder == .newest) {
                        viewModel.sortOrder = .newest
                    }
                    FilterOption(title: "Alphabetical", isSelected: viewModel.sortOrder == .alphabetical) {
                        viewModel.sortOrder = .alphabetical
                    }
                }
            }
            .navigationTitle("Filter & Sort")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct FilterOption: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack {
                Text(title)
                Spacer()
                if isSelected {
                    Image(systemName: "checkmark")
                        .foregroundColor(.accentColor)
                }
            }
        }
    }
}
