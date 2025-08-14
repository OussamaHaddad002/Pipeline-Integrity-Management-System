/**
 * WebSocket service for real-time updates
 * @fileoverview Handles real-time communication with the backend
 */

import { io, Socket } from 'socket.io-client';
import { Pipeline, RiskAssessment, Incident } from '../types';

export interface SocketEvents {
  'pipeline:updated': Pipeline;
  'risk:calculated': RiskAssessment;
  'incident:created': Incident;
  'alert:critical': { pipelineId: number; message: string };
}

class WebSocketService {
  private socket: Socket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io({
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Set up event forwarding
    this.setupEventForwarding();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.eventListeners.clear();
  }

  private setupEventForwarding(): void {
    if (!this.socket) return;

    const events: (keyof SocketEvents)[] = [
      'pipeline:updated',
      'risk:calculated',
      'incident:created',
      'alert:critical'
    ];

    events.forEach(event => {
      this.socket!.on(event, (data) => {
        const listeners = this.eventListeners.get(event) || [];
        listeners.forEach(listener => listener(data));
      });
    });
  }

  on<T extends keyof SocketEvents>(
    event: T,
    callback: (data: SocketEvents[T]) => void
  ): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.push(callback);
    this.eventListeners.set(event, listeners);
  }

  off<T extends keyof SocketEvents>(
    event: T,
    callback?: (data: SocketEvents[T]) => void
  ): void {
    if (!callback) {
      this.eventListeners.delete(event);
      return;
    }

    const listeners = this.eventListeners.get(event) || [];
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
      this.eventListeners.set(event, listeners);
    }
  }

  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  get connected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsService = new WebSocketService();
