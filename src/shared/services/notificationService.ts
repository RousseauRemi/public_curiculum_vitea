export interface NotificationOptions {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export class NotificationService {
  private static instance: NotificationService;
  private styleId = 'notification-styles';

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private constructor() {
    this.ensureStyles();
  }

  private ensureStyles(): void {
    if (!document.getElementById(this.styleId)) {
      const style = document.createElement('style');
      style.id = this.styleId;
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.95); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  private getNotificationStyles(type: NotificationOptions['type']): string {
    const baseStyles = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
      max-width: 300px;
      word-wrap: break-word;
    `;

    const typeStyles = {
      success: 'background: #10b981; color: white;',
      error: 'background: #ef4444; color: white;',
      warning: 'background: #f59e0b; color: white;',
      info: 'background: #3b82f6; color: white;'
    };

    return baseStyles + typeStyles[type];
  }

  private getIcon(type: NotificationOptions['type']): string {
    const icons = {
      success: '✓',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type];
  }

  public show(options: NotificationOptions): void {
    const notification = document.createElement('div');
    notification.style.cssText = this.getNotificationStyles(options.type);
    
    const icon = this.getIcon(options.type);
    notification.innerHTML = `<span style="margin-right: 8px">${icon}</span>${options.message}`;
    
    document.body.appendChild(notification);

    const duration = options.duration || 3000;
    
    setTimeout(() => {
      this.hide(notification);
    }, duration);
  }

  private hide(notification: HTMLElement): void {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  public success(message: string, duration?: number): void {
    this.show({ message, type: 'success', duration });
  }

  public error(message: string, duration?: number): void {
    this.show({ message, type: 'error', duration });
  }

  public warning(message: string, duration?: number): void {
    this.show({ message, type: 'warning', duration });
  }

  public info(message: string, duration?: number): void {
    this.show({ message, type: 'info', duration });
  }
}

export const notificationService = NotificationService.getInstance();