import React, { useState, useEffect } from 'react';
import './GoalCreateModal.css';

// Goal 인터페이스 정의 (main.tsx와 동일)
interface Goal {
  isSharedTodo?: boolean;
  id: number;
  wish: string;
  outcome: string;
  obstacle: string;
  plan: string;
  isRecurring: boolean;
  recurringDays: number[];
  deadline: string;
  completed: boolean;
  lastCompletedDate: string | null;
  streak: number;
  folderId?: string;
  ownerId?: string;
  collaborators?: any[];
  sharedWith?: any[];
  category?: string;
  title?: string;
  subGoals?: any[];
  memo?: string;
  tags?: string[];
  isPrivate?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // 알림 관련 필드 추가
  deadlineNotifications?: string[]; // ['1hour', '3hours', '1day', '3days', '7days']
  notificationSettings?: {
    enabled: boolean;
    intervals: string[];
  };
}

interface GoalCreateModalProps {
  onClose: () => void;
  onAddTodo?: (newTodoData: Omit<Goal, "id" | "completed" | "lastCompletedDate" | "streak">) => void;
  onAddMultipleTodos?: (newTodosData: Omit<Goal, "id" | "completed" | "lastCompletedDate" | "streak">[]) => void;
  onEditTodo?: (updatedTodo: Goal) => void;
  existingTodo?: Goal | null;
  t: (key: string) => any;
  language: string;
  createAI: (key?: string) => any | null;
  userCategories: string[];
}

const GoalCreateModal: React.FC<GoalCreateModalProps> = ({ 
  onClose,
  onAddTodo,
  onAddMultipleTodos,
  onEditTodo,
  existingTodo,
  t,
  language,
  createAI,
  userCategories
}) => {
  const [activeTab, setActiveTab] = useState<'woop' | 'quick' | 'todo'>('woop');
  const [woopStep, setWoopStep] = useState<number>(1);

  const [woopWish, setWoopWish] = useState('');
  const [woopOutcome, setWoopOutcome] = useState('');
  const [woopObstacle, setWoopObstacle] = useState('');
  const [woopPlan, setWoopPlan] = useState('');
  const [woopIsRecurring, setWoopIsRecurring] = useState(false);
  const [woopRecurringDays, setWoopRecurringDays] = useState<number[]>([]);
  const [woopDeadline, setWoopDeadline] = useState('');
  const [quickInput, setQuickInput] = useState('');
  const [todoInput, setTodoInput] = useState('');
  
  // 알림 설정 상태 추가
  const [deadlineNotifications, setDeadlineNotifications] = useState<string[]>(['1day', '3hours']);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  useEffect(() => {
    if (existingTodo) {
      // If editing, populate fields. This is a simplified example.
      // You might need a more complex logic to map existingTodo to the correct tab and fields.
      if (existingTodo.subGoals && existingTodo.subGoals.length > 0) {
        setActiveTab('todo');
        setTodoInput(existingTodo.title);
      } else {
        setActiveTab('quick');
        setQuickInput(existingTodo.title);
      }
      // Reset WOOP fields if needed
      setWoopWish(existingTodo.title);
      setWoopOutcome(existingTodo.outcome || '');
      setWoopObstacle(existingTodo.obstacle || '');
      setWoopPlan(existingTodo.plan || '');
      setWoopIsRecurring(existingTodo.isRecurring || false);
      setWoopRecurringDays(existingTodo.recurringDays || []);
      setWoopDeadline(existingTodo.deadline || '');

    } else {
      // Reset fields for new goal
      setWoopWish('');
      setWoopOutcome('');
      setWoopObstacle('');
      setWoopPlan('');
      setWoopIsRecurring(false);
      setWoopRecurringDays([]);
      setWoopDeadline('');
      setQuickInput('');
      setTodoInput('');
      setActiveTab('woop');
      setWoopStep(1);
    }
  }, [existingTodo]);


  const handleNextWoopStep = () => {
    if (woopStep < 4) {
      setWoopStep(woopStep + 1);
    } else {
      // Handle final submission
      if (onAddTodo && woopWish) {
        onAddTodo({
          wish: woopWish,
          outcome: woopOutcome,
          obstacle: woopObstacle,
          plan: woopPlan,
          title: woopWish,
          isRecurring: woopIsRecurring,
          recurringDays: woopRecurringDays,
          deadline: woopDeadline,
          category: '',
          subGoals: [],
          memo: '',
          tags: [],
          isPrivate: false,
          sharedWith: [],
          folderId: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // 알림 설정 추가
          deadlineNotifications: woopDeadline ? deadlineNotifications : [],
          notificationSettings: {
            enabled: !!woopDeadline && deadlineNotifications.length > 0,
            intervals: deadlineNotifications
          }
        });
      }
      onClose();
    }
  };

  const handlePrevWoopStep = () => {
    if (woopStep > 1) {
      setWoopStep(woopStep - 1);
    } else {
      // 1단계에서는 모달 닫기
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content goal-create-modal light">
        <div className="modal-topbar">
          <div style={{ width: '40px' }}>
            {woopStep > 1 && (
              <button 
                className="toplink" 
                onClick={handlePrevWoopStep}
                style={{ fontSize: '17px', color: 'var(--link-color)' }}
              >
                뒤로
              </button>
            )}
          </div>
          <div className="modal-title">
            {woopStep === 1 ? '새로운 목표' : `${woopStep}. WOOP 프레임워크`}
          </div>
          <button 
            className="toplink right" 
            onClick={woopStep === 1 ? onClose : handlePrevWoopStep}
            style={{ fontSize: '17px', color: 'var(--link-color)' }}
          >
            {woopStep === 1 ? '닫기' : '취소'}
          </button>
        </div>

        <div className="modal-body">
          <a className="breadcrumb">WOOP 새로운 할일장기 계획</a>
          <div className="woop-card">
            <div className="woop-card-content">
              {woopStep === 1 && (
                <>
                  <h3>목표</h3>
                  <p>측정 가능하고, 구체적이며, 도전적이면서도 현실적인 목표를 설정하세요.</p>
                  <textarea className="large-input" placeholder="예: 3개월 안에 5kg 감량하기, 이번 학기에 A+ 받기" value={woopWish} onChange={(e) => setWoopWish(e.target.value)} />
                </>
              )}
              {woopStep === 2 && (
                <>
                  <h3>최상의 결과</h3>
                  <p>목표 달성 시 얻게 될 가장 긍정적인 결과를 생생하게 상상해 보세요.</p>
                  <textarea className="large-input" placeholder="예: 더 건강하고 자신감 있는 모습, 성적 장학금 수령" value={woopOutcome} onChange={(e) => setWoopOutcome(e.target.value)} />
                </>
              )}
              {woopStep === 3 && (
                <>
                  <h3>장애물</h3>
                  <p>목표 달성을 방해할 수 있는 내면의 장애물(습관, 감정 등)은 무엇인가요?</p>
                  <textarea className="large-input" placeholder="예: 퇴근 후 피곤해서 운동 가기 싫은 마음, 어려운 과제를 미루는 습관" value={woopObstacle} onChange={(e) => setWoopObstacle(e.target.value)} />
                </>
              )}
              {woopStep === 4 && (
                <>
                  <h3>If-Then 계획</h3>
                  <p>"만약 ~라면, ~하겠다" 형식으로 장애물에 대한 구체적인 대응 계획을 세워보세요.</p>
                  <textarea className="large-input" placeholder="예: 만약 퇴근 후 운동 가기 싫다면, 일단 운동복으로 갈아입고 10분만 스트레칭한다." value={woopPlan} onChange={(e) => setWoopPlan(e.target.value)} />
                  
                  <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                    <h3>반복 설정 (선택사항)</h3>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={woopIsRecurring} 
                        onChange={(e) => setWoopIsRecurring(e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span>반복 목표로 설정</span>
                    </label>
                    
                    {woopIsRecurring && (
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(7, 1fr)', 
                        gap: '6px',
                        marginTop: '8px'
                      }}>
                        {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              if (woopRecurringDays.includes(index)) {
                                setWoopRecurringDays(woopRecurringDays.filter(d => d !== index));
                              } else {
                                setWoopRecurringDays([...woopRecurringDays, index]);
                              }
                            }}
                            style={{
                              padding: '10px 0',
                              border: woopRecurringDays.includes(index) ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                              borderRadius: '8px',
                              backgroundColor: woopRecurringDays.includes(index) ? 'var(--primary-color)' : 'var(--input-bg-color)',
                              color: woopRecurringDays.includes(index) ? 'white' : 'var(--text-color)',
                              cursor: 'pointer',
                              fontSize: '13px',
                              fontWeight: '600',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: '44px'
                            }}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    )}

                    <div style={{ marginTop: '16px' }}>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>목표 기한 (선택사항)</span>
                        <input 
                          type="date" 
                          value={woopDeadline} 
                          onChange={(e) => {
                            setWoopDeadline(e.target.value);
                            setShowNotificationSettings(!!e.target.value);
                          }}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--input-bg-color)',
                            color: 'var(--text-color)',
                            fontSize: '14px'
                          }}
                        />
                      </label>
                    </div>

                    {/* 마감일 알림 설정 */}
                    {woopDeadline && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-color)' }}>
                          📢 마감일 알림 설정
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary-color)', marginBottom: '12px' }}>
                          마감일까지 남은 시간에 따라 알림을 받을 수 있습니다.
                        </p>
                        
                        <div style={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(2, 1fr)', 
                          gap: '8px',
                          marginTop: '8px'
                        }}>
                          {[
                            { id: '1hour', label: '1시간 전' },
                            { id: '3hours', label: '3시간 전' },
                            { id: '5hours', label: '5시간 전' },
                            { id: '12hours', label: '12시간 전' },
                            { id: '1day', label: '1일 전' },
                            { id: '2days', label: '2일 전' },
                            { id: '3days', label: '3일 전' },
                            { id: '7days', label: '7일 전' }
                          ].map((option) => (
                            <label
                              key={option.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px',
                                borderRadius: '6px',
                                backgroundColor: deadlineNotifications.includes(option.id) ? 'var(--primary-color)' : 'var(--input-bg-color)',
                                color: deadlineNotifications.includes(option.id) ? 'white' : 'var(--text-color)',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500',
                                transition: 'all 0.2s ease',
                                border: '1px solid var(--border-color)'
                              }}
                              onClick={() => {
                                if (deadlineNotifications.includes(option.id)) {
                                  setDeadlineNotifications(deadlineNotifications.filter(id => id !== option.id));
                                } else {
                                  setDeadlineNotifications([...deadlineNotifications, option.id]);
                                }
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={deadlineNotifications.includes(option.id)}
                                onChange={() => {}} // 클릭 이벤트로 처리
                                style={{ pointerEvents: 'none' }}
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                        
                        <div style={{ 
                          marginTop: '8px', 
                          fontSize: '11px', 
                          color: 'var(--text-secondary-color)',
                          fontStyle: 'italic'
                        }}>
                          💡 알림 설정에서 "마감일 임박 알림"이 활성화되어야 작동합니다.
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="ai-summary">
            <span className="robot">🤖</span>
            <button className="summary-link">요약보기</button>
          </div>
        </div>

        <div style={{ padding: '16px', display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)' }}>
          {woopStep === 1 ? (
            <button 
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'transparent',
                color: 'var(--text-color)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              취소
            </button>
          ) : (
            <button 
              onClick={handlePrevWoopStep}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'transparent',
                color: 'var(--text-color)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              뒤로
            </button>
          )}
          <button 
            onClick={handleNextWoopStep}
            disabled={woopStep === 1 && !woopWish}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '8px',
              backgroundColor: (woopStep === 1 && !woopWish) ? 'var(--border-color)' : 'var(--primary-color)',
              color: 'white',
              border: 'none',
              cursor: (woopStep === 1 && !woopWish) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {woopStep === 4 ? '완료' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalCreateModal;
