import { useState } from 'react';
import projectApi from '@/features/project/api';
import { transformProjectResponseToUI } from '@/features/project/mappers/projectMapper';
import { useAuthStore } from '@/features/auth/state/use-auth-store';
import type { Project } from '../types';

export function useCreateProject(onSuccess: (project: Project) => void, onClose: () => void) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userId = useAuthStore((state) => state.userId);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Project Name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!userId) {
        throw new Error('User ID is required to create a project.');
      }

      const rawProject = await projectApi.createProject(
        {
          project_name: title.trim(),
          description: description.trim(),
        },
        userId
      );
      const newProject = await transformProjectResponseToUI(rawProject);
      resetForm();
      onSuccess(newProject);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    isSubmitting,
    error,
    handleSubmit,
    handleClose
  };
}
