import { useState } from "react";

// import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/user/Card";
import { mockProjects } from "../../constants/projects";
import { useCredits } from "../../hooks/useCredits";
import { handleNewProject } from "../../utils/projectActions";
import { Plus } from "lucide-react";
import { CreateProjectModal } from "../../components/user/CreateProjectModal";
import type { Project } from "../../types";
import Header from "../../components/user/Header";

export default function Workspace() {
  const { credits, consumeCredits } = useCredits(150);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(mockProjects);

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

  const handleProjectSuccess = (newProject: Project) => {
    // Consume credits when project is successfully created
    const success = handleNewProject(consumeCredits);
    if (success) {
      setProjects([newProject, ...projects]);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      {/* <Sidebar /> */}

      <main className=" overflow-y-auto w-full relative">
        {/* Header */}
        <Header />
        {/* Content */}
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Workspace</h1>
              <p className="text-zinc-400 mt-1">
                Manage your fashion collections and generated styles.
              </p>
            </div>
            <button
              onClick={onNewProjectClick}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} project={project} />
            ))}
          </div>
        </div>
      </main>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProjectSuccess}
      />
    </div>
  );
}
