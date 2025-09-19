import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string) {
    if (this.socket?.connected) {
      return;
    }

    this.userId = userId;
    this.socket = io(import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3001');

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.socket?.emit('join-user-room', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('notification', (notification) => {
      this.showNotification(notification);
    });

    this.socket.on('progress-update', (update) => {
      console.log('Progress update:', update);
      // Handle progress updates
    });

    this.socket.on('leaderboard-changed', (data) => {
      console.log('Leaderboard changed:', data);
      // Handle leaderboard updates
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
    }
  }

  joinGuild(guildId: string) {
    this.socket?.emit('join-guild', guildId);
  }

  sendGuildMessage(guildId: string, message: string, userName: string) {
    this.socket?.emit('guild-message', {
      guildId,
      message,
      userId: this.userId,
      userName,
    });
  }

  onGuildMessage(callback: (message: any) => void) {
    this.socket?.on('guild-message', callback);
  }

  updateQuestProgress(questId: string, progress: number) {
    this.socket?.emit('quest-progress', {
      userId: this.userId,
      questId,
      progress,
    });
  }

  achievementEarned(achievement: any) {
    this.socket?.emit('achievement-earned', {
      userId: this.userId,
      achievement,
    });
  }

  updateLeaderboard(newScore: number) {
    this.socket?.emit('leaderboard-update', {
      userId: this.userId,
      newScore,
    });
  }

  private showNotification(notification: any) {
    // Create a toast notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
      });
    }

    // Also show in-app notification
    const event = new CustomEvent('app-notification', { detail: notification });
    window.dispatchEvent(event);
  }

  static requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
}

export const socketService = new SocketService();