import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useAuthStore } from "@/features/auth/state/use-auth-store";

interface UserContextType {
  credits: number;
  consumeCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  refreshCredits: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const updateAvailableCredits = useAuthStore(
    (state) => state.updateAvailableCredits
  );
  const refreshCurrentUser = useAuthStore((state) => state.refreshCurrentUser);
  const credits = user?.available_credits ?? 0;

  const consumeCredits = (amount: number) => {
    if (credits >= amount) {
      updateAvailableCredits(credits - amount);
      return true;
    }
    return false;
  };

  const addCredits = (amount: number) => {
    updateAvailableCredits(credits + amount);
  };

  const refreshCredits = async () => {
    await refreshCurrentUser();
  };

  return (
    <UserContext.Provider
      value={{ credits, consumeCredits, addCredits, refreshCredits }}
    >
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUserStore() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserStore must be used within a UserProvider");
  }
  return context;
}
