// In-memory storage for demo purposes
// In production, you should use a database
const userCredits = new Map<string, { credits: number; plan: string; email?: string }>();

// Helper function to get user credits (for internal use)
export function getUserCredits(userId: string) {
  return userCredits.get(userId);
}

// Helper function to add credits (for webhook use)
export function addUserCredits(userId: string, credits: number, plan: string, email?: string) {
  const currentCredits = userCredits.get(userId);
  const newCredits = (currentCredits?.credits || 0) + credits;
  
  userCredits.set(userId, { 
    credits: newCredits, 
    plan, 
    email: email || currentCredits?.email 
  });
  
  console.log(`🎉 Added ${credits} credits to user ${userId} (${plan} plan). Total: ${newCredits}`);
  return newCredits;
}

// Get the credits map for use in route handlers
export function getCreditsMap() {
  return userCredits;
}

