import { useAdminStore } from "@/store/useAdminStore";
import { useConfigStore } from "@/store/useConfigStore";
import { useJobStore } from "@/store/useJobStore";
import { useServerCacheStore } from "@/store/useServerCacheStore";
import { removeToken } from "./auth";

export function clearClientSession() {
  removeToken();
  useJobStore.getState().clearJobStore();
  useServerCacheStore.getState().clearServerCache();
  useAdminStore.getState().resetAdminStore();
  useConfigStore.getState().resetConfigStore();
}
