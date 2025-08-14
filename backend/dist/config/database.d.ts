import { Pool } from 'pg';
declare class Database {
    private static instance;
    private pool;
    private constructor();
    static getInstance(): Database;
    query(text: string, params?: any[]): Promise<any>;
    testConnection(): Promise<boolean>;
    createExtensions(): Promise<void>;
    close(): Promise<void>;
    getPool(): Pool;
}
export declare const connectDatabase: () => Promise<void>;
export declare const db: Database;
export {};
//# sourceMappingURL=database.d.ts.map