import { User, CreditTransaction } from './types';

// Simple in-memory storage for demo purposes
// In production, this would be replaced with a real database
const users = new Map<string, User>();
const creditTransactions = new Map<string, CreditTransaction[]>();

export class AuthService {
  // Create a new user with free trial credits
  static createUser(email: string, name?: string): User {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const user: User = {
      id: userId,
      email,
      name,
      credits: 1, // Solo 1 crédito gratuito
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.set(userId, user);
    creditTransactions.set(userId, []);

    // Add initial credit transaction
    this.addCreditTransaction(userId, 'bonus', 1, 1, 'Free trial credit');

    return user;
  }

  // Get user by ID
  static getUser(userId: string): User | null {
    return users.get(userId) || null;
  }

  // Get user by email
  static getUserByEmail(email: string): User | null {
    for (const user of users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  // Check if user has enough credits
  static hasCredits(userId: string, requiredCredits: number = 1): boolean {
    const user = this.getUser(userId);
    return user ? user.credits >= requiredCredits : false;
  }

  // Deduct credits from user
  static deductCredits(userId: string, amount: number = 1): boolean {
    const user = this.getUser(userId);
    if (!user || user.credits < amount) {
      return false;
    }

    user.credits -= amount;
    user.updatedAt = new Date();
    users.set(userId, user);

    // Add usage transaction
    this.addCreditTransaction(userId, 'usage', -amount, user.credits, 'Image colorization');

    return true;
  }

  // Add credits to user (for purchases)
  static addCredits(userId: string, amount: number, source: string = 'purchase'): boolean {
    const user = this.getUser(userId);
    if (!user) {
      return false;
    }

    user.credits += amount;
    user.updatedAt = new Date();
    users.set(userId, user);

    // Add purchase transaction
    this.addCreditTransaction(userId, 'purchase', amount, user.credits, source);

    return true;
  }

  // Get user's credit transactions
  static getCreditTransactions(userId: string): CreditTransaction[] {
    return creditTransactions.get(userId) || [];
  }

  // Add credit transaction
  private static addCreditTransaction(
    userId: string, 
    type: CreditTransaction['type'], 
    amount: number, 
    balance: number, 
    description: string
  ): void {
    const transaction: CreditTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type,
      amount,
      balance,
      description,
      createdAt: new Date(),
    };

    const userTransactions = creditTransactions.get(userId) || [];
    userTransactions.push(transaction);
    creditTransactions.set(userId, userTransactions);
  }

  // Get user's current credit balance
  static getCreditBalance(userId: string): number {
    const user = this.getUser(userId);
    return user ? user.credits : 0;
  }

  // Check if user is new (has only free trial credits)
  static isNewUser(userId: string): boolean {
    const transactions = this.getCreditTransactions(userId);
    const purchaseTransactions = transactions.filter(tx => tx.type === 'purchase');
    return purchaseTransactions.length === 0;
  }
}
