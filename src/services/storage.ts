/**
 * Local Storage Service
 * Simple browser-based storage for admin data
 * Optimized for Vercel deployment
 */

import type { Hotspot, SpeciesDetail } from '../data/mati-hotspots'

interface AdminUser {
  username: string;
  lastLoginAt: string;
  loginCount: number;
  createdAt: string;
}

class LocalStorageService {
  constructor() {
    // Simple localStorage-based storage
  }

  /**
   * Log admin login activity
   */
  async logAdminLogin(username: string = 'admin'): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      // First, try to find existing user
      const existingUser = await this.findAdminUser(username);
      
      if (existingUser) {
        // Update existing user
        await this.updateAdminUser(username, {
          lastLoginAt: now,
          loginCount: (existingUser.loginCount || 0) + 1,
        });
      } else {
        // Create new user record
        await this.createAdminUser({
          username,
          lastLoginAt: now,
          loginCount: 1,
          createdAt: now,
        });
      }
      
      console.log('[MongoDB] Admin login logged:', username);
    } catch (error) {
      console.error('[MongoDB] Failed to log admin login:', error);
      // Don't throw - login should still work even if logging fails
    }
  }

  /**
   * Find admin user by username
   */
  private async findAdminUser(username: string): Promise<AdminUser | null> {
    // This is a placeholder - we'll implement actual MongoDB query
    const stored = localStorage.getItem(`admin-user-${username}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  }

  /**
   * Create admin user record
   */
  private async createAdminUser(user: Omit<AdminUser, '_id'>): Promise<void> {
    // Placeholder implementation using localStorage
    // TODO: Replace with actual MongoDB insert
    localStorage.setItem(`admin-user-${user.username}`, JSON.stringify(user));
  }

  /**
   * Update admin user record
   */
  private async updateAdminUser(username: string, updates: Partial<AdminUser>): Promise<void> {
    const existing = await this.findAdminUser(username);
    if (existing) {
      const updated = { ...existing, ...updates };
      localStorage.setItem(`admin-user-${username}`, JSON.stringify(updated));
    }
  }

  /**
   * Save hotspot to localStorage
   */
  async saveHotspot(hotspot: Hotspot): Promise<void> {
    try {
      const key = `hotspot-${hotspot.id}`;
      localStorage.setItem(key, JSON.stringify(hotspot));
      console.log('[Storage] Hotspot saved:', hotspot.id);
    } catch (error) {
      console.error('[Storage] Failed to save hotspot:', error);
      throw error;
    }
  }

  /**
   * Save species to localStorage
   */
  async saveSpecies(species: SpeciesDetail): Promise<void> {
    try {
      const key = `species-${species.id}`;
      localStorage.setItem(key, JSON.stringify(species));
      console.log('[Storage] Species saved:', species.id);
    } catch (error) {
      console.error('[Storage] Failed to save species:', error);
      throw error;
    }
  }

  /**
   * Delete hotspot from localStorage
   */
  async deleteHotspot(id: string): Promise<void> {
    try {
      localStorage.removeItem(`hotspot-${id}`);
      console.log('[Storage] Hotspot deleted:', id);
    } catch (error) {
      console.error('[Storage] Failed to delete hotspot:', error);
      throw error;
    }
  }

  /**
   * Delete species from localStorage
   */
  async deleteSpecies(id: string): Promise<void> {
    try {
      localStorage.removeItem(`species-${id}`);
      console.log('[Storage] Species deleted:', id);
    } catch (error) {
      console.error('[Storage] Failed to delete species:', error);
      throw error;
    }
  }

  /**
   * Get all hotspots from localStorage
   */
  async getHotspots(): Promise<Hotspot[]> {
    try {
      const hotspots: Hotspot[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('hotspot-')) {
          const data = localStorage.getItem(key);
          if (data) {
            hotspots.push(JSON.parse(data));
          }
        }
      }
      return hotspots;
    } catch (error) {
      console.error('[Storage] Failed to get hotspots:', error);
      return [];
    }
  }

  /**
   * Get all species from localStorage
   */
  async getSpecies(): Promise<SpeciesDetail[]> {
    try {
      const species: SpeciesDetail[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('species-')) {
          const data = localStorage.getItem(key);
          if (data) {
            species.push(JSON.parse(data));
          }
        }
      }
      return species;
    } catch (error) {
      console.error('[Storage] Failed to get species:', error);
      return [];
    }
  }

  /**
   * Get storage info (for debugging)
   */
  getStorageInfo() {
    return {
      type: 'localStorage',
      available: typeof localStorage !== 'undefined',
    };
  }
}

// Export singleton instance
export const storageService = new LocalStorageService();

// For backwards compatibility
export const mongoService = storageService;

// Export types
export type { AdminUser };
