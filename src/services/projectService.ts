import type { Project } from '../types';

// Mock service to simulate an API call
export const createProject = async (data: { title: string; description: string }): Promise<Project> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProject: Project = {
        id: Math.random().toString(36).substring(7),
        title: data.title,
        description: data.description,
        date: new Date().toLocaleDateString('en-US', { hour12: false, month: 'short', day: 'numeric', year: 'numeric' }),
        requests: 0,
        // Mock a random image for the new project
        imageUrl: `https://images.unsplash.com/photo-1550614000-4b95d4edae1c?q=80&w=1000&auto=format&fit=crop&random=${Math.random()}`,
      };
      resolve(newProject);
    }, 800);
  });
};