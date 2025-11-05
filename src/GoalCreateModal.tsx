import React, { useState, useEffect } from 'react';
import './GoalCreateModal.css';
import { Goal } from './types';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GoalCreateModalProps {
  onClose: () => void;
  onAddTodo?: (newTodoData: Omit<Goal, "id" | "completed" | "lastCompletedDate" | "streak">) => void;
  onAddMultipleTodos?: (newTodosData: Omit<Goal, "id" | "completed" | "lastCompletedDate" | "streak">[]) => void;
  onEditTodo?: (updatedTodo: Goal) => void;
  existingTodo?: Goal | null;
  t: (key: string) => any;
  language: string;
  createAI: (key?: string) => GoogleGenerativeAI | null;
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
  const [quickInput, setQuickInput] = useState('');
  const [todoInput, setTodoInput] = useState('');

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
      setWoopOutcome(existingTodo.woop?.outcome || '');
      setWoopObstacle(existingTodo.woop?.obstacle || '');
      setWoopPlan(existingTodo.woop?.plan || '');

    } else {
      // Reset fields for new goal
      setWoopWish('');
      setWoopOutcome('');
      setWoopObstacle('');
      setWoopPlan('');
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
          isRecurring: false,
          recurringDays: [],
          deadline: '',
          category: '',
          subGoals: [],
          memo: '',
          tags: [],
          isPrivate: false,
          sharedWith: [],
          folderId: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      onClose();
    }
  };

  const handlePrevWoopStep = () => {
    if (woopStep > 1) {
      setWoopStep(woopStep - 1);
    }
  };

  const renderWoopContent = () => {
    switch (woopStep) {
      case 1:
        return (
          <>
            <h3>목표</h3>
            <p>측정 가능하고, 구체적이며, 도전적이면서도 현실적인 목표를 설정하세요.</p>
            <textarea placeholder="예: 3개월 안에 5kg 감량하기, 이번 학기에 A+ 받기" value={woopWish} onChange={(e) => setWoopWish(e.target.value)} />
          </>
        );
      case 2:
        return (
          <>
            <h3>최상의 결과</h3>
            <p>목표 달성 시 얻게 될 가장 긍정적인 결과를 생생하게 상상해 보세요.</p>
            <textarea placeholder="예: 더 건강하고 자신감 있는 모습, 성적 장학금 수령" value={woopOutcome} onChange={(e) => setWoopOutcome(e.target.value)} />
          </>
        );
      case 3:
        return (
          <>
            <h3>장애물</h3>
            <p>목표 달성을 방해할 수 있는 내면의 장애물(습관, 감정 등)은 무엇인가요?</p>
            <textarea placeholder="예: 퇴근 후 피곤해서 운동 가기 싫은 마음, 어려운 과제를 미루는 습관" value={woopObstacle} onChange={(e) => setWoopObstacle(e.target.value)} />
          </>
        );
      case 4:
        return (
          <>
            <h3>If-Then 계획</h3>
            <p>"만약 ~라면, ~하겠다" 형식으로 장애물에 대한 구체적인 대응 계획을 세워보세요.</p>
            <textarea placeholder="예: 만약 퇴근 후 운동 가기 싫다면, 일단 운동복으로 갈아입고 10분만 스트레칭한다." value={woopPlan} onChange={(e) => setWoopPlan(e.target.value)} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content goal-create-modal light">
        <div className="modal-topbar">
          <div style={{ width: '40px' }}></div>
          <div className="modal-title">새로운 목표</div>
          <button className="toplink right" onClick={onClose} style={{ fontSize: '17px', color: 'var(--link-color)' }}>닫기</button>
        </div>

        <div className="modal-body">
          <a className="breadcrumb">WOOP 새로운 할일장기 계획</a>
          <div className="woop-card">
            <div className="woop-card-content">
              <h3>목표</h3>
              <p>측정 가능하고, 구체적이며, 도전적이면서도 현실적인 목표를 설정하세요.</p>
              <textarea className="large-input" placeholder="예: 3개월 안에 5kg 감량하기, 이번 학기에 A+ 받기" value={woopWish} onChange={(e) => setWoopWish(e.target.value)} />
              <h3>최상의 결과</h3>
              <p>목표 달성 시 얻게 될 가장 긍정적인 결과를 생생하게 상상해 보세요.</p>
              <textarea className="large-input" placeholder="예: 더 건강하고 자신감 있는 모습, 성적 장학금 수령" value={woopOutcome} onChange={(e) => setWoopOutcome(e.target.value)} />
              <h3>장애물</h3>
              <p>목표 달성을 방해할 수 있는 내면의 장애물(습관, 감정 등)은 무엇인가요?</p>
              <textarea className="large-input" placeholder="예: 퇴근 후 피곤해서 운동 가기 싫은 마음, 어려운 과제를 미루는 습관" value={woopObstacle} onChange={(e) => setWoopObstacle(e.target.value)} />
              <h3>If-Then 계획</h3>
              <p>"만약 ~라면, ~하겠다" 형식으로 장애물에 대한 구체적인 대응 계획을 세워보세요.</p>
              <textarea className="large-input" placeholder="예: 만약 퇴근 후 운동 가기 싫다면, 일단 운동복으로 갈아입고 10분만 스트레칭한다." value={woopPlan} onChange={(e) => setWoopPlan(e.target.value)} />
            </div>
          </div>
          <div className="ai-summary">
            <span className="robot">🤖</span>
            <button className="summary-link">요약보기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalCreateModal;
