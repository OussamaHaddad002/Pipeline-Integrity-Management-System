# 🛢️ Pipeline Integrity Management System

A comprehensive pipeline risk assessment platform designed for the oil & gas industry, featuring advanced engineering calculations, real-time monitoring, and AI-powered failure prediction. This system demonstrates modern software development capabilities specifically tailored for pipeline integrity challenges.

🌐 **Frontend**: http://localhost:3000  
📡 **API**: http://localhost:3001  
📊 **Interactive Dashboard** with real pipeline integrity assessments and predictive analytics

## 🚀 Key Features

### �️ Pipeline Integrity Management
- **📍 Interactive Pipeline Network Visualization** - Geographic mapping with risk-based assessment overlays
- **� Advanced Engineering Calculations** - Multi-factor integrity assessments including wall loss, corrosion rates, and pressure analysis
- **📊 Real-time Assessment Dashboard** - Live monitoring of pipeline conditions with instant risk calculations
- **⚡ Field-Ready Interface** - Pragmatic design optimized for field engineers and integrity specialists
- **📈 Predictive Analytics** - Machine learning models for failure probability assessment (0.1% - 1.0% accuracy)
- **🗂️ Industry-Standard Data Processing** - Handle real pipeline inspection data with CSV import/export capabilities

### 💻 Technical Implementation
- **🔷 Full TypeScript Stack** - Type-safe development ensuring reliability in critical applications
- **🎨 Modern React Frontend** - Responsive interface designed for both office and field use
- **🗄️ Robust Node.js Backend** - Scalable API architecture with comprehensive error handling
- **📊 Advanced Data Visualization** - Interactive charts and real-time pipeline status monitoring
- **🔒 Enterprise Security** - Authentication, input validation, and secure data handling
- **🐳 Production Ready** - Docker containerization for reliable deployment

## 🏗️ System Architecture

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   React Frontend    │    │   Node.js Backend   │    │    Sample Data      │
│   TypeScript + Vite │◄──►│   Express + TypeScript│◄──►│   CSV Processing    │
│   Port: 3000        │    │   Port: 3001        │    │   Risk Calculations │
│   - Dashboard UI    │    │   - RESTful API     │    │   - AI Predictions  │
│   - Risk Analysis   │    │   - WebSocket       │    │   - 10+ Pipelines   │
│   - Data Viz        │    │   - Authentication  │    │   - Real Scenarios  │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

## 💡 Pipeline Integrity Expertise

### 🎯 **Industry-Grade Engineering Calculations**
- **10 Production-Quality Pipeline Records** with authentic specifications and field data
- **Real-world Engineering Assessments**: Age analysis (7-47 years), corrosion rate calculations, wall loss evaluations
- **Accurate Failure Probability Models**: 0.114% to 0.996% based on industry-standard assessment methodologies
- **Geographic Coverage**: Texas, Louisiana, North Dakota pipeline networks with realistic operational conditions

### 🧠 **Advanced Risk Assessment Algorithms**
```typescript
// Pipeline integrity assessment calculation
const riskAssessment = calculateIntegrityRisk({
  serviceAge: 30,           // Years in operation
  wallLossPercentage: 12.5, // Current degradation level  
  corrosionRate: 0.85,      // Mills per year progression
  pressureRating: 1440,     // Operating pressure (PSIG)
  incidentHistory: 1        // Historical failure events
});
// Result: Comprehensive risk profile with failure probability
```

### 🔧 **Field-Ready Engineering Solutions**
- **Pragmatic Interface Design** - Built for field engineers and pipeline integrity specialists
- **Real-time Calculation Engine** - Instant assessment updates as inspection data changes
- **Industry-Standard Compliance** - Follows pipeline integrity management best practices
- **Scalable Assessment Platform** - Designed to handle enterprise-level pipeline networks


#### **Software Development & Engineering**
- ✅ **Frontend/Backend Programming** - Full-stack TypeScript development with modern frameworks
- ✅ **Engineering Calculations Implementation** - Advanced risk assessment algorithms and failure probability models
- ✅ **Interface & Usability Improvement** - User-centered design optimized for pipeline integrity specialists
- ✅ **Software Architecture** - Scalable, maintainable codebase suitable for enterprise pipeline management

#### **Pipeline Integrity Expertise**
- ✅ **Assessment & Repair Intervention Management** - Comprehensive risk evaluation and prioritization systems
- ✅ **High-Level Engineering & Analytics** - Advanced data processing and predictive modeling capabilities
- ✅ **Pragmatic Field Experience Integration** - Interface design that bridges engineering analysis with field operations
- ✅ **Pipeline Industry Knowledge** - Understanding of corrosion, wall loss, pressure analysis, and failure mechanisms

### **🔧 Technical Deliverables**
- **Modern Web Application** - Production-ready pipeline integrity management system
- **Engineering Calculation Engine** - Implements industry-standard risk assessment methodologies
- **Real-time Monitoring Dashboard** - Live pipeline status tracking and alert management
- **Data Processing Pipeline** - CSV import/export for integration with existing inspection systems
- **Scalable Architecture** - Foundation for enterprise-level pipeline network management

> *"The ability to connect high level engineering & analytics with pragmatic feet-on-the-ground field experience"* - This project demonstrates exactly this capability through its combination of advanced algorithms and field-ready interface design.

## 🛠️ Technology Stack & Engineering Implementation

### **Backend Engineering** ⚙️  
- **🟢 Node.js + Express.js** - Robust API architecture for pipeline data processing
- **🧮 Engineering Calculation Engine** - Advanced algorithms for risk assessment and failure prediction
- **📊 CSV Data Processing** - Handle real pipeline inspection data with validation and error handling
- **🔌 Real-time Communication** - Socket.io for live monitoring and instant assessment updates
- **📝 Comprehensive Logging** - Winston-based logging for production monitoring and debugging
- **🔒 Security Implementation** - Helmet, CORS, rate limiting, and input validation

### **Frontend Interface** 🎨
- **⚛️ React 18+ with TypeScript** - Type-safe component architecture for reliable UI
- **🎨 Tailwind CSS** - Professional styling optimized for engineering applications
- **� Recharts** - Interactive data visualization for pipeline assessment results
- **🌐 WebSocket Integration** - Real-time updates for live pipeline monitoring
- **⚡ Vite Development** - Fast development environment with optimized production builds

### **Data & Calculations** 🧠
- **📈 Risk Assessment Engine** - Multi-factor probability algorithms based on industry standards
- **🗃️ Pipeline Data Management** - Structured handling of inspection data and historical records
- **🤖 Predictive Modeling** - Failure probability calculations with confidence scoring
- **📊 Statistical Analysis** - Trend analysis, correlation studies, and risk factor weighting

## 🚀 Quick Start

### **Prerequisites**
- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org))
- **Git** for cloning the repository

### **Installation**

1. **📥 Clone the Repository**
```bash
git clone https://github.com/yourusername/pipeline-risk-dashboard.git
cd pipeline-risk-dashboard
```

2. **🔧 Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **🎨 Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **🚀 Start the Development Servers**

**Backend Server (Terminal 1):**
```bash
cd backend
npm run dev
# Server starts on http://localhost:3001
```

**Frontend Server (Terminal 2):**
```bash
cd frontend  
npm run dev
# Application opens at http://localhost:3000
```

5. **🎉 Open Your Browser**
Navigate to **http://localhost:3000** to see the dashboard in action!

## 📊 Sample Data Overview

The system includes production-quality sample data representing real pipeline scenarios:

| Pipeline ID | Name | Age | Wall Loss | Corrosion Rate | Risk Level | Failure Probability |
|------------|------|-----|-----------|----------------|------------|-------------------|
| TX-001 | Gulf Coast Main | 30 years | 12.5% | 0.85 mil/yr | **Medium** | **0.48%** |
| TX-005 | East Texas Loop | 33 years | 15.8% | 1.15 mil/yr | **High** | **0.996%** |
| TX-007 | Coastal Connector | 7 years | 1.8% | 0.29 mil/yr | **Low** | **0.114%** |

*Each record includes 30+ data points including geographic location, material specifications, environmental conditions, and maintenance history.*

## API Endpoints

### **Pipeline Management**
```typescript
// Get all pipelines with risk data
GET /api/risk-assessments
Response: {
  success: true,
  data: PipelineRiskData[],
  total: number
}

// Get CSV pipeline data for predictions  
GET /api/predictions/csv-data
Response: {
  success: true,
  data: CSVPipelineData[]
}

// Generate AI prediction for specific pipeline
POST /api/predictions/predict-csv/:pipelineId
Body: {
  modelType: "ensemble",
  timeHorizon: 5
}
Response: {
  success: true,
  message: string,
  data: {
    failureProbability: number,
    predictedFailureDate: string,
    confidenceScore: number,
    riskFactors: RiskFactor[]
  }
}
```

### **Real-time WebSocket Events**
```typescript
// Client connection
io.on('connection', (socket) => {
  socket.emit('pipeline:updated', pipelineData);
  socket.emit('risk:calculated', riskAssessment);
  socket.emit('prediction:generated', aiPrediction);
});
```

## 🧪 Testing the Application

### **🔍 Risk Assessment Testing**
1. Navigate to **http://localhost:3000**
2. View the dashboard with 10 sample pipelines
3. Click "Assess Risk" on any pipeline (e.g., TX-001)
4. See detailed risk breakdown with failure probabilities
5. Observe color-coded risk levels and contributing factors

### **🤖 AI Prediction Testing**
1. Go to **Predictions** tab
2. Select a pipeline from the dropdown (TX-001 through TX-010)
3. Click "Generate AI Prediction"
4. View failure probability (0.1% - 1.0%)
5. Examine confidence scores and risk factor analysis

### **⚡ Real-time Updates Testing**
1. Open the application in multiple browser tabs
2. Generate a prediction in one tab
3. Watch real-time updates appear in other tabs

## 🎯 Code Quality Features

### **🔷 TypeScript Implementation**
```typescript
interface PipelineRiskData {
  id: string;
  name: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  failureProbability: number;
  lastAssessment: string;
  specifications: PipelineSpecs;
  riskFactors: RiskFactors;
}
```

### **🔒 Security & Validation**
- **Input Validation** - Joi schemas for all API endpoints
- **Error Handling** - Comprehensive try-catch blocks with logging  
- **CORS Protection** - Configured for development and production
- **Rate Limiting** - Prevent API abuse and ensure stability

## Deployment & Docker

### **🐳 Docker Support (Optional)**
For containerized deployment:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Services will be available at:
# - Frontend: http://localhost:3000  
# - Backend: http://localhost:3001
```

## 📁 Project Structure

```
pipeline-risk-dashboard/
├── 📁 frontend/                 # React TypeScript application
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   ├── 📁 pages/           # Route components
│   │   ├── 📁 hooks/           # Custom React hooks  
│   │   ├── 📁 services/        # API clients
│   │   └── 📁 types/           # TypeScript definitions
│   ├── 📄 package.json
│   └── 📄 vite.config.ts
│
├── 📁 backend/                  # Node.js Express API
│   ├── 📁 src/
│   │   ├── 📁 routes/          # API endpoints
│   │   ├── 📁 services/        # Business logic
│   │   ├── 📁 utils/           # Helper functions
│   │   ├── 📁 data/           # Sample CSV data
│   │   └── 📁 types/           # TypeScript definitions
│   ├── 📄 package.json
│   └── 📄 tsconfig.json
│
├── 📄 docker-compose.yml        # Container orchestration
├── 📄 README.md                # This file
└── 📄 .gitignore               # Git ignore rules
```

### ** Troubleshooting**
- **Port Conflicts**: Change ports in package.json scripts if 3000/3001 are occupied
- **CORS Issues**: Backend configured for http://localhost:3000 origin
- **WebSocket Connection**: Check browser console for connection status
- **CSV Parsing**: Sample data includes proper formatting examples

### **🧠 Pipeline Integrity Engineering**
- ✅ **Assessment Management** - Comprehensive pipeline evaluation and risk prioritization systems
- ✅ **Engineering Analytics** - Advanced data processing, statistical analysis, and predictive modeling
- ✅ **Industry Knowledge** - Understanding of corrosion, wall loss, pressure analysis, and failure mechanisms
- ✅ **Pragmatic Solutions** - Bridge between high-level engineering analysis and field operations

### **🏗️ Software Architecture & Implementation**
- ✅ **Modular System Design** - Scalable architecture suitable for enterprise pipeline networks
- ✅ **Type-Safe Development** - TypeScript implementation ensuring reliability in critical applications
- ✅ **Real-time Communication** - WebSocket integration for live monitoring and assessment updates
- ✅ **Production-Ready Code** - Comprehensive error handling, logging, and security implementation

### **🎨 Professional Interface Design**  
- ✅ **User-Centered Design** - Optimized for both office analysis and field operations
- ✅ **Data Visualization** - Interactive charts and real-time pipeline status displays
- ✅ **Responsive Implementation** - Cross-platform compatibility for various deployment scenarios
- ✅ **Industry-Standard Workflows** - Designed to integrate with existing pipeline management processes


**🛢️ Built for Pipeline Integrity Management**
