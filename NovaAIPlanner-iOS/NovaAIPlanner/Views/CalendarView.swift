//
//  CalendarView.swift
//  NovaAIPlanner
//
//  Calendar view with 3-day, week, and month modes
//

import SwiftUI

struct CalendarView: View {
    let goals: [Goal]
    @State private var currentDate = Date()
    @State private var viewMode: CalendarViewMode = .week
    @State private var selectedGoal: Goal?
    
    enum CalendarViewMode {
        case day3, week, month
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // Header with date navigation
            calendarHeader
            
            // View mode selector
            viewModeSelector
            
            // Calendar grid
            ScrollView {
                LazyVStack(spacing: 1) {
                    ForEach(calendarDays, id: \.self) { day in
                        CalendarDayRow(date: day, goals: goalsForDay(day), onGoalTap: { goal in
                            selectedGoal = goal
                        })
                    }
                }
            }
            .background(Color(uiColor: .systemGroupedBackground))
        }
        .sheet(item: $selectedGoal) { goal in
            GoalDetailView(goal: goal, viewModel: GoalViewModel())
        }
    }
    
    // MARK: - Calendar Header
    private var calendarHeader: some View {
        HStack {
            Button(action: { changeDate(by: -1) }) {
                Image(systemName: "chevron.left")
                    .font(.title3)
                    .foregroundColor(.primary)
            }
            
            Spacer()
            
            Text(headerTitle)
                .font(.headline)
                .foregroundColor(.primary)
            
            Spacer()
            
            Button(action: { changeDate(by: 1) }) {
                Image(systemName: "chevron.right")
                    .font(.title3)
                    .foregroundColor(.primary)
            }
        }
        .padding()
        .background(Color(uiColor: .systemBackground))
    }
    
    // MARK: - View Mode Selector
    private var viewModeSelector: some View {
        HStack(spacing: 12) {
            ModeButton(title: "3-Day", isSelected: viewMode == .day3) {
                viewMode = .day3
            }
            ModeButton(title: "Week", isSelected: viewMode == .week) {
                viewMode = .week
            }
            ModeButton(title: "Month", isSelected: viewMode == .month) {
                viewMode = .month
            }
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(Color(uiColor: .systemBackground))
    }
    
    // MARK: - Calendar Days Computation
    private var calendarDays: [Date] {
        var days: [Date] = []
        let calendar = Calendar.current
        
        switch viewMode {
        case .day3:
            for i in -1...1 {
                if let day = calendar.date(byAdding: .day, value: i, to: currentDate) {
                    days.append(day)
                }
            }
        case .week:
            let startOfWeek = calendar.date(from: calendar.dateComponents([.yearForWeekOfYear, .weekOfYear], from: currentDate))!
            for i in 0..<7 {
                if let day = calendar.date(byAdding: .day, value: i, to: startOfWeek) {
                    days.append(day)
                }
            }
        case .month:
            let components = calendar.dateComponents([.year, .month], from: currentDate)
            let startOfMonth = calendar.date(from: components)!
            let range = calendar.range(of: .day, in: .month, for: startOfMonth)!
            
            for day in range {
                if let date = calendar.date(byAdding: .day, value: day - 1, to: startOfMonth) {
                    days.append(date)
                }
            }
        }
        
        return days
    }
    
    private var headerTitle: String {
        let formatter = DateFormatter()
        switch viewMode {
        case .day3:
            formatter.dateFormat = "yyyy MMMM"
        case .week:
            formatter.dateFormat = "yyyy MMMM"
        case .month:
            formatter.dateFormat = "yyyy MMMM"
        }
        return formatter.string(from: currentDate)
    }
    
    // MARK: - Helper Functions
    private func goalsForDay(_ date: Date) -> [Goal] {
        let calendar = Calendar.current
        return goals.filter { goal in
            if goal.isRecurring {
                let weekday = (calendar.component(.weekday, from: date) + 5) % 7 // Convert to Monday=0
                return goal.recurringDays.contains(weekday)
            } else if let deadline = goal.deadline {
                return calendar.isDate(deadline, inSameDayAs: date)
            }
            return false
        }
    }
    
    private func changeDate(by value: Int) {
        let calendar = Calendar.current
        switch viewMode {
        case .day3:
            currentDate = calendar.date(byAdding: .day, value: value * 3, to: currentDate) ?? currentDate
        case .week:
            currentDate = calendar.date(byAdding: .weekOfYear, value: value, to: currentDate) ?? currentDate
        case .month:
            currentDate = calendar.date(byAdding: .month, value: value, to: currentDate) ?? currentDate
        }
    }
}

// MARK: - Calendar Day Row
struct CalendarDayRow: View {
    let date: Date
    let goals: [Goal]
    let onGoalTap: (Goal) -> Void
    
    private var isToday: Bool {
        Calendar.current.isDateInToday(date)
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Date header
            HStack {
                Text(dayText)
                    .font(.headline)
                    .fontWeight(.bold)
                    .foregroundColor(isToday ? .white : .primary)
                    .frame(width: 40, height: 40)
                    .background(isToday ? Color.accentColor : Color.clear)
                    .clipShape(Circle())
                
                Text(weekdayText)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                
                Spacer()
                
                if !goals.isEmpty {
                    Text("\(goals.count) goals")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            .padding(.horizontal)
            .padding(.top, 12)
            
            // Goals list
            if !goals.isEmpty {
                VStack(spacing: 8) {
                    ForEach(goals) { goal in
                        Button(action: { onGoalTap(goal) }) {
                            HStack {
                                Circle()
                                    .fill(goal.completed ? Color.green : Color.accentColor)
                                    .frame(width: 8, height: 8)
                                
                                Text(goal.wish)
                                    .font(.subheadline)
                                    .foregroundColor(.primary)
                                    .lineLimit(1)
                                
                                Spacer()
                                
                                Image(systemName: "chevron.right")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                            }
                            .padding(.horizontal)
                            .padding(.vertical, 8)
                            .background(Color(uiColor: .secondarySystemBackground))
                            .cornerRadius(8)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                .padding(.horizontal)
                .padding(.bottom, 12)
            }
        }
        .background(Color(uiColor: .systemBackground))
    }
    
    private var dayText: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "d"
        return formatter.string(from: date)
    }
    
    private var weekdayText: String {
        let formatter = DateFormatter()
        formatter.dateFormat = "EEEE"
        return formatter.string(from: date)
    }
}

// MARK: - Mode Button
struct ModeButton: View {
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
