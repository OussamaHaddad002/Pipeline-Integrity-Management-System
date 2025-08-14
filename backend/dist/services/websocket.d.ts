import { Server as SocketServer } from 'socket.io';
export interface WebSocketMessage {
    type: 'pipeline_update' | 'risk_update' | 'new_alert' | 'incident_report';
    data: any;
    timestamp: string;
}
declare class WebSocketService {
    private static instance;
    private io;
    private connectedClients;
    private constructor();
    static getInstance(): WebSocketService;
    initialize(io: SocketServer): void;
    broadcast(message: WebSocketMessage): void;
    sendToRoom(room: string, message: WebSocketMessage): void;
    sendPipelineUpdate(pipelineData: any): void;
    sendRiskUpdate(riskData: any): void;
    sendAlert(alertData: any): void;
    sendIncidentReport(incidentData: any): void;
    getConnectedClientsCount(): number;
}
export declare const initializeWebSocket: (io: SocketServer) => void;
export declare const wsService: WebSocketService;
export {};
//# sourceMappingURL=websocket.d.ts.map