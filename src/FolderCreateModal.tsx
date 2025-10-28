import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// FolderCreateModal: small alert-style modal rendered into document.body via portal
const FolderCreateModal = ({ onClose, onCreate, t, defaultIsShared = false, googleUser }: any) => {
  const [isClosing, setIsClosing] = useState(false);
  const [name, setName] = useState('');
  const [isShared, setIsShared] = useState(defaultIsShared);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // prevent body scroll while modal is open
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      try { onClose && onClose(); } catch (e) {}
    }, 320);
  };

  const handleCreate = () => {
    if (!name.trim()) {
      setError('폴더 이름을 입력하세요.');
      return;
    }
    try {
      onCreate && onCreate({ name: name.trim(), isShared, collaborators: isShared ? collaborators : [] });
    } catch (e) {}
    handleClose();
  };

  const handleAddCollaborator = () => {
    if (!inviteEmail.trim()) return;
    setCollaborators(prev => ([...prev, { email: inviteEmail.trim(), role: inviteRole, userId: `invited_${Date.now()}` }]));
    setInviteEmail('');
    setInviteRole('editor');
  };

  const handleRemoveCollaborator = (userId: string) => {
    setCollaborators(prev => prev.filter(c => c.userId !== userId));
  };

  // safe title fallback
  const titleCandidate = (t && typeof t === 'function') ? t('folder_create_title') : '';
  const title = titleCandidate && titleCandidate !== 'folder_create_title' ? titleCandidate : '새 폴더 만들기';

  const modalContent = (
    <div className={`alert-backdrop${isClosing ? ' is-closing' : ''}`} onClick={handleClose}>
      <div className={`alert-modal modal-content-small${isClosing ? ' is-closing' : ''}`} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 18px 12px' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>{title}</h3>
          <p style={{ margin: '8px 0 0', color: 'var(--text-secondary-color)', fontSize: '0.9rem' }}>폴더 이름을 입력하고 확인을 누르세요.</p>
        </div>

        <div style={{ padding: '12px 18px 8px' }}>
          <input
            type="text"
            value={name}
            onChange={e => setName((e.target as HTMLInputElement).value)}
            placeholder="폴더 이름"
            className="folder-create-input"
            autoFocus
            onKeyDown={e => { if ((e as React.KeyboardEvent).key === 'Enter') handleCreate(); }}
          />
          {error && <div style={{ color: 'var(--danger-color)', fontSize: '13px', marginTop: 8 }}>{error}</div>}
        </div>

        <div className="modal-buttons" style={{ display: 'flex', gap: 8, padding: '12px 18px 18px' }}>
          <button onClick={handleClose} className="secondary">취소</button>
          <button onClick={handleCreate} className="primary">확인</button>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined' && document.body) {
    return ReactDOM.createPortal(modalContent, document.body);
  }
  return modalContent;
};

export default FolderCreateModal;