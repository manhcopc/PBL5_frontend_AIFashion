import { Bell, CheckCircle, Clock, Loader2, XCircle, Zap } from "lucide-react";
import { useUserStore } from "@/store/UserContext";
import { useJobStore } from "@/store/useJobStore";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// import type { Project } from "../../types";
// // import { handleNewProject } from "../../utils/projectActions";
// import { useState } from "react";
// import { mockProjects } from "../../constants/projects";

export default function Header() {
  const navigate = useNavigate();
  const { credits } = useUserStore();
  const jobs = useJobStore((state) => state.jobs);
  const notifications = useJobStore((state) => state.notifications);
  const markNotificationsRead = useJobStore(
    (state) => state.markNotificationsRead
  );
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const runningJobs = useMemo(
    () =>
      jobs.filter(
        (job) => job.status === "queued" || job.status === "processing"
      ),
    [jobs]
  );
  const unreadNotifications = useMemo(
    () => notifications.reduce((count, item) => count + (item.read ? 0 : 1), 0),
    [notifications]
  );
  const recentNotifications = notifications.slice(0, 8);

  const handleOpenNotifications = () => {
    setIsNotificationsOpen((open) => !open);
    markNotificationsRead();
  };

  const handleViewJob = (jobId: string) => {
    const job = jobs.find((item) => item.jobId === jobId);
    if (!job) return;

    setIsNotificationsOpen(false);

    if (job.type === "trend_analysis" && job.status === "completed") {
      navigate("/create-design", {
        state: {
          requestId: job.requestId,
          projectId: job.projectId,
          generatedImages: job.resultImages || [],
          promptText: job.title,
        },
      });
      return;
    }

    if (job.type === "image_generation" && job.status === "completed") {
      navigate("/create-design", {
        state: {
          requestId: job.requestId,
          projectId: job.projectId,
          generatedResultImages: job.resultImages || [],
          openGeneratedResults: true,
        },
      });
      return;
    }

    if (job.projectId) {
      navigate(`/workspace/${job.projectId}`);
      return;
    }

    navigate("/design-studio");
  };
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
              {/* <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600/10" /> */}
              <span className="font-bold text-indigo-700">
                ⚡ {credits} Credits
              </span>
            </div>

            {/* Notification & Avatar */}
            <div className="relative">
              <button
                onClick={handleOpenNotifications}
                className="relative p-2 hover:bg-zinc-100 rounded-xl transition-colors"
              >
                <Bell className="w-6 h-6 text-zinc-500" />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 top-12 z-[130] w-[360px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
                  <div className="border-b border-zinc-100 px-4 py-3">
                    <p className="text-sm font-extrabold text-zinc-900">
                      Notifications
                    </p>
                    <p className="text-xs font-medium text-zinc-500">
                      {runningJobs.length > 0
                        ? `${runningJobs.length} task${
                            runningJobs.length > 1 ? "s" : ""
                          } running`
                        : "No running tasks"}
                    </p>
                  </div>

                  <div className="max-h-[420px] overflow-y-auto">
                    {runningJobs.length > 0 && (
                      <div className="border-b border-zinc-100 p-3">
                        <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                          Running tasks
                        </p>
                        <div className="space-y-2">
                          {runningJobs.map((job) => (
                            <button
                              key={job.jobId}
                              onClick={() => handleViewJob(job.jobId)}
                              className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-zinc-50"
                            >
                              <Loader2 className="mt-0.5 h-4 w-4 animate-spin text-cyan-600" />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-zinc-900">
                                  {job.title}
                                </p>
                                <p className="text-xs font-medium capitalize text-zinc-500">
                                  {job.status.replace("_", " ")}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {recentNotifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
                        <p className="text-sm font-bold text-zinc-700">
                          No notifications
                        </p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {recentNotifications.map((notification) => {
                          const isSuccess = notification.status === "completed";
                          const isTimeout = notification.status === "timeout";
                          const Icon = isSuccess
                            ? CheckCircle
                            : isTimeout
                            ? Clock
                            : XCircle;
                          const iconClass = isSuccess
                            ? "text-emerald-600"
                            : isTimeout
                            ? "text-amber-600"
                            : "text-rose-600";

                          return (
                            <button
                              key={notification.id}
                              onClick={() => handleViewJob(notification.jobId)}
                              className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-zinc-50"
                            >
                              <Icon className={`mt-0.5 h-4 w-4 ${iconClass}`} />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-zinc-900">
                                  {notification.title}
                                </p>
                                <p className="line-clamp-2 text-xs font-medium text-zinc-500">
                                  {notification.message}
                                </p>
                                <p className="mt-1 text-[10px] font-semibold text-zinc-400">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString("vi-VN")}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold cursor-pointer shadow-md shadow-indigo-100">
              U
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
