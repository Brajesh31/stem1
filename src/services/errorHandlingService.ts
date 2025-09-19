// Comprehensive Error Handling Service for Project Spark
import { offlineStorage } from './offlineStorage';

export interface ErrorContext {
  userId?: string;
  userAgent: string;
  url: string;
  timestamp: Date;
  sessionId: string;
  additionalData?: Record<string, any>;
}

export interface ErrorLog {
  id: string;
  type: 'network' | 'api' | 'validation' | 'runtime' | 'auth' | 'permission';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stack?: string;
  context: ErrorContext;
  resolved: boolean;
  userNotified: boolean;
  retryCount: number;
  maxRetries: number;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryCondition?: (error: Error) => boolean;
}

class ErrorHandlingService {
  private errorLogs: ErrorLog[] = [];
  private errorQueue: ErrorLog[] = [];
  private isOnline = navigator.onLine;
  private sessionId = this.generateSessionId();
  private retryConfigs: Map<string, RetryConfig> = new Map();

  constructor() {
    this.initializeErrorHandling();
    this.setupNetworkListeners();
    this.setupGlobalErrorHandlers();
  }

  private initializeErrorHandling(): void {
    // Set default retry configurations
    this.retryConfigs.set('network', {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
      retryCondition: (error) => error.name === 'NetworkError' || error.message.includes('fetch')
    });

    this.retryConfigs.set('api', {
      maxRetries: 2,
      baseDelay: 500,
      maxDelay: 5000,
      backoffMultiplier: 1.5,
      retryCondition: (error) => error.message.includes('500') || error.message.includes('502')
    });

    // Load persisted error logs
    this.loadPersistedErrors();
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processOfflineErrors();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private setupGlobalErrorHandlers(): void {
    // Catch unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error, {
        type: 'runtime',
        severity: 'high',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        type: 'runtime',
        severity: 'high',
        context: {
          promise: 'unhandled_rejection'
        }
      });
    });
  }

  // Main error handling method
  async handleError(
    error: Error | string,
    options: {
      type: ErrorLog['type'];
      severity: ErrorLog['severity'];
      context?: Record<string, any>;
      showToUser?: boolean;
      retry?: boolean;
      retryConfig?: Partial<RetryConfig>;
    }
  ): Promise<void> {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'object' ? error.stack : undefined;

    const errorLog: ErrorLog = {
      id: this.generateErrorId(),
      type: options.type,
      severity: options.severity,
      message: errorMessage,
      stack: errorStack,
      context: this.buildErrorContext(options.context),
      resolved: false,
      userNotified: false,
      retryCount: 0,
      maxRetries: options.retryConfig?.maxRetries || this.retryConfigs.get(options.type)?.maxRetries || 0
    };

    // Log error
    this.logError(errorLog);

    // Show user-friendly message if requested
    if (options.showToUser !== false) {
      this.showUserFriendlyError(errorLog);
    }

    // Attempt retry if configured
    if (options.retry && errorLog.maxRetries > 0) {
      await this.attemptRetry(errorLog, options.retryConfig);
    }

    // Send to analytics if online
    if (this.isOnline) {
      this.sendErrorToAnalytics(errorLog);
    } else {
      this.queueErrorForLater(errorLog);
    }
  }

  // Network error handling with retry logic
  async handleNetworkError(
    operation: () => Promise<any>,
    options: {
      retryConfig?: Partial<RetryConfig>;
      fallbackData?: any;
      showOfflineMessage?: boolean;
    } = {}
  ): Promise<any> {
    const config = { ...this.retryConfigs.get('network'), ...options.retryConfig };
    let lastError: Error;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Log the attempt
        await this.handleError(error as Error, {
          type: 'network',
          severity: attempt === config.maxRetries ? 'high' : 'medium',
          context: { attempt: attempt + 1, maxRetries: config.maxRetries },
          showToUser: false
        });

        // Don't retry on final attempt
        if (attempt === config.maxRetries) break;

        // Calculate delay with exponential backoff
        const delay = Math.min(
          config.baseDelay * Math.pow(config.backoffMultiplier, attempt),
          config.maxDelay
        );

        await this.delay(delay);
      }
    }

    // All retries failed
    if (options.fallbackData !== undefined) {
      this.showUserMessage('Using cached data due to connection issues', 'warning');
      return options.fallbackData;
    }

    if (options.showOfflineMessage !== false) {
      this.showOfflineMessage();
    }

    throw lastError!;
  }

  // API error handling with specific error codes
  async handleApiError(
    response: Response,
    context?: Record<string, any>
  ): Promise<never> {
    let errorMessage = 'An unexpected error occurred';
    let severity: ErrorLog['severity'] = 'medium';

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Response doesn't contain JSON
    }

    // Determine severity based on status code
    if (response.status >= 500) {
      severity = 'high';
      errorMessage = 'Server error. Our team has been notified.';
    } else if (response.status === 404) {
      severity = 'medium';
      errorMessage = 'The requested resource was not found.';
    } else if (response.status === 403) {
      severity = 'medium';
      errorMessage = 'You don\'t have permission to access this resource.';
    } else if (response.status === 401) {
      severity = 'high';
      errorMessage = 'Your session has expired. Please log in again.';
      this.handleAuthError();
    } else if (response.status >= 400) {
      severity = 'low';
      // Use the actual error message for client errors
    }

    await this.handleError(new Error(errorMessage), {
      type: 'api',
      severity,
      context: {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        ...context
      },
      retry: response.status >= 500, // Only retry server errors
    });

    throw new Error(errorMessage);
  }

  // Validation error handling
  handleValidationError(
    field: string,
    value: any,
    rules: ValidationRule[]
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const rule of rules) {
      if (!this.validateField(value, rule)) {
        errors.push({
          field,
          message: rule.message,
          code: rule.code,
          value
        });
      }
    }

    if (errors.length > 0) {
      this.handleError(`Validation failed for field: ${field}`, {
        type: 'validation',
        severity: 'low',
        context: { field, errors },
        showToUser: false // Validation errors are shown inline
      });
    }

    return errors;
  }

  // Graceful degradation for feature failures
  async withGracefulDegradation<T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T> | T,
    featureName: string
  ): Promise<T> {
    try {
      return await primaryOperation();
    } catch (error) {
      await this.handleError(error as Error, {
        type: 'runtime',
        severity: 'medium',
        context: { feature: featureName, degraded: true },
        showToUser: false
      });

      this.showUserMessage(
        `${featureName} is temporarily unavailable. Using simplified version.`,
        'info'
      );

      return await fallbackOperation();
    }
  }

  // Offline support methods
  async handleOfflineOperation<T>(
    operation: () => Promise<T>,
    offlineHandler: () => Promise<T> | T,
    operationName: string
  ): Promise<T> {
    if (!this.isOnline) {
      this.showUserMessage('Working offline. Changes will sync when connected.', 'info');
      return await offlineHandler();
    }

    try {
      return await operation();
    } catch (error) {
      // If online operation fails, try offline
      this.showUserMessage('Connection issue. Switching to offline mode.', 'warning');
      return await offlineHandler();
    }
  }

  // User-friendly error messages
  private showUserFriendlyError(errorLog: ErrorLog): void {
    const userMessage = this.getUserFriendlyMessage(errorLog);
    
    this.showUserMessage(userMessage.message, userMessage.type, {
      actions: userMessage.actions,
      persistent: errorLog.severity === 'critical'
    });

    errorLog.userNotified = true;
  }

  private getUserFriendlyMessage(errorLog: ErrorLog): {
    message: string;
    type: 'error' | 'warning' | 'info';
    actions?: Array<{ label: string; action: () => void }>;
  } {
    switch (errorLog.type) {
      case 'network':
        return {
          message: 'Connection issue detected. Please check your internet connection.',
          type: 'warning',
          actions: [
            { label: 'Retry', action: () => window.location.reload() },
            { label: 'Work Offline', action: () => this.enableOfflineMode() }
          ]
        };

      case 'api':
        if (errorLog.message.includes('session')) {
          return {
            message: 'Your session has expired. Please log in again.',
            type: 'error',
            actions: [
              { label: 'Log In', action: () => this.redirectToLogin() }
            ]
          };
        }
        return {
          message: 'Service temporarily unavailable. Please try again in a moment.',
          type: 'warning',
          actions: [
            { label: 'Retry', action: () => window.location.reload() }
          ]
        };

      case 'validation':
        return {
          message: 'Please check your input and try again.',
          type: 'error'
        };

      case 'permission':
        return {
          message: 'Permission required. Please enable the requested permission to continue.',
          type: 'warning',
          actions: [
            { label: 'Grant Permission', action: () => this.requestPermissions() }
          ]
        };

      default:
        return {
          message: 'Something went wrong. Our team has been notified.',
          type: 'error',
          actions: [
            { label: 'Refresh Page', action: () => window.location.reload() }
          ]
        };
    }
  }

  // Retry mechanism with exponential backoff
  private async attemptRetry(
    errorLog: ErrorLog,
    retryConfig?: Partial<RetryConfig>
  ): Promise<void> {
    const config = { ...this.retryConfigs.get(errorLog.type), ...retryConfig };
    
    if (errorLog.retryCount >= errorLog.maxRetries) {
      return;
    }

    const delay = Math.min(
      config.baseDelay * Math.pow(config.backoffMultiplier, errorLog.retryCount),
      config.maxDelay
    );

    await this.delay(delay);
    errorLog.retryCount++;

    // This would trigger the original operation retry
    // Implementation depends on how the original operation is structured
  }

  // Error logging and persistence
  private logError(errorLog: ErrorLog): void {
    this.errorLogs.push(errorLog);
    
    // Persist to local storage for offline scenarios
    this.persistError(errorLog);
    
    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 ${errorLog.type.toUpperCase()} ERROR - ${errorLog.severity.toUpperCase()}`);
      console.error('Message:', errorLog.message);
      console.error('Context:', errorLog.context);
      if (errorLog.stack) console.error('Stack:', errorLog.stack);
      console.groupEnd();
    }
  }

  private async persistError(errorLog: ErrorLog): Promise<void> {
    try {
      await offlineStorage.queueOfflineAction({
        type: 'error_log',
        data: errorLog,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Failed to persist error log:', error);
    }
  }

  // Offline error processing
  private async processOfflineErrors(): Promise<void> {
    if (!this.isOnline || this.errorQueue.length === 0) return;

    const errorsToProcess = [...this.errorQueue];
    this.errorQueue = [];

    for (const errorLog of errorsToProcess) {
      try {
        await this.sendErrorToAnalytics(errorLog);
      } catch (error) {
        // Re-queue if sending fails
        this.errorQueue.push(errorLog);
      }
    }
  }

  // Send errors to analytics service
  private async sendErrorToAnalytics(errorLog: ErrorLog): Promise<void> {
    try {
      await fetch('/api/v1/analytics/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          ...errorLog,
          // Remove sensitive data
          context: {
            ...errorLog.context,
            userId: errorLog.context.userId ? 'redacted' : undefined
          }
        })
      });
    } catch (error) {
      // Queue for later if analytics service is down
      this.queueErrorForLater(errorLog);
    }
  }

  private queueErrorForLater(errorLog: ErrorLog): void {
    this.errorQueue.push(errorLog);
  }

  // Specific error handlers
  handleAuthError(): void {
    localStorage.removeItem('authToken');
    this.showUserMessage(
      'Your session has expired. Redirecting to login...',
      'warning'
    );
    
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  }

  handlePermissionError(permission: string): void {
    this.showUserMessage(
      `${permission} permission is required for this feature.`,
      'warning',
      {
        actions: [
          {
            label: 'Grant Permission',
            action: () => this.requestPermissions()
          },
          {
            label: 'Continue Without',
            action: () => this.enableLimitedMode()
          }
        ]
      }
    );
  }

  handleQuotaExceededError(): void {
    this.showUserMessage(
      'Storage space is full. Some features may not work properly.',
      'error',
      {
        actions: [
          {
            label: 'Clear Cache',
            action: () => this.clearCache()
          },
          {
            label: 'Manage Storage',
            action: () => this.openStorageManager()
          }
        ]
      }
    );
  }

  // Validation helpers
  private validateField(value: any, rule: ValidationRule): boolean {
    switch (rule.type) {
      case 'required':
        return value !== null && value !== undefined && value !== '';
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      
      case 'minLength':
        return typeof value === 'string' && value.length >= rule.value;
      
      case 'maxLength':
        return typeof value === 'string' && value.length <= rule.value;
      
      case 'pattern':
        return new RegExp(rule.value).test(value);
      
      case 'custom':
        return rule.validator ? rule.validator(value) : true;
      
      default:
        return true;
    }
  }

  // User notification methods
  private showUserMessage(
    message: string,
    type: 'error' | 'warning' | 'info' | 'success',
    options: {
      actions?: Array<{ label: string; action: () => void }>;
      persistent?: boolean;
      duration?: number;
    } = {}
  ): void {
    // Create notification event
    const notification = {
      id: Date.now().toString(),
      type,
      title: this.getNotificationTitle(type),
      message,
      actions: options.actions,
      persistent: options.persistent,
      duration: options.duration || (type === 'error' ? 8000 : 5000)
    };

    // Dispatch custom event for notification system
    window.dispatchEvent(new CustomEvent('app-notification', {
      detail: notification
    }));
  }

  private getNotificationTitle(type: string): string {
    switch (type) {
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Information';
      case 'success': return 'Success';
      default: return 'Notification';
    }
  }

  private showOfflineMessage(): void {
    this.showUserMessage(
      'You\'re currently offline. Some features may be limited.',
      'info',
      {
        actions: [
          {
            label: 'View Offline Content',
            action: () => this.navigateToOfflineMode()
          }
        ],
        persistent: true
      }
    );
  }

  // Recovery and fallback methods
  private enableOfflineMode(): void {
    // Switch to offline-first mode
    document.body.classList.add('offline-mode');
    this.showUserMessage('Offline mode enabled. Your progress will sync when connected.', 'info');
  }

  private enableLimitedMode(): void {
    // Enable limited functionality mode
    document.body.classList.add('limited-mode');
    this.showUserMessage('Limited mode enabled. Some features are disabled.', 'info');
  }

  private async clearCache(): Promise<void> {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      localStorage.clear();
      sessionStorage.clear();
      
      this.showUserMessage('Cache cleared successfully.', 'success');
    } catch (error) {
      this.showUserMessage('Failed to clear cache.', 'error');
    }
  }

  private redirectToLogin(): void {
    window.location.href = '/login';
  }

  private requestPermissions(): void {
    // This would trigger permission requests
    console.log('Requesting permissions...');
  }

  private navigateToOfflineMode(): void {
    // Navigate to offline content
    window.location.hash = '#/offline';
  }

  private openStorageManager(): void {
    // Open storage management interface
    window.location.hash = '#/settings/storage';
  }

  // Utility methods
  private generateSessionId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }

  private buildErrorContext(additionalContext?: Record<string, any>): ErrorContext {
    return {
      userId: localStorage.getItem('userId') || undefined,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date(),
      sessionId: this.sessionId,
      additionalData: additionalContext
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async loadPersistedErrors(): Promise<void> {
    try {
      const offlineActions = await offlineStorage.getOfflineQueue();
      const errorLogs = offlineActions
        .filter(action => action.type === 'error_log')
        .map(action => action.data);
      
      this.errorQueue.push(...errorLogs);
    } catch (error) {
      console.error('Failed to load persisted errors:', error);
    }
  }

  // Public API methods
  public getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    resolved: number;
  } {
    const stats = {
      total: this.errorLogs.length,
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      resolved: this.errorLogs.filter(log => log.resolved).length
    };

    this.errorLogs.forEach(log => {
      stats.byType[log.type] = (stats.byType[log.type] || 0) + 1;
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;
    });

    return stats;
  }

  public clearErrorLogs(): void {
    this.errorLogs = [];
    this.errorQueue = [];
  }

  public setRetryConfig(errorType: string, config: RetryConfig): void {
    this.retryConfigs.set(errorType, config);
  }
}

// Validation interfaces
interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  code: string;
  validator?: (value: any) => boolean;
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
  value: any;
}

// Export singleton instance
export const errorHandler = new ErrorHandlingService();

// Utility functions for common error scenarios
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorType: ErrorLog['type'] = 'runtime',
  showToUser = true
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    await errorHandler.handleError(error as Error, {
      type: errorType,
      severity: 'medium',
      showToUser
    });
    return null;
  }
};

export const createValidationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    type: 'required',
    message,
    code: 'REQUIRED'
  }),
  
  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    type: 'email',
    message,
    code: 'INVALID_EMAIL'
  }),
  
  minLength: (length: number, message?: string): ValidationRule => ({
    type: 'minLength',
    value: length,
    message: message || `Must be at least ${length} characters`,
    code: 'MIN_LENGTH'
  }),
  
  pattern: (regex: RegExp, message: string): ValidationRule => ({
    type: 'pattern',
    value: regex.source,
    message,
    code: 'PATTERN_MISMATCH'
  }),
  
  custom: (validator: (value: any) => boolean, message: string): ValidationRule => ({
    type: 'custom',
    validator,
    message,
    code: 'CUSTOM_VALIDATION'
  })
};