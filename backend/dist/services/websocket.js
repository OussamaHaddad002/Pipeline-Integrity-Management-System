"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsService = exports.initializeWebSocket = void 0;
const logger_1 = require("../utils/logger");
class WebSocketService {
    constructor() {
        this.io = null;
        this.connectedClients = new Set();
    }
    static getInstance() {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }
    initialize(io) {
        this.io = io;
        io.on('connection', (socket) => {
            logger_1.logger.info(`Client connected: ${socket.id}`);
            this.connectedClients.add(socket.id);
            socket.on('join_room', (room) => {
                socket.join(room);
                logger_1.logger.info(`Client ${socket.id} joined room: ${room}`);
            });
            socket.on('leave_room', (room) => {
                socket.leave(room);
                logger_1.logger.info(`Client ${socket.id} left room: ${room}`);
            });
            socket.on('disconnect', () => {
                logger_1.logger.info(`Client disconnected: ${socket.id}`);
                this.connectedClients.delete(socket.id);
            });
            socket.emit('connected', {
                message: 'Connected to Pipeline Risk Assessment System',
                timestamp: new Date().toISOString()
            });
        });
        logger_1.logger.info('WebSocket service initialized');
    }
    broadcast(message) {
        if (!this.io) {
            logger_1.logger.warn('WebSocket not initialized, cannot broadcast message');
            return;
        }
        this.io.emit('message', message);
        logger_1.logger.info(`Broadcasted message: ${message.type}`, { clientCount: this.connectedClients.size });
    }
    sendToRoom(room, message) {
        if (!this.io) {
            logger_1.logger.warn('WebSocket not initialized, cannot send to room');
            return;
        }
        this.io.to(room).emit('message', message);
        logger_1.logger.info(`Sent message to room ${room}: ${message.type}`);
    }
    sendPipelineUpdate(pipelineData) {
        this.broadcast({
            type: 'pipeline_update',
            data: pipelineData,
            timestamp: new Date().toISOString()
        });
    }
    sendRiskUpdate(riskData) {
        this.broadcast({
            type: 'risk_update',
            data: riskData,
            timestamp: new Date().toISOString()
        });
    }
    sendAlert(alertData) {
        this.broadcast({
            type: 'new_alert',
            data: alertData,
            timestamp: new Date().toISOString()
        });
    }
    sendIncidentReport(incidentData) {
        this.broadcast({
            type: 'incident_report',
            data: incidentData,
            timestamp: new Date().toISOString()
        });
    }
    getConnectedClientsCount() {
        return this.connectedClients.size;
    }
}
const initializeWebSocket = (io) => {
    const wsService = WebSocketService.getInstance();
    wsService.initialize(io);
};
exports.initializeWebSocket = initializeWebSocket;
exports.wsService = WebSocketService.getInstance();
//# sourceMappingURL=websocket.js.map