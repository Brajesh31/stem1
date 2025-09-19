// Offline Storage Service for Project Spark
interface OfflineAction {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

interface StorageQuota {
  usage: number;
  quota: number;
  available: number;
}

class OfflineStorageService {
  private dbName = 'ProjectSparkOffline';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeDB();
  }

  private async initializeDB(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('offlineActions')) {
          const actionStore = db.createObjectStore('offlineActions', { keyPath: 'id' });
          actionStore.createIndex('type', 'type', { unique: false });
          actionStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('cachedData')) {
          const cacheStore = db.createObjectStore('cachedData', { keyPath: 'key' });
          cacheStore.createIndex('expiry', 'expiry', { unique: false });
        }

        if (!db.objectStoreNames.contains('userPreferences')) {
          db.createObjectStore('userPreferences', { keyPath: 'key' });
        }
      };
    });
  }

  // Queue offline actions for later synchronization
  async queueOfflineAction(action: Omit<OfflineAction, 'id' | 'retryCount'>): Promise<void> {
    await this.ensureInitialized();

    const offlineAction: OfflineAction = {
      ...action,
      id: this.generateId(),
      retryCount: 0
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineActions'], 'readwrite');
      const store = transaction.objectStore('offlineActions');
      const request = store.add(offlineAction);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to queue offline action'));
    });
  }

  // Get all queued offline actions
  async getOfflineQueue(): Promise<OfflineAction[]> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineActions'], 'readonly');
      const store = transaction.objectStore('offlineActions');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get offline queue'));
    });
  }

  // Remove action from queue after successful sync
  async removeOfflineAction(id: string): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineActions'], 'readwrite');
      const store = transaction.objectStore('offlineActions');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to remove offline action'));
    });
  }

  // Update retry count for failed actions
  async updateRetryCount(id: string): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineActions'], 'readwrite');
      const store = transaction.objectStore('offlineActions');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const action = getRequest.result;
        if (action) {
          action.retryCount++;
          const updateRequest = store.put(action);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(new Error('Failed to update retry count'));
        } else {
          reject(new Error('Action not found'));
        }
      };

      getRequest.onerror = () => reject(new Error('Failed to get action for retry update'));
    });
  }

  // Cache data with expiry
  async cacheData(key: string, data: any, expiryMinutes: number = 60): Promise<void> {
    await this.ensureInitialized();

    const cachedItem = {
      key,
      data,
      timestamp: Date.now(),
      expiry: Date.now() + (expiryMinutes * 60 * 1000)
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedData'], 'readwrite');
      const store = transaction.objectStore('cachedData');
      const request = store.put(cachedItem);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to cache data'));
    });
  }

  // Get cached data if not expired
  async getCachedData(key: string): Promise<any | null> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedData'], 'readonly');
      const store = transaction.objectStore('cachedData');
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        if (result && result.expiry > Date.now()) {
          resolve(result.data);
        } else {
          // Clean up expired data
          if (result) {
            this.removeCachedData(key);
          }
          resolve(null);
        }
      };

      request.onerror = () => reject(new Error('Failed to get cached data'));
    });
  }

  // Remove cached data
  async removeCachedData(key: string): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedData'], 'readwrite');
      const store = transaction.objectStore('cachedData');
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to remove cached data'));
    });
  }

  // Clean up expired cache entries
  async cleanupExpiredCache(): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedData'], 'readwrite');
      const store = transaction.objectStore('cachedData');
      const index = store.index('expiry');
      const range = IDBKeyRange.upperBound(Date.now());
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(new Error('Failed to cleanup expired cache'));
    });
  }

  // Store user preferences
  async storePreference(key: string, value: any): Promise<void> {
    await this.ensureInitialized();

    const preference = { key, value, timestamp: Date.now() };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userPreferences'], 'readwrite');
      const store = transaction.objectStore('userPreferences');
      const request = store.put(preference);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to store preference'));
    });
  }

  // Get user preference
  async getPreference(key: string): Promise<any | null> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userPreferences'], 'readonly');
      const store = transaction.objectStore('userPreferences');
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };

      request.onerror = () => reject(new Error('Failed to get preference'));
    });
  }

  // Get storage quota information
  async getStorageQuota(): Promise<StorageQuota> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        available: (estimate.quota || 0) - (estimate.usage || 0)
      };
    }

    // Fallback for browsers without storage API
    return {
      usage: 0,
      quota: 0,
      available: 0
    };
  }

  // Check if storage is available
  async isStorageAvailable(): Promise<boolean> {
    try {
      const quota = await this.getStorageQuota();
      return quota.available > 1024 * 1024; // At least 1MB available
    } catch (error) {
      return false;
    }
  }

  // Export data for backup
  async exportData(): Promise<{
    offlineActions: OfflineAction[];
    cachedData: any[];
    userPreferences: any[];
  }> {
    await this.ensureInitialized();

    const [offlineActions, cachedData, userPreferences] = await Promise.all([
      this.getOfflineQueue(),
      this.getAllCachedData(),
      this.getAllPreferences()
    ]);

    return {
      offlineActions,
      cachedData,
      userPreferences
    };
  }

  // Import data from backup
  async importData(data: {
    offlineActions?: OfflineAction[];
    cachedData?: any[];
    userPreferences?: any[];
  }): Promise<void> {
    await this.ensureInitialized();

    const transaction = this.db!.transaction(['offlineActions', 'cachedData', 'userPreferences'], 'readwrite');

    // Import offline actions
    if (data.offlineActions) {
      const actionStore = transaction.objectStore('offlineActions');
      for (const action of data.offlineActions) {
        actionStore.put(action);
      }
    }

    // Import cached data
    if (data.cachedData) {
      const cacheStore = transaction.objectStore('cachedData');
      for (const item of data.cachedData) {
        cacheStore.put(item);
      }
    }

    // Import preferences
    if (data.userPreferences) {
      const prefStore = transaction.objectStore('userPreferences');
      for (const pref of data.userPreferences) {
        prefStore.put(pref);
      }
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(new Error('Failed to import data'));
    });
  }

  // Clear all offline data
  async clearAllData(): Promise<void> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineActions', 'cachedData', 'userPreferences'], 'readwrite');
      
      const actionStore = transaction.objectStore('offlineActions');
      const cacheStore = transaction.objectStore('cachedData');
      const prefStore = transaction.objectStore('userPreferences');

      Promise.all([
        new Promise(res => {
          const req = actionStore.clear();
          req.onsuccess = () => res(undefined);
        }),
        new Promise(res => {
          const req = cacheStore.clear();
          req.onsuccess = () => res(undefined);
        }),
        new Promise(res => {
          const req = prefStore.clear();
          req.onsuccess = () => res(undefined);
        })
      ]).then(() => resolve()).catch(() => reject(new Error('Failed to clear data')));
    });
  }

  // Private helper methods
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeDB();
    }
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getAllCachedData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedData'], 'readonly');
      const store = transaction.objectStore('cachedData');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get all cached data'));
    });
  }

  private async getAllPreferences(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userPreferences'], 'readonly');
      const store = transaction.objectStore('userPreferences');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get all preferences'));
    });
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorageService();

// Utility functions for common offline operations
export const withOfflineSupport = async <T>(
  onlineOperation: () => Promise<T>,
  offlineOperation: () => Promise<T>,
  cacheKey?: string,
  cacheMinutes?: number
): Promise<T> => {
  try {
    // Try online operation first
    const result = await onlineOperation();
    
    // Cache the result if successful
    if (cacheKey) {
      await offlineStorage.cacheData(cacheKey, result, cacheMinutes);
    }
    
    return result;
  } catch (error) {
    // Fall back to offline operation
    if (cacheKey) {
      const cachedResult = await offlineStorage.getCachedData(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }
    }
    
    return await offlineOperation();
  }
};

export const queueForSync = async (
  type: string,
  data: any,
  maxRetries: number = 3
): Promise<void> => {
  await offlineStorage.queueOfflineAction({
    type,
    data,
    timestamp: Date.now(),
    maxRetries
  });
};