export const handleNewProject = (consumeCredits: (amount: number) => boolean): boolean => {
  const creditsNeeded = 10;
  const success = consumeCredits(creditsNeeded);
  
  if (success) {
    console.log(`Successfully created new project. Consumed ${creditsNeeded} credits.`);
    return true;
  } else {
    console.error('Not enough credits to create a new project.');
    alert('Not enough credits to create a new project.');
    return false;
  }
};
