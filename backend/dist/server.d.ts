declare class Server {
    private app;
    private httpServer;
    private io;
    private port;
    constructor();
    private initializeMiddleware;
    private initializeRoutes;
    private initializeErrorHandling;
    private initializeWebSocket;
    start(): Promise<void>;
    private gracefulShutdown;
}
export default Server;
//# sourceMappingURL=server.d.ts.map