import { useState } from 'react';

export function useCredits(initialCredits: number = 150) {
  const [credits, setCredits] = useState<number>(initialCredits);

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

  return { credits, consumeCredits, addCredits };
}