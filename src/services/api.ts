export const simulateGenerationDelay = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 3000); // 3 seconds total delay
  });
};
