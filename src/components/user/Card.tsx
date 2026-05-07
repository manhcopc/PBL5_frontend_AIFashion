import type { Project } from '../../types';
import { Calendar, Folder } from 'lucide-react';

interface CardProps {
  project: Project;
}

export const Card: React.FC<CardProps> = ({ project }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-300 group">
      <div className="h-48 overflow-hidden">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">{project.title}</h3>
        <p className="text-zinc-400 text-sm mt-2 line-clamp-2">{project.description}</p>
        
        <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{project.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Folder className="w-3.5 h-3.5" />
            <span>{project.requests} Requests</span>
          </div>
        </div>
      </div>
    </div>
  );
};