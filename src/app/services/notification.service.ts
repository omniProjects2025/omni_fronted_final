import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private containerId = 'app-notification-container';

  private ensureContainer(): HTMLElement {
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = this.containerId;
      container.setAttribute('style', `position: fixed; z-index: 99999; right: 20px; top: 20px; display:flex; flex-direction:column; gap:10px;`);
      document.body.appendChild(container);
    }
    return container;
  }

  error(message: string, timeout = 4500) {
    this.show(message, 'rgba(220, 38, 38, 0.95)', timeout);
  }

  info(message: string, timeout = 3500) {
    this.show(message, 'rgba(30, 64, 175, 0.95)', timeout);
  }

  success(message: string, timeout = 3500) {
    this.show(message, 'rgba(16, 185, 129, 0.95)', timeout);
  }

  private show(message: string, bgColor: string, timeout: number) {
    const container = this.ensureContainer();
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.setAttribute('style', `color: white; background: ${bgColor}; padding: 12px 16px; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.25); max-width: 320px; font-family: Arial, sans-serif; font-size: 14px;`);
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.transition = 'opacity 300ms ease, transform 300ms ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      setTimeout(() => container.removeChild(toast), 300);
    }, timeout);
  }
}
