import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- 번역 객체 ---
const translations = {
  ko: {
    // Auth
    login_title: '로그인',
    signup_title: '회원가입',
    username_placeholder: '사용자 이름',
    email_placeholder: '이메일',
    password_placeholder: '비밀번호',
    remember_me_label: '자동 로그인',
    login_button: '로그인',
    signup_button: '회원가입',
    toggle_signup_prompt: '계정이 없으신가요?',
    toggle_login_prompt: '이미 계정이 있으신가요?',
    admin_login_button: '어드민 로그인 (개발자용)',
    admin_login_link: '어드민',
    admin_password_prompt: '어드민 암호를 입력하세요:',
    admin_password_error: '암호가 올르지 않습니다.',
    error_all_fields: '모든 필드를 입력해주세요.',
    error_email_required: '이메일을 입력하십시오.',
    error_password_required: '비밀번호를 입력하십시오.',
    error_username_required: '사용자 이름을 입력하십시오.',
    error_email_in_use: '이미 사용 중인 이메일입니다.',
    error_credentials: '이메일 또는 비밀번호가 올르지 않습니다.',
    login_footer_copyright: 'Copyright © 2025 Kyumin Inc. 모든 권리 보유.',
    login_footer_privacy: '개인정보 처리방침',
    login_footer_terms: '사용 약관',
    login_footer_country: '한국어',
    language_selection_title: '언어',
    error_wish_required: '목표를 입력해주세요.',
    error_outcome_required: '최상의 결과를 입력해주세요.',
    error_obstacle_required: '예상 장애물을 입력해주세요.',
    error_plan_required: "'If-Then' 계획을 입력해주세요.",
    error_deadline_required: '마감일을 선택해주세요.',
    error_day_required: '하나 이상의 요일을 선택해주세요.',

    // Main Page
    my_goals_title: '나의 목표',
    sort_label_manual: '직접 정렬',
    sort_label_deadline: '마감일 임박순',
    sort_label_newest: '최신 생성순',
    sort_label_alphabetical: '이름 오름차순',
    sort_label_ai: 'AI 추천 순서',
    ai_sorting_button: '정렬 중...',
    add_new_goal_button_label: '새로운 목표 추가',
    profile_settings_button_label: '프로필 및 설정',
    filter_all: '전체',
    filter_active: '진행 중',
    filter_completed: '완료',
    empty_message_all: '새로운 목표를 추가해 보세요.',
    empty_message_active: '진행 중인 목표가 없습니다.',
    empty_message_completed: '완료된 목표가 없습니다.',
    delete_button: '삭제',
    edit_button_aria: '목표 편집',
    info_button_aria: '상세 정보 보기',
    filter_title: '필터',
    sort_title: '정렬',
    filter_sort_button_aria: '필터 및 정렬',
    calendar_view_button_aria: '캘린더 보기',
    list_view_button_aria: '목록 보기',

    // Calendar
    month_names: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    day_names_short: ["일", "월", "화", "수", "목", "금", "토"],
    
    // Modals & Alerts
    settings_title: '설정',
    sort_alert_title: '정렬 실패',
    sort_alert_message: 'AI 추천 순서를 정렬하려면<br/>2개 이상의 목표가 필요합니다.',
    confirm_button: '확인',
    new_goal_modal_title: '새로운 목표',
    edit_goal_modal_title: '목표 수정',
    wish_label: '목표 (Wish)',
    outcome_label: '최상의 결과 (Outcome)',
    obstacle_label: '예상 장애물 (Obstacle)',
    plan_label: "'If-Then' 계획 (Plan)",
    deadline_label: '마감일',
    cancel_button: '취소',
    add_button: '추가',
    save_button: '저장',
    goal_details_modal_title: '목표 상세 정보',
    ai_coach_suggestion: '🤖 AI 코치의 제안',
    ai_analyzing: 'AI 분석 중...',
    close_button: '닫기',
    ai_sort_reason_modal_title: 'AI 정렬 이유',
    ai_sort_criteria: '🤖 AI의 정렬 기준',
    delete_account_confirm_title: '계정을 삭제하시겠습니까?',
    delete_account_confirm_message: '이 작업은 되돌릴 수 없으며, 모든 목표와 데이터가 영구적으로 삭제됩니다.',
    delete_account_button: '계정 삭제',
    delete_account_terms_title: '계정 삭제 약관',
    settings_delete_confirm_checkbox: '위 내용을 모두 확인했으며, 계정 삭제에 동의합니다.',
    delete_account_consequence_1: '모든 목표 데이터가 삭제됩니다.',
    delete_account_consequence_2: '계정 정보(사용자 이름, 이메일)가 삭제됩니다.',
    delete_account_consequence_3: '이 작업은 되돌릴 수 없습니다.',
    delete_account_guidance: '계속 진행하시려면 아래 확인란에 동의해주세요.',
    settings_done_button: '완료',
    settings_section_account: '계정',
    settings_section_data: '데이터 관리',
    settings_export_data: '목표 데이터 내보내기',
    settings_export_desc: '현재 계정의 모든 목표 데이터를 JSON 파일로 다운로드합니다. 다른 기기에서 복원할 때 사용할 수 있습니다.',
    settings_import_data: '목표 데이터 가져오기',
    settings_import_desc: 'JSON 파일에서 목표 데이터를 가져와 현재 목록을 교체합니다.',
    import_confirm_title: '데이터 가져오기 확인',
    import_confirm_message: '가져온 데이터로 현재 목표 목록을 덮어씁니다. 이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?',
    import_success_toast: '데이터를 성공적으로 가져왔습니다!',
    import_error_alert_title: '가져오기 실패',
    import_error_alert_message: '파일을 읽는 중 오류가 발생했거나 파일 형식이 올바르지 않습니다.',
    settings_username: '사용자 이름',
    settings_email: '이메일',
    settings_section_general: '일반',
    settings_section_info: '정보',
    settings_dark_mode: '다크 모드',
    settings_language: '언어',
    settings_section_background: '배경화면',
    settings_bg_dynamic: '다이나믹',
    settings_bg_solid: '단색',
    settings_bg_white: '순백색',
    settings_bg_black: '칠흑',
    settings_bg_pink: '벚꽃 핑크',
    settings_bg_cherry_noir: '체리 누아르',
    settings_bg_blue: '하늘색',
    settings_bg_deep_ocean: '심해',
    settings_bg_green: '민트 그린',
    settings_bg_forest_green: '숲 그린',
    settings_bg_purple: '라벤더',
    settings_bg_royal_purple: '로얄 퍼플',
    settings_version: '버전',
    settings_logout: '로그아웃',
    settings_account: '계정',
    
    // Profile Popover
    profile_popover_account: '계정',
    profile_popover_settings: '설정',
    profile_popover_logout: '로그아웃',

    // Goal Assistant
    goal_assistant_title: '목표 추가 도우미',
    next_button: '다음',
    back_button: '이전',
    wish_tip: '목표는 도전적이지만 현실적으로 달성 가능해야 합니다. 측정 가능하고 구체적으로 작성해 보세요.',
    wish_example: '예: 3개월 안에 5kg 감량하기, 이번 학기에 A+ 받기',
    outcome_tip: '목표를 달성했을 때 얻게 될 가장 긍정적인 결과를 상상해 보세요. 생생하게 느껴질수록 좋습니다.',
    outcome_example: '예: 더 건강하고 자신감 있는 내 모습, 성적 장학금 수령',
    obstacle_tip: '목표 달성을 방해할 수 있는 내부적인 장애물(나의 습관, 감정 등)은 무엇인가요?',
    obstacle_example: '예: 퇴근 후 피곤해서 운동 가기 싫은 마음, 어려운 과제가 나오면 미루는 습관',
    plan_tip: "'만약 ~라면, ~하겠다' 형식으로 장애물에 대한 구체적인 대응 계획을 세워보세요.",
    plan_example: '예: 만약 퇴근 후 운동 가기 싫은 마음이 든다면, 일단 운동복으로 갈아입고 10분만 스트레칭하겠다.',
    recurrence_label: '목표 반복',
    recurrence_tip: '정해진 요일에 꾸준히 해야 하는 목표인가요? 반복 목표로 설정하여 연속 달성(스트릭)을 기록해 보세요.',
    recurrence_example: '예: 매주 월,수,금 헬스장 가기',
    recurrence_option_daily: '반복 목표로 설정',
    deadline_tip: '현실적인 마감일을 설정하여 목표에 긴급성을 부여하세요. 마감일이 없는 목표도 설정할 수 있습니다.',
    deadline_example: '날짜를 선택하거나 "마감일 없음"을 체크하세요.',
    no_deadline_label: '마감일 없음',
    get_feedback_button: 'AI 피드백 받기',
    getting_feedback: 'AI가 피드백을 생성 중입니다...',
    feedback_error: '피드백 생성에 실패했습니다.',

    // Version Info
    version_title: "Nova 2.1: 더욱 정교하고 직관적인 경험",
    version_intro: "Nova가 2.1 업데이트를 통해 한 단계 더 진화합니다. 이번 업데이트는 여러분의 피드백을 바탕으로 사용 편의성을 극대화하고, 모든 기기에서 일관된 아름다움을 느낄 수 있도록 디자인의 모든 디테일을 세심하게 다듬는 데 집중했습니다.",
    version_feature_1_title: "iOS 스타일 스와이프 제스처",
    version_feature_1_desc: "이제 목표 관리가 더욱 빨라집니다. iOS 기기처럼, 목표 항목을 스와이프하여 직관적으로 작업을 처리하세요. 오른쪽으로 밀어 완료하고, 왼쪽으로 밀어 삭제할 수 있습니다.",
    version_feature_2_title: "더욱 강력해진 목표 관리",
    version_feature_2_desc: "당신의 다양한 계획을 완벽하게 지원합니다. 이제 '매일'뿐만 아니라 '월, 수, 금'과 같이 특정 요일을 지정하여 반복 목표를 설정하고, 새로운 '편집' 버튼으로 언제든지 목표를 수정하세요. 목표 추가 시 AI가 자동으로 코칭을 제안하여 계획을 더욱 완벽하게 다듬어줍니다.",
    version_feature_3_title: "모든 기기에서 완벽하게, 반응형 UI 및 디자인 개선",
    version_feature_3_desc: "데스크탑, 태블릿, 모바일 어디에서든 최상의 경험을 제공합니다. 화면 크기에 따라 UI가 자동으로 최적화되며, 라이트 모드의 가독성 향상 및 설정 화면의 디자인 통일성 개선으로 더욱 편안하게 사용할 수 있습니다.",
    version_feature_4_title: "살아 움직이는 인터페이스, 애니메이션 개편",
    version_feature_4_desc: "앱 전반에 걸쳐 iOS 스타일의 부드럽고 세련된 애니메이션을 적용하여 사용하는 즐거움을 더했습니다. 페이지 전환, 목표 추가, 팝업 등 모든 상호작용이 더욱 자연스럽고 우아하게 느껴집니다.",
    version_developer_info: "개발 정보",
    version_developer_name: "개발자",
  },
  en: {
    // Auth
    login_title: 'Login',
    signup_title: 'Sign Up',
    username_placeholder: 'Username',
    email_placeholder: 'Email',
    password_placeholder: 'Password',
    remember_me_label: 'Remember Me',
    login_button: 'Login',
    signup_button: 'Sign Up',
    toggle_signup_prompt: "Don't have an account?",
    toggle_login_prompt: 'Already have an account?',
    admin_login_button: 'Admin Login (for Dev)',
    admin_login_link: 'Admin',
    admin_password_prompt: 'Enter admin password:',
    admin_password_error: 'Incorrect password.',
    error_all_fields: 'Please fill in all fields.',
    error_email_required: 'Email is required.',
    error_password_required: 'Password is required.',
    error_username_required: 'Username is required.',
    error_email_in_use: 'This email is already in use.',
    error_credentials: 'Invalid email or password.',
    login_footer_copyright: 'Copyright © 2025 Kyumin Inc. All rights reserved.',
    login_footer_privacy: 'Privacy Policy',
    login_footer_terms: 'Terms of Use',
    login_footer_country: 'English',
    language_selection_title: 'Language',
    error_wish_required: 'Please enter your wish.',
    error_outcome_required: 'Please enter the best outcome.',
    error_obstacle_required: 'Please enter a potential obstacle.',
    error_plan_required: "Please enter your 'If-Then' plan.",
    error_deadline_required: 'Please select a deadline.',
    error_day_required: 'Please select at least one day.',
    
    // Main Page
    my_goals_title: 'My Goals',
    sort_label_manual: 'Manual',
    sort_label_deadline: 'Deadline',
    sort_label_newest: 'Newest',
    sort_label_alphabetical: 'Alphabetical',
    sort_label_ai: 'AI Suggested',
    ai_sorting_button: 'Sorting...',
    add_new_goal_button_label: 'Add New Goal',
    profile_settings_button_label: 'Profile & Settings',
    filter_all: 'All',
    filter_active: 'Active',
    filter_completed: 'Completed',
    empty_message_all: 'Add a new goal to get started.',
    empty_message_active: 'No active goals.',
    empty_message_completed: 'No completed goals.',
    delete_button: 'Delete',
    edit_button_aria: 'Edit Goal',
    info_button_aria: 'View details',
    filter_title: 'Filter',
    sort_title: 'Sort',
    filter_sort_button_aria: 'Filter & Sort',
    calendar_view_button_aria: 'Calendar View',
    list_view_button_aria: 'List View',

    // Calendar
    month_names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    day_names_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

    // Modals & Alerts
    settings_title: 'Settings',
    sort_alert_title: 'Sort Failed',
    sort_alert_message: 'You need at least two goals<br/>to use AI sorting.',
    confirm_button: 'OK',
    new_goal_modal_title: 'New Goal',
    edit_goal_modal_title: 'Edit Goal',
    wish_label: 'Wish',
    outcome_label: 'Outcome',
    obstacle_label: 'Obstacle',
    plan_label: 'Plan (If-Then)',
    deadline_label: 'Deadline',
    cancel_button: 'Cancel',
    add_button: 'Add',
    save_button: 'Save',
    goal_details_modal_title: 'Goal Details',
    ai_coach_suggestion: '🤖 AI Coach Suggestion',
    ai_analyzing: 'AI is analyzing...',
    close_button: 'Close',
    ai_sort_reason_modal_title: 'AI Sort Reason',
    ai_sort_criteria: '🤖 AI Sorting Criteria',
    delete_account_confirm_title: 'Delete Account?',
    delete_account_confirm_message: 'This action is irreversible and will permanently delete all your goals and data.',
    delete_account_button: 'Delete Account',
    delete_account_terms_title: 'Account Deletion Terms',
    settings_delete_confirm_checkbox: 'I have read the above and agree to delete my account.',
    delete_account_consequence_1: 'All your goal data will be deleted.',
    delete_account_consequence_2: 'Your account information (username, email) will be deleted.',
    delete_account_consequence_3: 'This action cannot be undone.',
    delete_account_guidance: 'Please agree to the checkbox below to proceed.',
    settings_done_button: 'Done',
    settings_section_account: 'Account',
    settings_section_data: 'Data Management',
    settings_export_data: 'Export Goal Data',
    settings_export_desc: 'Download all your goal data for the current account as a JSON file. You can use this to restore your data on another device.',
    settings_import_data: 'Import Goal Data',
    settings_import_desc: 'Import goal data from a JSON file, replacing your current list.',
    import_confirm_title: 'Confirm Data Import',
    import_confirm_message: 'This will overwrite your current list of goals with the imported data. This action cannot be undone. Continue?',
    import_success_toast: 'Data imported successfully!',
    import_error_alert_title: 'Import Failed',
    import_error_alert_message: 'An error occurred while reading the file, or the file format is incorrect.',
    settings_username: 'Username',
    settings_email: 'Email',
    settings_section_general: 'General',
    settings_section_info: 'Information',
    settings_dark_mode: 'Dark Mode',
    settings_language: 'Language',
    settings_section_background: 'Background',
    settings_bg_dynamic: 'Dynamic',
    settings_bg_solid: 'Solid Color',
    settings_bg_white: 'Pure White',
    settings_bg_black: 'Pitch Black',
    settings_bg_pink: 'Sakura Pink',
    settings_bg_cherry_noir: 'Cherry Noir',
    settings_bg_blue: 'Sky Blue',
    settings_bg_deep_ocean: 'Deep Ocean',
    settings_bg_green: 'Mint Green',
    settings_bg_forest_green: 'Forest Green',
    settings_bg_purple: 'Lavender',
    settings_bg_royal_purple: 'Royal Purple',
    settings_version: 'Version',
    settings_logout: 'Logout',
    settings_account: 'Account',

    // Profile Popover
    profile_popover_account: 'Account',
    profile_popover_settings: 'Settings',
    profile_popover_logout: 'Logout',

    // Goal Assistant
    goal_assistant_title: 'Goal Assistant',
    next_button: 'Next',
    back_button: 'Back',
    wish_tip: 'Your goal should be challenging but realistic. Try to make it specific and measurable.',
    wish_example: 'e.g., Lose 5kg in 3 months, Get an A+ this semester',
    outcome_tip: 'Imagine the most positive result of achieving your goal. The more vivid, the better.',
    outcome_example: 'e.g., Feeling healthier and more confident, Receiving a scholarship',
    obstacle_tip: 'What internal obstacles (your habits, feelings, etc.) might prevent you from achieving your goal?',
    obstacle_example: 'e.g., Feeling too tired to exercise after work, Procrastinating on difficult tasks',
    plan_tip: "Create a specific action plan for your obstacle in an 'If... then...' format.",
    plan_example: 'e.g., If I feel too tired to exercise after work, then I will change into my workout clothes and stretch for just 10 minutes.',
    recurrence_label: 'Goal Repetition',
    recurrence_tip: 'Is this a goal you need to work on specific days? Set it as a repeating goal to track your streak.',
    recurrence_example: 'e.g., Go to the gym every Mon, Wed, Fri',
    recurrence_option_daily: 'Set as a repeating goal',
    deadline_tip: 'Set a realistic deadline to create a sense of urgency. You can also set goals with no deadline.',
    deadline_example: 'Select a date or check "No deadline".',
    no_deadline_label: 'No deadline',
    get_feedback_button: 'Get AI Feedback',
    getting_feedback: 'AI is generating feedback...',
    feedback_error: 'Failed to generate feedback.',

    // Version Info
    version_title: "Nova 2.1: A More Refined and Intuitive Experience",
    version_intro: "Nova evolves to the next level with update 2.1. Based on your feedback, this update focuses on maximizing ease of use and meticulously refining every design detail to deliver consistent beauty across all your devices.",
    version_feature_1_title: "iOS-Style Swipe Gestures",
    version_feature_1_desc: "Managing your goals is now faster than ever. Just like on an iOS device, intuitively handle tasks by swiping on goal items. Swipe right to complete, and swipe left to delete.",
    version_feature_2_title: "More Powerful Goal Management",
    version_feature_2_desc: "Perfectly supporting all your diverse plans. You can now set recurring goals for specific days like 'Mon, Wed, Fri,' not just 'Daily.' A new 'Edit' button lets you modify goals anytime. Plus, AI automatically suggests coaching when you add a new goal, helping you perfect your plan.",
    version_feature_3_title: "Perfect on Every Device: Responsive UI & Design Enhancements",
    version_feature_3_desc: "Enjoy the best experience on desktop, tablet, or mobile. The UI now automatically optimizes for your screen size, with improved readability in light mode and a unified settings design for greater comfort.",
    version_feature_4_title: "A Living Interface: Animation Overhaul",
    version_feature_4_desc: "We've added joy to usage by applying smooth and sophisticated iOS-style animations throughout the app. Every interaction, from page transitions to adding goals and viewing pop-ups, now feels more natural and elegant.",
    version_developer_info: "Developer Information",
    version_developer_name: "Developer",
  },
};

// --- 유틸리티 함수 ---
const getTranslation = (key, lang = 'ko') => translations[lang][key] || key;

// --- API 키 ---
// This would typically be in a more secure place like environment variables
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });


// --- 아이콘 컴포넌트 ---
const icons = {
  add: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  more: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>,
  delete: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
  info: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
  edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  logout: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
  check: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  back: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>,
  filter: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
  sort: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
  ai: () => '✨',
  error: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
  chevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>,
  fire: () => `🔥`,
  calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  list: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
  swipeDelete: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  swipeCheck: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
};


// --- 커스텀 훅 ---
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error)
    {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};


// --- 컴포넌트 ---

const Toast = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000); // Disappear after 5s
        return () => clearTimeout(timer);
    }, [onClose]);

    return <div className="toast-notification">{message}</div>;
};

// FIX: Define props for AuthFooter, make onAdminClick optional, and conditionally render the admin link.
interface AuthFooterProps {
  t: (key: any) => any;
  onCountryClick: () => void;
  onAdminClick?: () => void;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ t, onCountryClick, onAdminClick }) => {
  return (
    <footer className="auth-footer">
      <div className="auth-footer-content">
        <div className="auth-footer-legal">
          <div className="footer-left">
            <span>{t('login_footer_copyright')}</span>
            <div className="footer-links">
              <a href="#" onClick={(e) => e.preventDefault()}>{t('login_footer_privacy')}</a>
              <span>|</span>
              <a href="#" onClick={(e) => e.preventDefault()}>{t('login_footer_terms')}</a>
              {onAdminClick && (
                <>
                  <span>|</span>
                  <a href="#" onClick={(e) => { e.preventDefault(); onAdminClick(); }} className="admin-login-link">{t('admin_login_link')}</a>
                </>
              )}
            </div>
          </div>
          <div className="footer-right">
            <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCountryClick(); }}>
              {t('login_footer_country')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};


const LanguageSelectionPage = ({ t, setCurrentLanguage, setView }) => {
  const handleLanguageSelect = (lang) => {
    setCurrentLanguage(lang);
    setView('auth');
  };

  return (
    <div className="language-selection-container">
      <h2>{t('language_selection_title')}</h2>
      <div className="language-list">
        <div className="language-item" onClick={() => handleLanguageSelect('ko')}>
          <span>한국어</span>
          {t('login_footer_country') === '한국어' && <span className="checkmark-icon">{icons.check()}</span>}
        </div>
        <div className="language-item" onClick={() => handleLanguageSelect('en')}>
          <span>English</span>
          {t('login_footer_country') === 'English' && <span className="checkmark-icon">{icons.check()}</span>}
        </div>
      </div>
    </div>
  );
};

const AdminPasswordModal = ({ onConfirm, onCancel, t, isWrong, onAnimationEnd }) => {
    const [password, setPassword] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const node = modalRef.current;
        if (isWrong && node) {
            node.addEventListener('animationend', onAnimationEnd, { once: true });
            return () => {
                node.removeEventListener('animationend', onAnimationEnd);
            }
        }
    }, [isWrong, onAnimationEnd]);


    const handleSubmit = () => {
        onConfirm(password);
    };

    return (
        <div className="modal-backdrop alert-backdrop">
            <div ref={modalRef} className={`modal-content alert-modal ${isWrong ? 'shake-animation' : ''}`}>
                <div className="alert-content">
                    <h2>{t('admin_login_link')}</h2>
                    <p>{t('admin_password_prompt')}</p>
                    <input
                        ref={inputRef}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        style={{ marginTop: '16px', borderRadius: '12px' }}
                    />
                </div>
                <div className="modal-buttons">
                    <button onClick={onCancel}>{t('cancel_button')}</button>
                    <button className="alert-confirm-button" onClick={handleSubmit}>{t('login_button')}</button>
                </div>
            </div>
        </div>
    );
};


const AuthPage = ({ setLoggedInUser, t, setView }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isAdminPromptVisible, setAdminPromptVisible] = useState(false);
  const [isWrongAdminPassword, setIsWrongAdminPassword] = useState(false);

  const [users, setUsers] = useLocalStorage('users', []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!email || !password) {
        setError(t('error_all_fields'));
        return;
      }
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        setLoggedInUser(user);
      } else {
        setError(t('error_credentials'));
      }
    } else {
      if (!username || !email || !password) {
        setError(t('error_all_fields'));
        return;
      }
      if (!validateEmail(email)) {
          setError('유효한 이메일 주소를 입력해주세요.'); // Simple validation message
          return;
      }
      if (users.find(u => u.email === email)) {
        setError(t('error_email_in_use'));
        return;
      }
      const newUser = { id: Date.now(), username, email, password };
      setUsers([...users, newUser]);
      setLoggedInUser(newUser);
    }
  };
  
  const handleAdminLoginRequest = () => {
    setAdminPromptVisible(true);
  };
  
  const handleAdminPasswordSubmit = (password) => {
    if (password === '251010') {
        setAdminPromptVisible(false);
        const adminUser = { id: 'admin', username: 'Admin', email: 'admin@nova.dev' };
        setLoggedInUser(adminUser);
    } else {
        setIsWrongAdminPassword(true);
    }
  };

  const onAnimationEnd = useCallback(() => {
    setIsWrongAdminPassword(false);
  }, []);

  return (
    <div className="auth-container">
        <div className="auth-form-wrapper">
            <div className="auth-form">
                <h2>{isLogin ? t('login_title') : t('signup_title')}</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <div className="input-group">
                    <input
                        type="text"
                        placeholder={t('username_placeholder')}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    </div>
                )}
                <div className="input-group">
                    <input
                    type="email"
                    placeholder={t('email_placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <input
                    type="password"
                    placeholder={t('password_placeholder')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {isLogin && (
                    <div className="remember-me">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe">{t('remember_me_label')}</label>
                    </div>
                )}
                <button type="submit">{isLogin ? t('login_button') : t('signup_button')}</button>
                </form>
                <div className="toggle-form">
                {isLogin ? t('toggle_signup_prompt') : t('toggle_login_prompt')}
                  <button onClick={() => setIsLogin(!isLogin)}>
                      {isLogin ? t('signup_title') : t('login_title')}
                  </button>
                </div>
            </div>
        </div>
        <AuthFooter t={t} onCountryClick={() => setView('language')} onAdminClick={handleAdminLoginRequest} />
        
        {isAdminPromptVisible && (
            <AdminPasswordModal
                onConfirm={handleAdminPasswordSubmit}
                onCancel={() => setAdminPromptVisible(false)}
                t={t}
                isWrong={isWrongAdminPassword}
                onAnimationEnd={onAnimationEnd}
            />
        )}
    </div>
  );
};


// Fix: Explicitly defining props for TodoItem and using React.FC to address a TypeScript error where the `key` prop was not being correctly handled.
interface TodoItemProps {
  todo: any;
  onToggle: (id: any) => void;
  onDelete: (id: any) => void;
  onInfo: (todo: any) => void;
  onEdit: (todo: any) => void;
  dragStart: (e: React.DragEvent, index: number) => void;
  dragEnter: (e: React.DragEvent, index: number) => void;
  drop: (e: React.DragEvent) => void;
  index: number;
}
const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onInfo, onEdit, dragStart, dragEnter, drop, index }) => {
    const swipeableContentRef = useRef<HTMLDivElement>(null);
    const [swipeX, setSwipeX] = useState(0);
    const touchStartX = useRef(0);
    const isSwiping = useRef(false);

    const SWIPE_THRESHOLD_DELETE = -80; // Left
    const SWIPE_THRESHOLD_COMPLETE = 80; // Right

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStartX.current = touch.clientX;
        isSwiping.current = true;
        if (swipeableContentRef.current) {
            swipeableContentRef.current.style.transition = 'none';
        }
        // Prevent drag-and-drop from starting on touch devices
        const parentLi = swipeableContentRef.current?.parentElement;
        if (parentLi) parentLi.draggable = false;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping.current) return;
        const touch = e.touches[0];
        const currentX = touch.clientX;
        const diffX = currentX - touchStartX.current;
        
        // Prevent swiping past the threshold for non-completable recurring tasks
        if (diffX > 0 && todo.isRecurring && todo.completed) {
            setSwipeX(diffX * 0.3); // Add some resistance
            return;
        }

        setSwipeX(diffX);
    };

    const handleTouchEnd = () => {
        isSwiping.current = false;

        if (swipeableContentRef.current) {
            swipeableContentRef.current.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        }

        if (swipeX < SWIPE_THRESHOLD_DELETE) { // Swipe Left: Delete
            setSwipeX(-window.innerWidth);
            setTimeout(() => onDelete(todo.id), 400);
        } else if (swipeX > SWIPE_THRESHOLD_COMPLETE) { // Swipe Right: Complete
            if (!todo.completed) {
                onToggle(todo.id);
            }
            setSwipeX(0);
        } else {
            // Snap back to original position
            setSwipeX(0);
        }
        
        // Re-enable drag-and-drop
        const parentLi = swipeableContentRef.current?.parentElement;
        if (parentLi && !todo.isRecurring) {
            parentLi.draggable = true;
        }
    };

    const getActionOpacity = (threshold) => {
        const opacity = Math.min(1, Math.abs(swipeX) / Math.abs(threshold));
        return opacity;
    };

    return (
        <li
            className={todo.completed ? 'completed' : ''}
            draggable={!todo.isRecurring}
            onDragStart={(e) => dragStart(e, index)}
            onDragEnter={(e) => dragEnter(e, index)}
            onDragEnd={drop}
            onDragOver={(e) => e.preventDefault()}
        >
            <div className="swipe-actions-background">
                <div className="swipe-action left" style={{ opacity: getActionOpacity(SWIPE_THRESHOLD_DELETE) }}>
                    {icons.swipeDelete()}
                </div>
                <div className="swipe-action right" style={{ opacity: getActionOpacity(SWIPE_THRESHOLD_COMPLETE) }}>
                    {icons.swipeCheck()}
                </div>
            </div>
            <div
                ref={swipeableContentRef}
                className="swipeable-content"
                style={{ transform: `translateX(${swipeX}px)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <label className="checkbox-container">
                    <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
                    <span className="checkmark"></span>
                </label>
                <span className="todo-text">{todo.wish}</span>

                <div className="todo-actions-and-meta">
                    <div className="todo-meta-badges">
                        {todo.isRecurring && todo.streak > 0 && (
                            <span className="streak-indicator">{icons.fire()} {todo.streak}</span>
                        )}
                        {todo.deadline && <span className="todo-deadline">{todo.deadline}</span>}
                    </div>
                    <div className="todo-buttons">
                        <button className="info-button edit-button" onClick={() => onEdit(todo)} aria-label={getTranslation('edit_button_aria')}>
                            {icons.edit()}
                        </button>
                        <button className="info-button" onClick={() => onInfo(todo)} aria-label={getTranslation('info_button_aria')}>
                            {icons.info()}
                        </button>
                        <button className="delete-button" onClick={() => onDelete(todo.id)}>{getTranslation('delete_button')}</button>
                    </div>
                </div>
            </div>
        </li>
    );
};

const GoalAssistantStepContent = ({ children, direction, animationKey }) => {
    return (
        <div className={`goal-assistant-step-content-animator ${direction}`} key={animationKey}>
            {children}
        </div>
    );
};

const GoalAssistantModal = ({ onAdd, onCancel, t }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    wish: '',
    outcome: '',
    obstacle: '',
    plan: '',
    isRecurring: false,
    recurringDays: [],
    deadline: '',
  });
  const [noDeadline, setNoDeadline] = useState(false);
  const [error, setError] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState('forward');
  
  const steps = useMemo(() => [
    { key: 'wish', label: t('wish_label'), tip: t('wish_tip'), example: t('wish_example'), type: 'text', errorMsg: t('error_wish_required') },
    { key: 'outcome', label: t('outcome_label'), tip: t('outcome_tip'), example: t('outcome_example'), type: 'text', errorMsg: t('error_outcome_required') },
    { key: 'obstacle', label: t('obstacle_label'), tip: t('obstacle_tip'), example: t('obstacle_example'), type: 'text', errorMsg: t('error_obstacle_required') },
    { key: 'plan', label: t('plan_label'), tip: t('plan_tip'), example: t('plan_example'), type: 'textarea', errorMsg: t('error_plan_required') },
    { key: 'recurrence', label: t('recurrence_label'), tip: t('recurrence_tip'), example: t('recurrence_example'), type: 'toggle', errorMsg: t('error_day_required') },
    { key: 'deadline', label: t('deadline_label'), tip: t('deadline_tip'), example: t('deadline_example'), type: 'date', errorMsg: t('error_deadline_required') },
  ], [t]);

  const currentStepData = steps[step];
  
  const clearFeedback = () => {
    setAiFeedback('');
    setFeedbackError('');
    setIsFeedbackLoading(false);
  };

  const validateStep = () => {
    if (currentStepData.key === 'deadline' && noDeadline) {
      setError('');
      return true;
    }
     if (currentStepData.key === 'recurrence' && formData.isRecurring && formData.recurringDays.length === 0) {
        setError(currentStepData.errorMsg);
        return false;
    }
    if (currentStepData.type !== 'toggle' && !formData[currentStepData.key]?.trim()) {
        setError(currentStepData.errorMsg);
        return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      clearFeedback();
      if (step < steps.length - 1) {
        setTransitionDirection('forward');
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    setError('');
    clearFeedback();
    if (step > 0) {
        setTransitionDirection('backward');
        setStep(step - 1);
    }
  };
  
  const handleChange = (e) => {
    const { type, value, checked } = e.target;
    const key = currentStepData.key;
    setFormData({ ...formData, [key]: type === 'checkbox' ? checked : value });
    if (error) setError('');
    if (aiFeedback || feedbackError) clearFeedback();
  };
  
  const handleDayToggle = (dayIndex) => {
    const newRecurringDays = formData.recurringDays.includes(dayIndex)
        ? formData.recurringDays.filter(d => d !== dayIndex)
        : [...formData.recurringDays, dayIndex];
    setFormData(f => ({ ...f, recurringDays: newRecurringDays }));
    if (error) setError('');
  }

  const handleSubmit = () => {
    if (!validateStep()) return;
    
    const newTodo = {
      id: Date.now(),
      ...formData,
      deadline: noDeadline ? '' : formData.deadline,
      completed: false,
      lastCompletedDate: null,
      streak: 0,
    };
    onAdd(newTodo);
  };
  
  const handleGetFeedback = async () => {
    const currentKey = currentStepData.key;
    const currentValue = formData[currentKey];
    if (!currentValue.trim()) return;

    setIsFeedbackLoading(true);
    setAiFeedback('');
    setFeedbackError('');

    const language = getTranslation('login_footer_country') === '한국어' ? 'Korean' : 'English';

    const basePrompt = `You are a friendly goal coach. Provide a simple, easy-to-understand summary of feedback in ${language}. It must be very brief (under 3 short sentences) and focus on one key improvement tip.`;

    const prompts = {
        wish: `${basePrompt} Analyze this goal: "${currentValue}". Is it specific enough?`,
        outcome: `${basePrompt} Analyze this outcome: "${currentValue}". Is it motivating and vivid?`,
        obstacle: `${basePrompt} Analyze this obstacle: "${currentValue}". Is it a real, internal challenge?`,
        plan: `${basePrompt} Analyze this plan: "${currentValue}". Is it a concrete 'if-then' solution?`
    };

    const prompt = prompts[currentKey];
    if (!prompt) {
        setIsFeedbackLoading(false);
        return;
    }

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        setAiFeedback(response.text);
    } catch (error) {
        console.error("AI feedback generation failed:", error);
        setFeedbackError(t('feedback_error'));
    } finally {
        setIsFeedbackLoading(false);
    }
  };


  const handleToggleNoDeadline = (e) => {
    setNoDeadline(e.target.checked);
    if (e.target.checked) {
        setFormData(prev => ({ ...prev, deadline: '' }));
        if (error === t('error_deadline_required')) setError('');
    }
  };
  
  const progressPercentage = ((step + 1) / steps.length) * 100;
  
  useEffect(() => {
    const timer = setTimeout(() => {
        setAnimatedProgress(progressPercentage);
    }, 200);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const renderStepInput = () => {
    switch(currentStepData.type) {
      case 'textarea':
        return <textarea value={formData[currentStepData.key]} onChange={handleChange} rows={3} className={error ? 'input-error' : ''}></textarea>;
      case 'date':
        return (
          <>
            <input type="date" value={formData.deadline} onChange={handleChange} className={error ? 'input-error' : ''} disabled={noDeadline} />
            <div className="deadline-options">
                <label>
                    <input type="checkbox" checked={noDeadline} onChange={handleToggleNoDeadline} />
                    {t('no_deadline_label')}
                </label>
            </div>
          </>
        );
      case 'toggle':
        const dayNames = t('day_names_short');
        return (
          <>
            <div className="settings-item standalone-toggle">
                <span>{t('recurrence_option_daily')}</span>
                <label className="theme-toggle-switch">
                    <input type="checkbox" checked={formData.isRecurring} onChange={(e) => setFormData(f => ({...f, isRecurring: e.target.checked, recurringDays: e.target.checked ? f.recurringDays : []}))} />
                    <span className="slider round"></span>
                </label>
            </div>
            {formData.isRecurring && (
                <div className="day-picker">
                    {dayNames.map((day, index) => (
                        <button key={index} type="button" onClick={() => handleDayToggle(index)} className={`day-button ${formData.recurringDays.includes(index) ? 'selected' : ''}`}>
                            {day}
                        </button>
                    ))}
                </div>
            )}
          </>
        );
      case 'text':
      default:
        return <input type="text" value={formData[currentStepData.key]} onChange={handleChange} className={error ? 'input-error' : ''} />;
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content goal-assistant-modal">
        <div className="goal-assistant-header">
            <h2>{t('goal_assistant_title')}</h2>
            {step > 0 && <button onClick={onCancel} className="close-button">{t('cancel_button')}</button>}
        </div>

        <div className="goal-assistant-body">
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${animatedProgress}%` }}></div>
            </div>

             <GoalAssistantStepContent direction={transitionDirection} animationKey={step}>
                <div className="goal-assistant-step-content-inner">
                    <h3>{currentStepData.label}</h3>
                    
                    <div className="step-guidance">
                        <p className="tip">{currentStepData.tip}</p>
                        <p className="example">{currentStepData.example}</p>
                    </div>

                    <div className="input-group">
                        {renderStepInput()}
                        {error && (
                            <div className="field-error-message">
                                {icons.error()}
                                <span>{error}</span>
                            </div>
                        )}
                    </div>
                    {currentStepData.type !== 'date' && currentStepData.type !== 'toggle' && (
                        <div className="feedback-section">
                            <div className="feedback-button-container">
                                <button 
                                    onClick={handleGetFeedback} 
                                    className="feedback-button"
                                    disabled={!formData[currentStepData.key].trim() || isFeedbackLoading}
                                >
                                    {isFeedbackLoading ? t('getting_feedback') : t('get_feedback_button')}
                                </button>
                            </div>
                            {aiFeedback && !isFeedbackLoading && (
                                <div className="ai-feedback-content">
                                    <p>{aiFeedback}</p>
                                </div>
                            )}
                            {feedbackError && !isFeedbackLoading && (
                                <div className="field-error-message ai-feedback-error">
                                    {icons.error()}
                                    <span>{feedbackError}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </GoalAssistantStepContent>
        </div>

        <div className="goal-assistant-nav">
            <button onClick={step === 0 ? onCancel : handleBack}>
                {step === 0 ? t('cancel_button') : t('back_button')}
            </button>
            <button onClick={handleNext} className="next-button">
                {step === steps.length - 1 ? t('add_button') : t('next_button')}
            </button>
        </div>
      </div>
    </div>
  );
};

const EditGoalModal = ({ todo, onSave, onCancel, t }) => {
    const [formData, setFormData] = useState({ recurringDays: [], ...todo });
    const [noDeadline, setNoDeadline] = useState(!todo.deadline);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };
    
    const handleDayToggle = (dayIndex) => {
        const newRecurringDays = formData.recurringDays.includes(dayIndex)
            ? formData.recurringDays.filter(d => d !== dayIndex)
            : [...formData.recurringDays, dayIndex];
        setFormData(f => ({ ...f, recurringDays: newRecurringDays }));
    }

    const handleToggleNoDeadline = (e) => {
        setNoDeadline(e.target.checked);
        if (e.target.checked) {
            setFormData(prev => ({ ...prev, deadline: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            deadline: noDeadline ? '' : formData.deadline
        });
    };
    
    const dayNames = t('day_names_short');

    return (
        <div className="modal-backdrop">
            <div className="modal-content info-modal edit-modal">
                <h2>{t('edit_goal_modal_title')}</h2>
                <form onSubmit={handleSubmit} className="edit-goal-form">
                    <div className="form-section">
                        <label>{t('wish_label')}</label>
                        <input type="text" name="wish" value={formData.wish} onChange={handleChange} required />
                    </div>
                    <div className="form-section">
                        <label>{t('outcome_label')}</label>
                        <input type="text" name="outcome" value={formData.outcome} onChange={handleChange} required />
                    </div>
                    <div className="form-section">
                        <label>{t('obstacle_label')}</label>
                        <input type="text" name="obstacle" value={formData.obstacle} onChange={handleChange} required />
                    </div>
                    <div className="form-section">
                        <label>{t('plan_label')}</label>
                        <textarea name="plan" value={formData.plan} onChange={handleChange} rows="3" required></textarea>
                    </div>
                    <div className="form-section">
                        <label>{t('recurrence_label')}</label>
                        <div className="settings-item standalone-toggle">
                            <span>{t('recurrence_option_daily')}</span>
                            <label className="theme-toggle-switch">
                                <input type="checkbox" name="isRecurring" checked={formData.isRecurring} onChange={handleChange} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        {formData.isRecurring && (
                            <div className="day-picker">
                                {dayNames.map((day, index) => (
                                    <button key={index} type="button" onClick={() => handleDayToggle(index)} className={`day-button ${formData.recurringDays.includes(index) ? 'selected' : ''}`}>
                                        {day}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="form-section">
                        <label>{t('deadline_label')}</label>
                        <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} disabled={noDeadline} />
                         <div className="deadline-options">
                            <label>
                                <input type="checkbox" checked={noDeadline} onChange={handleToggleNoDeadline} />
                                {t('no_deadline_label')}
                            </label>
                        </div>
                    </div>
                    <div className="modal-buttons">
                        <button type="button" onClick={onCancel}>{t('cancel_button')}</button>
                        <button type="submit">{t('save_button')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const InfoModal = ({ todo, onClose, t }) => {
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    useEffect(() => {
        const generateSuggestion = async () => {
            setIsLoading(true);
            setAiError('');
            try {
                const language = getTranslation('login_footer_country') === '한국어' ? 'Korean' : 'English';
                const prompt = `
                Analyze the following goal based on the WOOP framework and provide a concise, actionable suggestion for improvement.
                Please provide the suggestion in ${language}.

                Wish (목표): ${todo.wish}
                Outcome (결과): ${todo.outcome}
                Obstacle (장애물): ${todo.obstacle}
                Plan (계획): ${todo.plan}

                Suggestion:`;

                const response = await ai.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: prompt,
                });
                
                setAiSuggestion(response.text);

            } catch (error) {
                console.error("AI suggestion generation failed:", error);
                setAiError('AI 제안을 생성하는 데 실패했습니다. 잠시 후 다시 시도해주세요.');
            } finally {
                setIsLoading(false);
            }
        };

        generateSuggestion();
    }, [todo]);

    return (
        <div className="modal-backdrop">
            <div className="modal-content info-modal">
                <h2>{t('goal_details_modal_title')}</h2>
                <div className="info-section">
                    <h4>{t('wish_label')}</h4>
                    <p>{todo.wish}</p>
                </div>
                <hr />
                <div className="info-section">
                    <h4>{t('outcome_label')}</h4>
                    <p>{todo.outcome}</p>
                </div>
                <hr />
                <div className="info-section">
                    <h4>{t('obstacle_label')}</h4>
                    <p>{todo.obstacle}</p>
                </div>
                <hr />
                <div className="info-section">
                    <h4>{t('plan_label')}</h4>
                    <p>{todo.plan}</p>
                </div>
                 <hr />
                <div className="info-section ai-analysis-section">
                    <h4>{t('ai_coach_suggestion')}</h4>
                    {isLoading ? (
                        <p>{t('ai_analyzing')}</p>
                    ) : (
                        <>
                         <p>{aiSuggestion}</p>
                         {aiError && <div className="error-message ai-error">{aiError}</div>}
                        </>
                    )}
                </div>
                <div className="modal-buttons">
                    <button onClick={onClose}>{t('close_button')}</button>
                </div>
            </div>
        </div>
    );
};

const AlertModal = ({ title, message, onConfirm }) => {
    return (
        <div className="modal-backdrop alert-backdrop">
            <div className="modal-content alert-modal">
                <div className="alert-content">
                    <h2>{title}</h2>
                    <p dangerouslySetInnerHTML={{ __html: message }}></p>
                </div>
                <div className="modal-buttons">
                    <button className="alert-confirm-button" onClick={onConfirm}>{getTranslation('confirm_button')}</button>
                </div>
            </div>
        </div>
    );
};

const ConfirmModal = ({ title, message, onConfirm, onCancel, confirmText, isDestructive }) => {
    return (
        <div className="modal-backdrop alert-backdrop">
            <div className="modal-content alert-modal">
                <div className="alert-content">
                    <h2>{title}</h2>
                    <p dangerouslySetInnerHTML={{ __html: message }}></p>
                </div>
                <div className="modal-buttons">
                    <button onClick={onCancel}>{getTranslation('cancel_button')}</button>
                      <button 
                          className={`alert-confirm-button ${isDestructive ? 'destructive' : ''}`}
                          onClick={onConfirm}
                      >
                          {confirmText}
                      </button>
                </div>
            </div>
        </div>
    );
}

const AISortReasonModal = ({ reason, onClose, t }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content info-modal">
                <h2>{t('ai_sort_reason_modal_title')}</h2>
                 <div className="info-section ai-analysis-section">
                    <h4>{t('ai_sort_criteria')}</h4>
                    <p>{reason}</p>
                </div>
                <div className="modal-buttons">
                    <button onClick={onClose}>{t('close_button')}</button>
                </div>
            </div>
        </div>
    );
};

const SettingsDeleteAccount = ({ onConfirm, onCancel, t }) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <div className="settings-section-body settings-page-body">
            <div className="terms-content">
                <p><strong>{t('delete_account_confirm_title')}</strong></p>
                <p>{t('delete_account_confirm_message')}</p>
                <ul>
                    <li>{t('delete_account_consequence_1')}</li>
                    <li>{t('delete_account_consequence_2')}</li>
                    <li>{t('delete_account_consequence_3')}</li>
                </ul>
                <p>{t('delete_account_guidance')}</p>
            </div>
            <div className="remember-me" style={{ marginTop: '16px', padding: '0 10px' }}>
                <input
                    type="checkbox"
                    id="deleteConfirm"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                />
                <label htmlFor="deleteConfirm">{t('settings_delete_confirm_checkbox')}</label>
            </div>
            <div className="modal-buttons" style={{ padding: '0 10px' }}>
                <button onClick={onCancel}>{t('cancel_button')}</button>
                  <button 
                      className="confirm-delete-button"
                      onClick={onConfirm}
                      disabled={!isChecked}
                  >
                      {t('delete_account_button')}
                  </button>
            </div>
        </div>
    );
};


// --- Settings Components ---
const SettingsMain = ({ setView, t, setDarkMode, isDarkMode, user, onLogout, currentLanguage, onExport, onImport }) => {
    const languageDisplay = useMemo(() => {
        return t('login_footer_country');
    }, [t]);
    
    return (
    <>
        <div className="settings-section">
             <div className="settings-section-title">{t('settings_section_info')}</div>
             <div className="settings-section-body">
                  <div className="settings-item nav-indicator" onClick={() => setView('version')}>
                      <span>{t('settings_version')}</span>
                      <span className="settings-item-value">
                        2.1 (25A423)
                        <span className="nav-indicator-icon">{icons.chevronRight()}</span>
                      </span>
                  </div>
             </div>
        </div>
        <div className="settings-section">
            <div className="settings-section-title">{t('settings_section_general')}</div>
            <div className="settings-section-body">
                <div className="settings-item">
                    <span>{t('settings_dark_mode')}</span>
                    <label className="theme-toggle-switch">
                        <input type="checkbox" checked={isDarkMode} onChange={() => setDarkMode(!isDarkMode)} />
                        <span className="slider round"></span>
                    </label>
                </div>
                  <div className="settings-item nav-indicator" onClick={() => setView('language')}>
                      <span>{t('settings_language')}</span>
                      <span className="settings-item-value">
                        {languageDisplay}
                        <span className="nav-indicator-icon">{icons.chevronRight()}</span>
                      </span>
                  </div>
                   <div className="settings-item nav-indicator" onClick={() => setView('background')}>
                      <span>{t('settings_section_background')}</span>
                      <span className="settings-item-value"><span className="nav-indicator-icon">{icons.chevronRight()}</span></span>
                  </div>
            </div>
        </div>
        <div className="settings-section">
            <div className="settings-section-title">{t('settings_section_data')}</div>
            <div className="settings-section-body">
                 <div className="settings-item action-item-with-desc">
                    <div className="action-button-wrapper">
                        <button className="action-button" onClick={onImport}>{t('settings_import_data')}</button>
                        <p>{t('settings_import_desc')}</p>
                    </div>
                </div>
                 <div className="settings-item action-item-with-desc">
                    <div className="action-button-wrapper">
                        <button className="action-button" onClick={onExport}>{t('settings_export_data')}</button>
                        <p>{t('settings_export_desc')}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="settings-section">
            <div className="settings-section-title">{t('settings_section_account')}</div>
            <div className="settings-section-body">
                <div className="settings-item">
                    <span>{t('settings_username')}</span>
                    <span className="settings-item-value">{user.username}</span>
                </div>
                <div className="settings-item">
                    <span>{t('settings_email')}</span>
                    <span className="settings-item-value">{user.email}</span>
                </div>
            </div>
        </div>
        <div className="settings-section">
            <div className="settings-section-body">
                   <div className="settings-item action-item" onClick={onLogout}>
                      <span className="action-text">{t('settings_logout')}</span>
                  </div>
                   <div className="settings-item action-item" onClick={() => setView('deleteAccount')}>
                      <span className="action-text destructive">{t('delete_account_button')}</span>
                  </div>
            </div>
        </div>
    </>
    );
};

const SettingsLanguage = ({ t, setCurrentLanguage, currentLanguage }) => {
    return (
        <>
            <div className="settings-section-body">
                  <div className="settings-item" onClick={() => setCurrentLanguage('ko')}>
                      <span>한국어</span>
                      {currentLanguage === 'ko' && <span className="checkmark-icon">{icons.check()}</span>}
                  </div>
                  <div className="settings-item" onClick={() => setCurrentLanguage('en')}>
                      <span>English</span>
                       {currentLanguage === 'en' && <span className="checkmark-icon">{icons.check()}</span>}
                  </div>
            </div>
        </>
    );
};

const BackgroundPicker = ({ t, selected, onSelect }) => {
    const options = {
        'dynamic': { name: t('settings_bg_dynamic') },
        'solid-white': { name: t('settings_bg_white') },
        'solid-pink': { name: t('settings_bg_pink') },
        'solid-blue': { name: t('settings_bg_blue') },
        'solid-green': { name: t('settings_bg_green') },
        'solid-purple': { name: t('settings_bg_purple') },
    };

    return (
        <div className="background-picker">
            {Object.entries(options).map(([key, { name }]) => (
                  <div className="background-option-wrapper" key={key} onClick={() => onSelect(key)}>
                      <div 
                          className={`background-option background-option-preview-${key} ${selected === key ? 'selected' : ''}`}
                      >
                           {selected === key && <div className="checkmark-overlay"><span className="checkmark-icon">{icons.check()}</span></div>}
                      </div>
                      <span>{name}</span>
                  </div>
            ))}
        </div>
    )
}

const SettingsBackground = ({ t, setBackground, currentBackground }) => {
    return (
         <div className="settings-section">
            <div className="settings-section-body" style={{background: 'transparent', border: 'none'}}>
                <BackgroundPicker t={t} selected={currentBackground} onSelect={setBackground} />
            </div>
        </div>
    );
};

const SettingsVersion = ({ t }) => (
    <div className="settings-section-body settings-page-body">
        <div className="version-info-content">
            <h3>{t('version_title')}</h3>
            <p>{t('version_intro')}</p>

            <h4>{t('version_feature_1_title')}</h4>
            <p>{t('version_feature_1_desc')}</p>

            <h4>{t('version_feature_2_title')}</h4>
            <p>{t('version_feature_2_desc')}</p>

            <h4>{t('version_feature_3_title')}</h4>
            <p>{t('version_feature_3_desc')}</p>

            <h4>{t('version_feature_4_title')}</h4>
            <p>{t('version_feature_4_desc')}</p>
            
            <hr />

            <h4>{t('version_developer_info')}</h4>
            <p>
                <strong>{t('version_developer_name')}:</strong> Kyumin<br />
                <strong>GitHub:</strong> <a href="https://github.com/Kyuminn/Nova" target="_blank" rel="noopener noreferrer">https://github.com/Kyuminn/Nova</a>
            </p>
        </div>
    </div>
);


const SettingsModal = ({
  onClose,
  t,
  isDarkMode, setDarkMode,
  user, setLoggedInUser,
  currentLanguage, setCurrentLanguage,
  background, setBackground,
  todos, setTodos, setToast
}) => {
    const [view, setView] = useState('main'); // 'main', 'language', 'background', 'version', 'deleteAccount'
    const [animationDirection, setAnimationDirection] = useState(''); // 'forward', 'backward'
    const viewHistory = useRef(['main']);
    const [dataToImport, setDataToImport] = useState(null); // Holds parsed data for confirmation
    const [importError, setImportError] = useState(null); // For showing import error alert

    const navigateTo = (newView) => {
        viewHistory.current.push(newView);
        setAnimationDirection('forward');
        setView(newView);
    };

    const goBack = (e) => {
        e.stopPropagation();
        if (viewHistory.current.length > 1) {
            viewHistory.current.pop();
            const prevView = viewHistory.current[viewHistory.current.length - 1];
            setAnimationDirection('backward');
            setView(prevView);
        }
    };

    const handleLogout = () => {
      setLoggedInUser(null);
      onClose();
    };

    const handleDeleteAccount = () => {
        localStorage.removeItem(`todos_${user.id}`);
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.filter(u => u.id !== user.id);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        handleLogout();
    };
    
    const handleExportData = () => {
        const dataStr = JSON.stringify(todos, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.download = 'nova_goals_backup.json';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };
    
    const handleImportTrigger = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            // FIX: Property 'files' does not exist on type 'EventTarget'. Cast to HTMLInputElement.
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    // FIX: Argument of type 'string | ArrayBuffer' is not assignable to parameter of type 'string'.
                    // Ensure result is a string before parsing.
                    const result = event.target?.result;
                    if (typeof result !== 'string') {
                      throw new Error("File content could not be read as text.");
                    }
                    const parsedData = JSON.parse(result);
                    // Basic validation: is it an array?
                    if (Array.isArray(parsedData)) {
                        setDataToImport(parsedData);
                    } else {
                        throw new Error("Invalid format");
                    }
                } catch (err) {
                    setImportError({
                        title: t('import_error_alert_title'),
                        message: t('import_error_alert_message')
                    });
                }
            };
            reader.onerror = () => {
                 setImportError({
                    title: t('import_error_alert_title'),
                    message: t('import_error_alert_message')
                });
            };
            reader.readAsText(file);
        };
        input.click();
    };
    
    const confirmImport = () => {
        if (dataToImport) {
            setTodos(dataToImport);
            setToast(t('import_success_toast'));
            setDataToImport(null);
            onClose(); // Close settings modal after successful import
        }
    };


    const renderContent = () => {
        const animationClass = animationDirection === 'forward' ? 'slide-in-forward' : 'slide-in-backward';
        
        let content;
        switch (view) {
            case 'main':
                content = <SettingsMain 
                    setView={navigateTo} 
                    t={t} 
                    setDarkMode={setDarkMode} 
                    isDarkMode={isDarkMode} 
                    user={user} 
                    onLogout={handleLogout} 
                    currentLanguage={currentLanguage}
                    onExport={handleExportData}
                    onImport={handleImportTrigger}
                 />;
                break;
            case 'language':
                content = <SettingsLanguage t={t} setCurrentLanguage={setCurrentLanguage} currentLanguage={currentLanguage} />;
                break;
            case 'background':
                content = <SettingsBackground t={t} setBackground={setBackground} currentBackground={background} />;
                break;
            case 'version':
                content = <SettingsVersion t={t} />;
                break;
            case 'deleteAccount':
                content = <SettingsDeleteAccount onConfirm={handleDeleteAccount} onCancel={goBack} t={t} />;
                break;
            default:
                content = null;
        }

        const titles = {
            main: t('settings_title'),
            language: t('settings_language'),
            background: t('settings_section_background'),
            version: t('settings_version'),
            deleteAccount: t('delete_account_button'),
        };

        return (
            <div className={`settings-animation-wrapper ${animationClass}`} key={view}>
                {view !== 'main' ? (
                     <div className="settings-sub-header">
                          <button onClick={goBack} className="settings-back-button">{icons.back()}</button>
                        <h2>{titles[view]}</h2>
                    </div>
                ) : (
                    <div className="settings-header">
                        <h2>{titles[view]}</h2>
                          <button onClick={onClose} className="settings-done-button">{t('settings_done_button')}</button>
                    </div>
                )}
                <div className="settings-content">
                    {content}
                </div>
            </div>
        );
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content settings-modal">
                {renderContent()}
                
                {dataToImport && (
                    <ConfirmModal 
                        title={t('import_confirm_title')}
                        message={t('import_confirm_message')}
                        onConfirm={confirmImport}
                        onCancel={() => setDataToImport(null)}
                        confirmText={t('confirm_button')}
                        isDestructive={true}
                    />
                )}
                 {importError && (
                    <AlertModal 
                        title={importError.title}
                        message={importError.message}
                        onConfirm={() => setImportError(null)}
                    />
                 )}
            </div>
        </div>
    );
};


const ProfilePopover = ({ t, onSettings, onLogout, user }) => {
    const popoverRef = useRef(null);
    return (
        <div className="profile-popover" ref={popoverRef}>
            <div className="popover-section">
                <div className="user-info">
                    <strong>{user.username}</strong>
                    <span>{user.email}</span>
                </div>
            </div>
            <div className="popover-section">
                  <button className="popover-action-button" onClick={(e) => { e.stopPropagation(); onSettings(); }}>
                      {icons.settings()}
                      <span>{t('profile_popover_settings')}</span>
                  </button>
            </div>
            <div className="popover-section">
                   <button className="popover-action-button" onClick={onLogout}>
                      {icons.logout()}
                      <span>{t('profile_popover_logout')}</span>
                  </button>
            </div>
        </div>
    );
};

const FilterSortPopover = ({
  t,
  filter, setFilter,
  sort, setSort,
}) => {
    const popoverRef = useRef(null);

    const filterOptions = [
      { key: 'all', label: t('filter_all') },
      { key: 'active', label: t('filter_active') },
      { key: 'completed', label: t('filter_completed') },
    ];
    
    const sortOptions = [
      { key: 'manual', label: t('sort_label_manual') },
      { key: 'deadline', label: t('sort_label_deadline') },
      { key: 'newest', label: t('sort_label_newest') },
      { key: 'alphabetical', label: t('sort_label_alphabetical') },
      { key: 'ai', label: t('sort_label_ai') },
    ];

    return (
        <div className="profile-popover filter-sort-popover" ref={popoverRef}>
             <div className="popover-section">
                <div className="user-info" style={{ padding: '12px 12px 8px 16px', borderBottom: 'none'}}>
                    <strong>{t('filter_title')}</strong>
                </div>
                {filterOptions.map(option => (
                       <button
                          key={option.key}
                          className={`popover-action-button ${filter === option.key ? 'active' : ''}`}
                          onClick={() => setFilter(option.key)}
                      >
                          <span>{option.label}</span>
                          {filter === option.key && <span className="checkmark-icon">{icons.check()}</span>}
                      </button>
                ))}
             </div>
             <div className="popover-section">
                <div className="user-info" style={{ padding: '12px 12px 8px 16px', borderBottom: 'none'}}>
                    <strong>{t('sort_title')}</strong>
                </div>
                {sortOptions.map(option => (
                       <button
                          key={option.key}
                          className={`popover-action-button ${sort === option.key ? 'active' : ''}`}
                          onClick={() => setSort(option.key)}
                      >
                          <span>{option.label}</span>
                           {sort === option.key && (option.key === 'ai' ? icons.ai() : <span className="checkmark-icon">{icons.check()}</span>)}
                      </button>
                ))}
            </div>
        </div>
    );
};

const CalendarView = ({ todos, onInfo, t, currentLanguage }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const todosByDate = useMemo(() => {
        const map = new Map();
        todos.forEach(todo => {
            if (todo.deadline) {
                const date = todo.deadline; // YYYY-MM-DD
                if (!map.has(date)) {
                    map.set(date, []);
                }
                map.get(date).push(todo);
            }
        });
        return map;
    }, [todos]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderHeader = () => {
        const monthName = t('month_names')[currentDate.getMonth()];
        const year = currentDate.getFullYear();
        return (
            <div className="calendar-header">
                <button onClick={handlePrevMonth}>{icons.back()}</button>
                <h2>{`${year} ${monthName}`}</h2>
                <button onClick={handleNextMonth} className="next-month-button">{icons.chevronRight()}</button>
            </div>
        );
    };

    const renderDaysOfWeek = () => {
        const dayNames = t('day_names_short');
        return (
            <div className="calendar-days-of-week">
                {dayNames.map(day => <div key={day}>{day}</div>)}
            </div>
        );
    };

    const renderCells = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const cells = [];
        const today = new Date();

        // Padding for days before the start of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            cells.push(<div className="calendar-day not-current-month" key={`prev-${i}`}></div>);
        }

        // Days of the current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            const goalsForDay = todosByDate.get(dateStr) || [];

            cells.push(
                <div className={`calendar-day ${isToday ? 'is-today' : ''}`} key={day}>
                    <span className="day-number">{day}</span>
                    <div className="calendar-goals">
                        {goalsForDay.map(todo => (
                            <div key={todo.id} className="calendar-goal-item" onClick={() => onInfo(todo)}>
                                {todo.isRecurring && icons.fire()} {todo.wish}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Padding for days after the end of the month
        while (cells.length % 7 !== 0) {
            cells.push(<div className="calendar-day not-current-month" key={`next-${cells.length}`}></div>);
        }

        return <div className="calendar-grid">{cells}</div>;
    };

    return (
        <div className="calendar-view-container">
            {renderHeader()}
            {renderDaysOfWeek()}
            {renderCells()}
        </div>
    );
};


const App = () => {
  const [loggedInUser, setLoggedInUser] = useLocalStorage('loggedInUser', null);
  const [todos, setTodos] = useLocalStorage(loggedInUser ? `todos_${loggedInUser.id}`: 'todos_guest', []);
  
  const [filter, setFilter] = useLocalStorage('todoFilter', 'all');
  const [sort, setSort] = useLocalStorage('todoSort', 'manual');
  const [mainView, setMainView] = useLocalStorage('mainView', 'list'); // 'list' or 'calendar'

  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [alert, setAlert] = useState(null); // { title, message }
  const [aiSortReason, setAiSortReason] = useState(null);
  const [isAiSorting, setIsAiSorting] = useState(false);
  const [toast, setToast] = useState('');

  const [isProfilePopoverOpen, setProfilePopoverOpen] = useState(false);
  const [isFilterSortPopoverOpen, setFilterSortPopoverOpen] = useState(false);
  const profilePopoverRef = useRef(null);
  const filterSortPopoverRef = useRef(null);

  // --- Settings States ---
  const [isDarkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [currentLanguage, setCurrentLanguage] = useLocalStorage('language', 'ko');
  const [background, setBackground] = useLocalStorage('background', 'dynamic'); // 'dynamic', 'solid-*'
  const [view, setView] = useState(loggedInUser ? 'app' : 'auth'); // 'auth', 'app', 'language'
  
  // --- Recurring Goal Helpers ---
  const findPreviousScheduledDate = useCallback((today, recurringDays) => {
      let checkDate = new Date(today);
      for (let i = 0; i < 7; i++) { // Check up to 7 days back
          checkDate.setDate(checkDate.getDate() - 1);
          if (recurringDays.includes(checkDate.getDay())) {
              return checkDate.toISOString().split('T')[0];
          }
      }
      return null; // No scheduled day found in the last week
  }, []);


  useEffect(() => {
    document.body.className = ''; // Clear previous classes
    if (isDarkMode) document.body.classList.add('dark-mode');
    document.body.classList.add(`bg-${background}`);
    document.documentElement.lang = currentLanguage;
  }, [isDarkMode, background, currentLanguage]);
  
  // Update view based on login state & handle recurring todos reset
  useEffect(() => {
    if (loggedInUser && view !== 'app') {
      setView('app');
      
      try { 
        const userTodosKey = `todos_${loggedInUser.id}`;
        let parsedTodos = [];
        try {
          const storedTodos = localStorage.getItem(userTodosKey);
          parsedTodos = storedTodos ? JSON.parse(storedTodos) : [];
        } catch (e) {
          console.error("Failed to parse todos from localStorage for user:", loggedInUser.id, e);
        }

        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        
        const updatedTodos = parsedTodos.map(todo => {
          if (!todo.isRecurring) return todo;
          
          const newTodo = { ...todo };
          
          if (newTodo.completed && newTodo.lastCompletedDate !== todayString) {
            newTodo.completed = false;
          }

          if (newTodo.streak > 0 && newTodo.recurringDays?.length > 0) {
            const lastScheduledDateBeforeToday = findPreviousScheduledDate(today, newTodo.recurringDays);
            if (newTodo.lastCompletedDate && lastScheduledDateBeforeToday && newTodo.lastCompletedDate < lastScheduledDateBeforeToday) {
              newTodo.streak = 0;
            }
          }
          return newTodo;
        });
        setTodos(updatedTodos);
      } catch (e) {
        console.error("An error occurred during the login effect processing:", e);
      }

      // Get AI Cheerup message
      const getAICheerupMessage = async () => {
          try {
              const lang = currentLanguage === 'ko' ? 'Korean' : 'English';
              const systemInstruction = `You are a cheerful and motivational coach for a goal-setting app. Your responses must be in ${lang}.`;
              const userPrompt = `Generate a short, encouraging, one-sentence message for a user named ${loggedInUser.username}. Address them by name and keep the message under 15 words.`;

              const response = await ai.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: userPrompt,
                  config: {
                      systemInstruction: systemInstruction,
                  },
              });
              setToast(response.text);
          } catch (error) {
              console.error("Failed to get AI cheer-up message:", error);
          }
      };
      getAICheerupMessage();

    } else if (!loggedInUser && view === 'app') {
      setView('auth');
    }
  }, [loggedInUser, view, findPreviousScheduledDate]);

  const t = (key) => getTranslation(key, currentLanguage);

  useClickOutside(profilePopoverRef, () => setProfilePopoverOpen(false));
  useClickOutside(filterSortPopoverRef, () => setFilterSortPopoverOpen(false));

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent, position: number) => {
    dragItem.current = position;
    (e.currentTarget as HTMLElement).classList.add('dragging');
  };

  const handleDragEnter = (e: React.DragEvent, position: number) => {
    dragOverItem.current = position;
  };

  const handleDrop = (e: React.DragEvent) => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const copyListItems = [...todos];
    // FIX: The error "Type 'string' is not assignable to type 'number'" on this line
    // suggests that dragItem.current might be a string. Coercing to Number to ensure it's a valid index.
    const dragItemContent = copyListItems[Number(dragItem.current)];
    copyListItems.splice(Number(dragItem.current), 1);
    copyListItems.splice(Number(dragOverItem.current), 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setTodos(copyListItems);
    (e.currentTarget as HTMLElement).classList.remove('dragging');
    setSort('manual');
  };

  const handleAddTodo = (newTodo) => {
    setTodos(prevTodos => [...prevTodos, newTodo]);
    setIsNewGoalModalOpen(false);
    
    setTimeout(() => {
        handleInfo(newTodo);
    }, 500); 
  };

  const handleUpdateTodo = (updatedTodo) => {
    setTodos(todos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
    setEditingTodo(null);
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo => {
        if (todo.id === id) {
            if (todo.isRecurring) {
                if (todo.completed) return todo;
                
                const today = new Date();
                const todayString = today.toISOString().split('T')[0];
                const prevScheduledDate = findPreviousScheduledDate(today, todo.recurringDays);
                const newStreak = (todo.lastCompletedDate === prevScheduledDate) ? (todo.streak || 0) + 1 : 1;
                
                return {
                    ...todo,
                    completed: true,
                    lastCompletedDate: todayString,
                    streak: newStreak
                };
            } else {
                return { ...todo, completed: !todo.completed };
            }
        }
        return todo;
    }));
};

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  const handleInfo = (todo) => {
    setSelectedTodo(todo);
    setIsInfoModalOpen(true);
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
  };

  const handleLogout = () => {
      setLoggedInUser(null);
      setProfilePopoverOpen(false);
  };

  const handleSort = async (type) => {
    setSort(type);
    if (type === 'ai') {
        if (todos.length < 2) {
            setAlert({ title: t('sort_alert_title'), message: t('sort_alert_message') });
            setSort('manual');
            return;
        }
        setIsAiSorting(true);
        try {
            const language = getTranslation('login_footer_country') === '한국어' ? 'Korean' : 'English';
            const prompt = `
            Here is a list of goals from a user based on the WOOP framework.
            Please sort these goals by priority. Consider urgency (deadlines), importance (based on the wish and outcome), and potential impact.
            Return a JSON object with two keys: "sorted_order" and "reason".
            "sorted_order" should be an array of the goal IDs (the 'id' field) in the recommended order.
            "reason" should be a brief, clear explanation in ${language} for why you chose this order.

            Goals:
            ${JSON.stringify(todos.map(({id, wish, outcome, deadline}) => ({id, wish, outcome, deadline})))}
            `;
            
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    sorted_order: {
                      type: Type.ARRAY,
                      // Fix: Use INTEGER for IDs and make sorting logic robust to handle potential string values from the API.
                      items: { type: Type.INTEGER }
                    },
                    reason: { type: Type.STRING }
                  }
                }
              }
            });

            const resultText = response.text.trim();
            const result = JSON.parse(resultText);
            
            const sortedIds = result.sorted_order;
            const numericSortedIds = Array.isArray(sortedIds) ? sortedIds.map(Number) : [];
            const newSortedTodos = [...todos].sort((a, b) => numericSortedIds.indexOf(Number(a.id)) - numericSortedIds.indexOf(Number(b.id)));

            setTodos(newSortedTodos);
            setAiSortReason(result.reason);

        } catch (error) {
            console.error("AI sorting failed:", error);
            setAlert({ title: "AI 정렬 실패", message: "AI 정렬 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."});
            setSort('manual'); // Revert to manual sort on failure
        } finally {
            setIsAiSorting(false);
        }
    }
  }

  const filteredAndSortedTodos = useMemo(() => {
    const nonRecurring = todos.filter(t => !t.isRecurring);
    const recurring = todos.filter(t => t.isRecurring);

    const filterAndSortList = (list) => {
        const filtered = list.filter(todo => {
            if (filter === 'active') return !todo.completed;
            if (filter === 'completed') return todo.completed;
            return true;
        });

        if (sort === 'manual' || sort === 'ai') return filtered;

        return [...filtered].sort((a, b) => {
            switch (sort) {
                case 'deadline':
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                case 'newest':
                    // FIX: `b.id` or `a.id` could be a string, causing an error with the `-` operator.
                    // Coerce them to numbers to ensure correct sorting.
                    return Number(b.id) - Number(a.id);
                case 'alphabetical':
                    return a.wish.localeCompare(b.wish);
                default:
                    return 0;
            }
        });
    };
    
    // FIX: A todo's id might be a string. Explicitly convert to number for sorting.
    const sortedRecurring = recurring.sort((a,b) => Number(a.id) - Number(b.id));

    return [...sortedRecurring, ...filterAndSortList(nonRecurring)];

  }, [todos, filter, sort]);
  
  const performanceScore = useMemo(() => {
    const totalGoals = todos.length;
    if (totalGoals === 0) return 0;

    const nonRecurringGoals = todos.filter(t => !t.isRecurring);
    const completedNonRecurring = nonRecurringGoals.filter(t => t.completed).length;
    
    const completionRate = nonRecurringGoals.length > 0
        ? (completedNonRecurring / nonRecurringGoals.length)
        : 1; 

    const baseScore = completionRate * 80;
    const totalStreak = todos.reduce((sum, todo) => sum + (todo.streak || 0), 0);
    const bonusScore = Math.min(20, totalStreak);

    return Math.round(baseScore + bonusScore);
  }, [todos]);
  
  if (view === 'language') {
      return <LanguageSelectionPage t={t} setCurrentLanguage={setCurrentLanguage} setView={setView} />;
  }

  if (!loggedInUser) {
    return <AuthPage setLoggedInUser={setLoggedInUser} t={t} setView={setView} />;
  }


  return (
    <div className={`main-page-layout ${mainView === 'calendar' ? 'calendar-view-active' : ''}`}>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      <div className="container">
        <header>
          <h1>{t('my_goals_title')}</h1>
          <div className="header-buttons">
            {aiSortReason && sort === 'ai' && (
                <button className="ai-info-button" onClick={() => setAiSortReason(aiSortReason)}>
                    {icons.ai()}
                </button>
            )}
            
            <div className="performance-score">
              <span>{performanceScore}</span>
            </div>
            
            <button
                className="more-button"
                onClick={() => setMainView(mainView === 'list' ? 'calendar' : 'list')}
                aria-label={mainView === 'list' ? t('calendar_view_button_aria') : t('list_view_button_aria')}
            >
                {mainView === 'list' ? icons.calendar() : icons.list()}
            </button>

            <div className="filter-sort-container" ref={filterSortPopoverRef}>
                    <button 
                        className="more-button"
                        onClick={(e) => { e.stopPropagation(); setFilterSortPopoverOpen(!isFilterSortPopoverOpen);}}
                        aria-label={t('filter_sort_button_aria')}
                        disabled={isAiSorting}
                    >
                       {isAiSorting ? t('ai_sorting_button') : icons.more()}
                    </button>
                {isFilterSortPopoverOpen && (
                    <FilterSortPopover
                        t={t}
                        filter={filter}
                        setFilter={(f) => { setFilter(f); setFilterSortPopoverOpen(false); }}
                        sort={sort}
                        setSort={(s) => { handleSort(s); setFilterSortPopoverOpen(false); }}
                    />
                )}
            </div>

              <button className="add-button" onClick={() => setIsNewGoalModalOpen(true)} aria-label={t('add_new_goal_button_label')}>
                {icons.add()}
              </button>

            <div className="profile-container" ref={profilePopoverRef}>
                    <button className="profile-button" onClick={(e) => { e.stopPropagation(); setProfilePopoverOpen(!isProfilePopoverOpen); }}>
                       {loggedInUser.username.charAt(0).toUpperCase()}
                    </button>
                {isProfilePopoverOpen && (
                  <ProfilePopover 
                    t={t} 
                    user={loggedInUser}
                    onSettings={() => { setIsSettingsModalOpen(true); setProfilePopoverOpen(false); }}
                    onLogout={handleLogout}
                  />
                )}
            </div>
          </div>
        </header>
        
        <main>
            {mainView === 'list' ? (
                <>
                {filteredAndSortedTodos.length > 0 ? (
                  <ul>
                    {filteredAndSortedTodos.map((todo, index) => (
                        <TodoItem
                          key={todo.id}
                          index={index}
                          todo={todo}
                          onToggle={handleToggleTodo}
                          onDelete={handleDeleteTodo}
                          onInfo={handleInfo}
                          onEdit={handleEdit}
                          dragStart={handleDragStart}
                          dragEnter={handleDragEnter}
                          drop={handleDrop}
                        />
                    ))}
                  </ul>
                ) : (
                  <div className="empty-message">
                    {filter === 'all' && t('empty_message_all')}
                    {filter === 'active' && t('empty_message_active')}
                    {filter === 'completed' && t('empty_message_completed')}
                  </div>
                )}
                </>
            ) : (
                <CalendarView
                    todos={todos}
                    onInfo={handleInfo}
                    t={t}
                    currentLanguage={currentLanguage}
                />
            )}
        </main>
      </div>

       {isNewGoalModalOpen && (
        <GoalAssistantModal
          onAdd={handleAddTodo}
          onCancel={() => setIsNewGoalModalOpen(false)}
          t={t}
        />
      )}

      {isInfoModalOpen && selectedTodo && (
        <InfoModal todo={selectedTodo} onClose={() => setIsInfoModalOpen(false)} t={t} />
      )}
      
      {editingTodo && (
        <EditGoalModal
            todo={editingTodo}
            onSave={handleUpdateTodo}
            onCancel={() => setEditingTodo(null)}
            t={t}
        />
      )}

      {alert && (
          <AlertModal title={alert.title} message={alert.message} onConfirm={() => setAlert(null)} />
      )}
      
      {aiSortReason && typeof aiSortReason === 'string' && (
        <AISortReasonModal reason={aiSortReason} onClose={() => setAiSortReason(null)} t={t} />
      )}

      {isSettingsModalOpen && (
        <SettingsModal 
            onClose={() => setIsSettingsModalOpen(false)} 
            t={t}
            isDarkMode={isDarkMode} setDarkMode={setDarkMode}
            user={loggedInUser} setLoggedInUser={setLoggedInUser}
            currentLanguage={currentLanguage} setCurrentLanguage={setCurrentLanguage}
            background={background} setBackground={setBackground}
            todos={todos} setTodos={setTodos} setToast={setToast}
        />
      )}
       <AuthFooter t={t} onCountryClick={() => { setIsSettingsModalOpen(true); }} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);