"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiService = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
class AIService {
    constructor() {
        this.isConnected = false;
        this.aiServerUrl = process.env.AI_API_URL || 'http://localhost:5000';
        this.api = axios_1.default.create({
            baseURL: this.aiServerUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.setupInterceptors();
        this.checkConnection();
    }
    setupInterceptors() {
        this.api.interceptors.request.use((config) => {
            logger_1.logger.info(`AI API Request: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        }, (error) => {
            logger_1.logger.error('AI API Request Error:', error);
            return Promise.reject(error);
        });
        this.api.interceptors.response.use((response) => {
            logger_1.logger.info(`AI API Response: ${response.status} ${response.config.url}`);
            return response;
        }, (error) => {
            logger_1.logger.error('AI API Response Error:', error.response?.data || error.message);
            return Promise.reject(error);
        });
    }
    async checkConnection() {
        try {
            const response = await this.api.get('/health');
            this.isConnected = response.status === 200;
            logger_1.logger.info('AI Service connected successfully');
        }
        catch (error) {
            this.isConnected = false;
            logger_1.logger.warn('AI Service not available, will use fallback data');
        }
    }
    async isServiceAvailable() {
        if (!this.isConnected) {
            await this.checkConnection();
        }
        return this.isConnected;
    }
    async generatePredictions(pipelinesData) {
        try {
            if (!await this.isServiceAvailable()) {
                throw new Error('AI service not available');
            }
            const response = await this.api.post('/predict', {
                pipelines: pipelinesData
            });
            return response.data.predictions;
        }
        catch (error) {
            logger_1.logger.error('Failed to generate predictions:', error);
            throw error;
        }
    }
    async generateRiskAssessments(pipelinesData) {
        try {
            if (!await this.isServiceAvailable()) {
                throw new Error('AI service not available');
            }
            const response = await this.api.post('/assess-risk', {
                pipelines: pipelinesData
            });
            return response.data.assessments;
        }
        catch (error) {
            logger_1.logger.error('Failed to generate risk assessments:', error);
            throw error;
        }
    }
    async getModelPerformance() {
        try {
            if (!await this.isServiceAvailable()) {
                throw new Error('AI service not available');
            }
            const response = await this.api.get('/model-performance');
            return response.data.performance;
        }
        catch (error) {
            logger_1.logger.error('Failed to get model performance:', error);
            throw error;
        }
    }
    async trainModels(trainingData) {
        try {
            if (!await this.isServiceAvailable()) {
                throw new Error('AI service not available');
            }
            const response = await this.api.post('/train', {
                data: trainingData
            });
            return response.data;
        }
        catch (error) {
            logger_1.logger.error('Failed to train models:', error);
            throw error;
        }
    }
    async getFeatureImportance() {
        try {
            if (!await this.isServiceAvailable()) {
                throw new Error('AI service not available');
            }
            const response = await this.api.get('/feature-importance');
            return response.data.importance;
        }
        catch (error) {
            logger_1.logger.error('Failed to get feature importance:', error);
            throw error;
        }
    }
}
exports.aiService = new AIService();
//# sourceMappingURL=aiService.js.map