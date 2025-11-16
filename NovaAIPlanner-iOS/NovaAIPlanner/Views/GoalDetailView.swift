//
//  GoalDetailView.swift
//  NovaAIPlanner
//
//  Detail view for a single goal with WOOP information
//

import SwiftUI

struct GoalDetailView: View {
    let goal: Goal
    @ObservedObject var viewModel: GoalViewModel
    @Environment(\.dismiss) var dismiss
    @State private var showingEditSheet = false
    @State private var showingDeleteAlert = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // WOOP Sections
                    WOOPSection(title: "🎯 WISH (소망)", content: goal.wish)
                    WOOPSection(title: "✅ OUTCOME (결과)", content: goal.outcome)
                    WOOPSection(title: "⚠️ OBSTACLE (장애물)", content: goal.obstacle)
                    WOOPSection(title: "📋 PLAN (계획)", content: goal.plan)
                    
                    Divider()
                    
                    // Goal Properties
                    VStack(alignment: .leading, spacing: 12) {
                        if let deadline = goal.deadline {
                            PropertyRow(icon: "calendar", title: "Deadline", value: formatDate(deadline))
                        }
                        
                        if goal.isRecurring {
                            PropertyRow(icon: "repeat", title: "Recurring", value: recurringDaysText())
                            PropertyRow(icon: "flame.fill", title: "Streak", value: "\(goal.streak) days", color: .orange)
                        }
                        
                        if let category = goal.category {
                            PropertyRow(icon: "tag.fill", title: "Category", value: category)
                        }
                        
                        if goal.completed, let lastCompleted = goal.lastCompletedDate {
                            PropertyRow(icon: "checkmark.circle.fill", title: "Completed", value: formatDate(lastCompleted), color: .green)
                        }
                    }
                    .padding()
                    .background(Color(uiColor: .secondarySystemBackground))
                    .cornerRadius(12)
                }
                .padding()
            }
            .navigationTitle("Goal Details")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Close") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Menu {
                        Button(action: { showingEditSheet = true }) {
                            Label("Edit", systemImage: "pencil")
                        }
                        
                        Button(role: .destructive, action: { showingDeleteAlert = true }) {
                            Label("Delete", systemImage: "trash")
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                    }
                }
            }
            .sheet(isPresented: $showingEditSheet) {
                GoalCreateView(viewModel: viewModel, editingGoal: goal)
            }
            .alert("Delete Goal", isPresented: $showingDeleteAlert) {
                Button("Cancel", role: .cancel) { }
                Button("Delete", role: .destructive) {
                    viewModel.deleteGoal(goal)
                    dismiss()
                }
            } message: {
                Text("Are you sure you want to delete this goal? This action cannot be undone.")
            }
        }
    }
    
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        return formatter.string(from: date)
    }
    
    private func recurringDaysText() -> String {
        let dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        return goal.recurringDays.map { dayNames[$0] }.joined(separator: ", ")
    }
}

// MARK: - WOOP Section Component
struct WOOPSection: View {
    let title: String
    let content: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.headline)
                .foregroundColor(.primary)
            
            Text(content.isEmpty ? "Not set" : content)
                .font(.body)
                .foregroundColor(content.isEmpty ? .secondary : .primary)
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color(uiColor: .secondarySystemBackground))
                .cornerRadius(8)
        }
    }
}

// MARK: - Property Row Component
struct PropertyRow: View {
    let icon: String
    let title: String
    let value: String
    var color: Color = .accentColor
    
    var body: some View {
        HStack {
            Image(systemName: icon)
                .foregroundColor(color)
                .frame(width: 24)
            
            Text(title)
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            Spacer()
            
            Text(value)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(.primary)
        }
    }
}
