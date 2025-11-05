//
//  WOOPCardsView.swift
//  NovaAIPlanner
//
//  WOOP framework cards view
//

import SwiftUI

struct WOOPCardsView: View {
    let goals: [Goal]
    @State private var selectedGoal: Goal?
    
    private var woopGoals: [Goal] {
        goals.filter { !$0.wish.isEmpty && !$0.outcome.isEmpty && !$0.obstacle.isEmpty && !$0.plan.isEmpty }
    }
    
    var body: some View {
        ScrollView {
            if woopGoals.isEmpty {
                emptyStateView
            } else {
                LazyVStack(spacing: 16) {
                    ForEach(woopGoals) { goal in
                        WOOPCard(goal: goal) {
                            selectedGoal = goal
                        }
                    }
                }
                .padding()
            }
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .sheet(item: $selectedGoal) { goal in
            GoalDetailView(goal: goal, viewModel: GoalViewModel())
        }
    }
    
    private var emptyStateView: some View {
        VStack(spacing: 16) {
            Image(systemName: "sparkles")
                .font(.system(size: 64))
                .foregroundColor(.secondary)
            
            Text("No WOOP Goals Yet")
                .font(.title3)
                .fontWeight(.medium)
                .foregroundColor(.secondary)
            
            Text("Create goals with all WOOP steps to see them here")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.top, 100)
    }
}

// MARK: - WOOP Card Component
struct WOOPCard: View {
    let goal: Goal
    let onTap: () -> Void
    @Environment(\.colorScheme) var colorScheme
    
    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 16) {
                // Header
                HStack {
                    Text("WOOP Goal")
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(Color.accentColor)
                        .cornerRadius(12)
                    
                    Spacer()
                    
                    if goal.completed {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(.green)
                    }
                }
                
                // WOOP Fields
                WOOPField(icon: "🎯", title: "WISH", content: goal.wish)
                WOOPField(icon: "✅", title: "OUTCOME", content: goal.outcome)
                WOOPField(icon: "⚠️", title: "OBSTACLE", content: goal.obstacle)
                WOOPField(icon: "📋", title: "PLAN", content: goal.plan)
                
                // Footer with metadata
                HStack(spacing: 12) {
                    if let deadline = goal.deadline {
                        Label(formatDate(deadline), systemImage: "calendar")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    if goal.isRecurring {
                        Label("Recurring", systemImage: "repeat")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    
                    if goal.streak > 0 {
                        Label("\(goal.streak) day streak", systemImage: "flame.fill")
                            .font(.caption)
                            .foregroundColor(.orange)
                    }
                    
                    Spacer()
                    
                    Image(systemName: "chevron.right")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            .padding()
            .background(cardBackground)
            .cornerRadius(16)
            .shadow(color: Color.black.opacity(colorScheme == .dark ? 0.3 : 0.08), radius: 8, x: 0, y: 4)
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private var cardBackground: some View {
        RoundedRectangle(cornerRadius: 16)
            .fill(Color(uiColor: colorScheme == .dark ? .secondarySystemBackground : .systemBackground))
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: date)
    }
}

// MARK: - WOOP Field Component
struct WOOPField: View {
    let icon: String
    let title: String
    let content: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 4) {
                Text(icon)
                    .font(.caption)
                Text(title)
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundColor(.secondary)
                    .textCase(.uppercase)
            }
            
            Text(content)
                .font(.subheadline)
                .foregroundColor(.primary)
                .lineLimit(2)
                .fixedSize(horizontal: false, vertical: true)
        }
    }
}
