import { useState } from "react";

// import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/user/Card";
import { useUserStore } from "@/store/UserContext";
import { Plus } from "lucide-react";
import { CreateProjectModal } from "../../components/user/CreateProjectModal";
// import type { Project } from "../../types";
import Header from "../../components/user/Header";
import useProjects from "@/hooks/useProjects";
import { useNavigate } from "react-router-dom";

export default function Workspace() {
  const navigate = useNavigate();
  const { credits } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [projects, setProjects] = useState<Project[]>(mockProjects);
  const { projects, fetchProjects } = useProjects();

  const onNewProjectClick = () => {
    // Check if the user has enough credits before opening the modal
    if (credits >= 10) {
      setIsModalOpen(true);
    } else {
      alert(
        "Not enough credits to create a new project. You need at least 10 credits."
      );
    }
  };

  // const handleProjectSuccess = (newProject: Project) => {
  //   // Consume credits when project is successfully created
  //   const success = handleNewProject(consumeCredits);
  //   if (success) {
  //     setProjects([newProject, ...projects]);
  //   }
  // };

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900 font-sans overflow-hidden">
      {/* <Sidebar /> */}

      <main className="overflow-y-auto w-full relative">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Workspace
              </h1>
              <p className="text-zinc-500 mt-1">
                Manage your fashion collections and generated styles.
              </p>
            </div>

            <button
              onClick={onNewProjectClick}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md shadow-indigo-100 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>

          {/* Grid Projects */}
          {/* Lưu ý: Đảm bảo component Card của bạn cũng sử dụng nền trắng (bg-white) và shadow nhẹ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                project={project}
                onTap={() => {
                  //open project detail page
                  navigate(`/workspace/${project.id}`);
                }}
              />
            ))}
          </div>
        </div>
      </main>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProjects}
        // onSuccess={fetchProjectDetails}
        // onSuccess={handleProjectSuccess}
      />
    </div>
  );
}
