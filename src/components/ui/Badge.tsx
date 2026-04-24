
interface BadgeProps {
  icon?: React.ReactNode;
  text: string;
}

export const Badge: React.FC<BadgeProps> = ({ icon, text }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
      {icon && <span>{icon}</span>}
      {text}
    </div>
  );
};