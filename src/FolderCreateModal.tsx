import React, { useId, useState } from 'react';
import type { User } from 'firebase/auth';
import { useFolderCollaborators, Collaborator } from './hooks/useFolderCollaborators';
import './FolderCreateModal.css';

interface FolderCreateModalProps {
  onClose: () => void;
  onCreate: (payload: { name: string; isShared: boolean; collaborators: Collaborator[] }) => void;
  t?: (key: string) => string;
  defaultIsShared?: boolean;
  googleUser?: User | null;
}

const FolderCreateModal: React.FC<FolderCreateModalProps> = ({
  onClose,
  onCreate,
  t,
  defaultIsShared = false,
  googleUser: _googleUser,
}) => {
  void _googleUser;

  const [isClosing, setIsClosing] = useState(false);
  const [name, setName] = useState('');
  const [isShared, setIsShared] = useState(defaultIsShared);
  const [error, setError] = useState('');

  const {
    collaborators,
    inviteEmail,
    inviteRole,
    setInviteEmail,
    setInviteRole,
    addCollaborator,
    removeCollaborator,
    canAddCollaborator,
  } = useFolderCollaborators();

  const modalTitleId = useId();
  const nameInputId = useId();
  const sharedToggleId = useId();
  const inviteEmailId = useId();

  const closeWithAnimation = () => {
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
    closeWithAnimation();
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    handleCreate();
  };

  const headerTitle = t ? t('folder_create_title') : '새 폴더 만들기';

  return (
    <div
      className={`modal-backdrop${isClosing ? ' is-closing' : ''}`}
      onClick={closeWithAnimation}
      role="presentation"
    >
      <div
        className={`modal-content goal-assistant-modal folder-modal${isClosing ? ' is-closing' : ''}`}
        onClick={event => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
      >
        <div className="goal-assistant-header">
          <div className="goal-assistant-header-left" />
          <h2 id={modalTitleId}>{headerTitle}</h2>
          <div className="goal-assistant-header-right">
            <button onClick={closeWithAnimation} className="close-button" aria-label="Close folder modal">
              ✕
            </button>
          </div>
        </div>

        <form className="goal-assistant-body folder-modal__body" onSubmit={handleSubmit}>
          <div className="folder-modal__form-group">
            <label htmlFor={nameInputId} className="folder-modal__label">
              폴더 이름
            </label>
            <input
              id={nameInputId}
              type="text"
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder="폴더 이름을 입력하세요"
              className="folder-modal__input"
              autoFocus
            />
            {error && (
              <div className="folder-modal__error" role="alert">
                {error}
              </div>
            )}
          </div>

          <div className="folder-modal__form-group">
            <div className="folder-modal__toggle">
              <label htmlFor={sharedToggleId}>공유 폴더로 만들기</label>
              <label className="theme-toggle-switch">
                <input
                  id={sharedToggleId}
                  type="checkbox"
                  checked={isShared}
                  onChange={event => setIsShared(event.target.checked)}
                />
                <span className="slider round" />
              </label>
            </div>
          </div>

          {isShared && (
            <div className="folder-modal__form-group">
              <label htmlFor={inviteEmailId} className="folder-modal__label">
                협업자 추가 (선택)
              </label>
              <div className="folder-modal__collaborator-row">
                <input
                  id={inviteEmailId}
                  type="email"
                  value={inviteEmail}
                  onChange={event => setInviteEmail(event.target.value)}
                  placeholder="이메일 입력"
                  className="folder-modal__input"
                />
                <select
                  value={inviteRole}
                  onChange={event => setInviteRole(event.target.value as 'editor' | 'viewer')}
                  className="folder-modal__select"
                  aria-label="Collaborator role"
                >
                  <option value="editor">편집자</option>
                  <option value="viewer">뷰어</option>
                </select>
                <button
                  type="button"
                  onClick={addCollaborator}
                  className="primary folder-modal__add-button"
                  disabled={!canAddCollaborator}
                >
                  추가
                </button>
              </div>

              {collaborators.length > 0 && (
                <ul className="folder-modal__collaborator-list">
                  {collaborators.map(collaborator => (
                    <li key={collaborator.userId} className="folder-modal__collaborator-item">
                      <div>
                        <span className="folder-modal__collaborator-email">{collaborator.email}</span>
                        <span className="folder-modal__collaborator-role">
                          {collaborator.role === 'editor' ? '편집자' : '뷰어'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCollaborator(collaborator.userId)}
                        className="folder-modal__remove-button"
                        aria-label={`${collaborator.email} 삭제`}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </form>

        <div className="goal-assistant-nav folder-modal__footer">
          <button type="button" onClick={closeWithAnimation} className="secondary">
            취소
          </button>
          <button type="button" onClick={handleCreate} className="primary folder-modal__submit">
            생성
          </button>
        </div>
      </div>
    </div>
  );
};

export default FolderCreateModal;
