import { useCallback, useMemo, useState } from 'react';

export type CollaboratorRole = 'editor' | 'viewer';

export interface Collaborator {
  email: string;
  role: CollaboratorRole;
  userId: string;
}

export const useFolderCollaborators = (initialCollaborators: Collaborator[] = []) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(initialCollaborators);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<CollaboratorRole>('editor');

  const trimmedEmail = inviteEmail.trim();

  const addCollaborator = useCallback(() => {
    if (!trimmedEmail) return;
    setCollaborators(prev => [
      ...prev,
      {
        email: trimmedEmail,
        role: inviteRole,
        userId: `invited_${Date.now()}`,
      },
    ]);
    setInviteEmail('');
    setInviteRole('editor');
  }, [inviteRole, trimmedEmail]);

  const removeCollaborator = useCallback((userId: string) => {
    setCollaborators(prev => prev.filter(c => c.userId !== userId));
  }, []);

  const canAddCollaborator = useMemo(() => trimmedEmail.length > 0, [trimmedEmail]);

  return {
    collaborators,
    inviteEmail,
    inviteRole,
    setInviteEmail,
    setInviteRole,
    addCollaborator,
    removeCollaborator,
    canAddCollaborator,
  };
};
