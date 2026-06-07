import { Bell, Zap } from "lucide-react";
import { useUserStore } from "@/store/UserContext";
// import type { Project } from "../../types";
// // import { handleNewProject } from "../../utils/projectActions";
// import { useState } from "react";
// import { mockProjects } from "../../constants/projects";

export default function Header() {
  const { credits } = useUserStore();
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
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900">Business</h1>

          <div className="flex items-center gap-6">
            {/* Credits Badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full shadow-sm">
              <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600/10" />
              <span className="font-bold text-indigo-700">
                ⚡ {credits} Credits
              </span>
            </div>

            {/* Notification & Avatar */}
            <button className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
              <Bell className="w-6 h-6 text-zinc-500" />
            </button>

            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold cursor-pointer shadow-md shadow-indigo-100">
              U
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
