import React, { useState } from 'react';

// 통일감 있는 모달 스타일 적용 (GoalAssistantModal 등과 동일한 구조)
const FolderCreateModal = ({
  onClose,
  onCreate,
  t,
  defaultIsShared = false,
  googleUser,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [name, setName] = useState('');
  const [isShared, setIsShared] = useState(defaultIsShared);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [collaborators, setCollaborators] = useState([]);
  const [error, setError] = useState('');

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 400);
  };

  const handleCreate = () => {
    if (!name.trim()) {
      setError('폴더 이름을 입력하세요.');
      return;
    }
    onCreate({
      name: name.trim(),
      isShared,
      collaborators: isShared ? collaborators : [],
    });
    handleClose();
  };

  const handleAddCollaborator = () => {
    if (!inviteEmail.trim()) return;
    setCollaborators([
      ...collaborators,
      { email: inviteEmail.trim(), role: inviteRole, userId: `invited_${Date.now()}` },
    ]);
    setInviteEmail('');
    setInviteRole('editor');
  };

  const handleRemoveCollaborator = (userId) => {
    setCollaborators(collaborators.filter(c => c.userId !== userId));
  };

  return (
    <div className={`modal-backdrop${isClosing ? ' is-closing' : ''}`} onClick={handleClose}>
      <div className={`modal-content goal-assistant-modal${isClosing ? ' is-closing' : ''}`} onClick={e => e.stopPropagation()} style={{ maxWidth: 420, minWidth: 320 }}>
        {/* 헤더 */}
        <div className="goal-assistant-header">
          <div className="goal-assistant-header-left" />
          <h2>{t ? t('folder_create_title') : '새 폴더 만들기'}</h2>
          <div className="goal-assistant-header-right">
            <button onClick={handleClose} className="close-button">✕</button>
          </div>
        </div>
        {/* 바디 */}
        <div className="goal-assistant-body" style={{ padding: '24px 16px' }}>
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>폴더 이름</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="폴더 이름을 입력하세요"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1.5px solid var(--border-color)',
                backgroundColor: 'var(--input-bg-color)',
                color: 'var(--text-color)',
                fontSize: '15px',
                fontFamily: 'inherit',
                marginBottom: 4,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border 0.2s',
              }}
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
            />
            {error && <div style={{ color: 'var(--danger-color)', fontSize: '13px', marginTop: 4 }}>{error}</div>}
          </div>
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="settings-item standalone-toggle" style={{ fontWeight: 500, marginBottom: 8 }}>
              <span>공유 폴더로 만들기</span>
              <label className="theme-toggle-switch">
                <input type="checkbox" checked={isShared} onChange={e => setIsShared(e.target.checked)} />
                <span className="slider round"></span>
              </label>
            </label>
          </div>
          {isShared && (
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>협업자 추가 (선택)</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="이메일 입력"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--border-color)',
                    backgroundColor: 'var(--input-bg-color)',
                    color: 'var(--text-color)',
                    fontSize: '14px',
                  }}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddCollaborator(); }}
                />
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--border-color)',
                    backgroundColor: 'var(--input-bg-color)',
                    color: 'var(--text-color)',
                    fontSize: '14px',
                  }}
                >
                  <option value="editor">편집자</option>
                  <option value="viewer">뷰어</option>
                </select>
                <button
                  onClick={handleAddCollaborator}
                  className="primary"
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  disabled={!inviteEmail.trim()}
                >
                  추가
                </button>
              </div>
              {/* 협업자 목록 */}
              {collaborators.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {collaborators.map(c => (
                    <div key={c.userId} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: '14px' }}>{c.email}</span>
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary-color)' }}>{c.role === 'editor' ? '편집자' : '뷰어'}</span>
                      <button onClick={() => handleRemoveCollaborator(c.userId)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', fontSize: '15px', cursor: 'pointer' }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {/* 하단 버튼 */}
        <div className="goal-assistant-nav" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '0 16px 20px' }}>
          <button onClick={handleClose} className="secondary" style={{ minWidth: 80 }}>취소</button>
          <button onClick={handleCreate} className="primary" style={{ minWidth: 100, fontWeight: 600 }}>생성</button>
        </div>
      </div>
    </div>
  );
};

export default FolderCreateModal;