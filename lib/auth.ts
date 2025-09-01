import { User } from './types';

// Simple in-memory storage for simulation - no real database needed
const users = new Map<string, User>();

export class AuthService {
  // Create a new user with 1 free credit
  static createUser(email: string, name?: string): User {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const user: User = {
      id: userId,
      email,
      name,
      credits: 1, // Solo 1 crédito gratuito para pruebas
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.set(userId, user);
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
    return true;
  }

  // Add credits to user (for simulation)
  static addCredits(userId: string, amount: number): boolean {
    const user = this.getUser(userId);
    if (!user) {
      return false;
    }

    user.credits += amount;
    user.updatedAt = new Date();
    users.set(userId, user);
    return true;
  }

  // Get user's current credit balance
  static getCreditBalance(userId: string): number {
    const user = this.getUser(userId);
    return user ? user.credits : 0;
  }
}
