import { createContext, useContext, useState, } from 'react';
import type {ReactNode} from 'react';

interface UserContextType {
  credits: number;
  consumeCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState<number>(150);

  const consumeCredits = (amount: number) => {
    if (credits >= amount) {
      setCredits((prev) => prev - amount);
      return true;
    }
    return false;
  };

  const addCredits = (amount: number) => {
    setCredits((prev) => prev + amount);
  };

  return (
    <UserContext.Provider value={{ credits, consumeCredits, addCredits }}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUserStore() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserStore must be used within a UserProvider');
  }
  return context;
}
