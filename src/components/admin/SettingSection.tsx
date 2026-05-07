import { ReactNode } from 'react';

interface SettingSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
}

export const SettingSection = ({ title, description, children, icon }: SettingSectionProps) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        {icon && <div className="mt-1 text-purple-400">{icon}</div>}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">{children}</div>
    </div>
  );
};
