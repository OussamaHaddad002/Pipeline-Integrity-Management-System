/**
 * WebSocket service
 * @fileoverview Real-time communication using Socket.IO
 */

import { Server as SocketServer } from 'socket.io';
import { logger } from '../utils/logger';

export interface WebSocketMessage {
  type: 'pipeline_update' | 'risk_update' | 'new_alert' | 'incident_report';
  data: any;
  timestamp: string;
}

class WebSocketService {
  private static instance: WebSocketService;
  private io: SocketServer | null = null;
  private connectedClients = new Set<string>();

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public initialize(io: SocketServer): void {
    this.io = io;
    
    io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);
      this.connectedClients.add(socket.id);

      socket.on('join_room', (room: string) => {
        socket.join(room);
        logger.info(`Client ${socket.id} joined room: ${room}`);
      });

      socket.on('leave_room', (room: string) => {
        socket.leave(room);
        logger.info(`Client ${socket.id} left room: ${room}`);
      });

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
        this.connectedClients.delete(socket.id);
      });

      // Send connection acknowledgment
      socket.emit('connected', {
        message: 'Connected to Pipeline Risk Assessment System',
        timestamp: new Date().toISOString()
      });
    });

    logger.info('WebSocket service initialized');
  }

  public broadcast(message: WebSocketMessage): void {
    if (!this.io) {
      logger.warn('WebSocket not initialized, cannot broadcast message');
      return;
    }

    this.io.emit('message', message);
    logger.info(`Broadcasted message: ${message.type}`, { clientCount: this.connectedClients.size });
  }

  public sendToRoom(room: string, message: WebSocketMessage): void {
    if (!this.io) {
      logger.warn('WebSocket not initialized, cannot send to room');
      return;
    }

    this.io.to(room).emit('message', message);
    logger.info(`Sent message to room ${room}: ${message.type}`);
  }

  public sendPipelineUpdate(pipelineData: any): void {
    this.broadcast({
      type: 'pipeline_update',
      data: pipelineData,
      timestamp: new Date().toISOString()
    });
  }

  public sendRiskUpdate(riskData: any): void {
    this.broadcast({
      type: 'risk_update',
      data: riskData,
      timestamp: new Date().toISOString()
    });
  }

  public sendAlert(alertData: any): void {
    this.broadcast({
      type: 'new_alert',
      data: alertData,
      timestamp: new Date().toISOString()
    });
  }

  public sendIncidentReport(incidentData: any): void {
    this.broadcast({
      type: 'incident_report',
      data: incidentData,
      timestamp: new Date().toISOString()
    });
  }

  public getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }
}

export const initializeWebSocket = (io: SocketServer): void => {
  const wsService = WebSocketService.getInstance();
  wsService.initialize(io);
};

export const wsService = WebSocketService.getInstance();
