import { useState } from 'react';
import { createProject } from '../services/projectService';
import type { Project } from '../types';

export function useCreateProject(onSuccess: (project: Project) => void, onClose: () => void) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const newProject = await createProject({ title, description });
      resetForm();
      onSuccess(newProject);
      onClose();
    } catch {
      setError('Failed to create project. Please try again.');
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