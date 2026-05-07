import { Bell, User, Zap } from "lucide-react";
import { Badge } from "../../components/user/Badge";
import { useCredits } from "../../hooks/useCredits";
// import type { Project } from "../../types";
// // import { handleNewProject } from "../../utils/projectActions";
// import { useState } from "react";
// import { mockProjects } from "../../constants/projects";

export default function Header() {
  const { credits, consumeCredits } = useCredits(150);
  //   const [projects, setProjects] = useState<Project[]>(mockProjects);
  //   const handleProjectSuccess = (newProject: Project) => {
  //     // Consume credits when project is successfully created
  //     const success = handleNewProject(consumeCredits);
  //     if (success) {
  //       setProjects([newProject, ...projects]);
  //     }
  //   };
  return (
    <>
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/70 border-b border-zinc-900 px-8 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dashboard</h2>

        <div className="flex items-center gap-6">
          <Badge
            icon={<Zap className="w-4 h-4 fill-purple-400" />}
            text={`${credits} Credits`}
          />

          <div className="flex items-center gap-4 border-l border-zinc-800 pl-6">
            <button className="text-zinc-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
              <User className="w-5 h-5 text-zinc-400" />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
