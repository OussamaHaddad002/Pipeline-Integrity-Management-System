# 🛢️ Pipeline Risk Assessment Dashboard

A comprehensive pipeline integrity management system designed for the oil & gas industry, featuring real-time monitoring, AI-powered risk prediction, and interactive data visualization. Built as a professional portfolio project demonstrating full-stack development capabilities.

## ✨ Live Demo

🌐 **Frontend**: http://localhost:3000  
� **API**: http://localhost:3001  
📊 **Interactive Dashboard** with real pipeline data and AI predictions

## �🚀 Key Features

### 🎯 Core Functionality
- **📍 Interactive Map Visualization** - Dynamic pipeline network display with risk-based color coding
- **🤖 AI-Powered Risk Prediction** - Machine learning models calculating realistic failure probabilities (0.1% - 1.0%)
- **⚡ Real-time Updates** - WebSocket-based live data streaming and alerts  
- **📈 Comprehensive Analytics** - Multi-factor risk scoring with detailed breakdowns
- **🗂️ CSV Data Processing** - Import and analyze pipeline inspection data
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile devices

### 💻 Technical Highlights
- **🔷 Full TypeScript Stack** - Type safety across frontend, backend, and data layers
- **🎨 Modern React UI** - Built with React 18+ using functional components and hooks
- **🗄️ Robust Backend** - Node.js/Express API with comprehensive error handling
- **📊 Advanced Visualization** - Interactive charts, graphs, and real-time data displays
- **🔒 Security Implementation** - Authentication middleware, input validation, and CORS protection
- **🐳 Docker Ready** - Containerized architecture for easy deployment

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

## 💡 What Makes This Special

### 🎯 **Realistic Industry Data**
- **10 Production-Quality Pipeline Records** with authentic specifications
- **Real-world Risk Factors**: Age (7-47 years), corrosion rates, wall loss percentages
- **Authentic Failure Probabilities**: 0.114% to 0.996% based on actual industry calculations
- **Geographic Diversity**: Texas, Louisiana, North Dakota pipeline networks

### 🧠 **Intelligent Risk Assessment**
```typescript
// AI-powered failure probability calculation
const failureProbability = calculateRisk({
  age: 30,              // Years in service
  wallLoss: 12.5,       // Percentage degradation  
  corrosionRate: 0.85,  // Mills per year
  incidents: 1          // Historical failures
});
// Result: 0.48% annual failure probability
```

## 🛠️ Technology Stack

### **Frontend** 🎨
- **⚛️ React 18+** with TypeScript - Modern component architecture
- **🎨 Tailwind CSS** - Utility-first styling with responsive design
- **📊 Recharts** - Interactive data visualization and analytics
- **🌐 WebSocket Client** - Real-time data streaming
- **⚡ Vite** - Lightning-fast development and optimized builds

### **Backend** ⚙️  
- **🟢 Node.js + Express.js** - RESTful API with TypeScript
- **🔌 Socket.io** - Real-time bidirectional communication
- **📝 Winston Logging** - Structured application logging
- **🔒 Security Middleware** - Helmet, CORS, rate limiting
- **📊 CSV Processing** - Advanced data parsing and validation

### **Data & AI** 🧠
- **📈 Risk Calculation Engine** - Multi-factor probability algorithms  
- **🗃️ CSV Data Processing** - Handle real pipeline inspection data
- **🤖 Predictive Modeling** - Failure probability with confidence scoring
- **📊 Statistical Analysis** - Trend analysis and risk factor correlation

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

## � Application Features

### 🏠 **Dashboard Overview**
- **📊 Real-time Metrics** - Active pipeline count, risk distribution, alert summaries
- **🎯 Risk Level Distribution** - Visual breakdown of Low/Medium/High/Critical risks
- **⚡ Live Updates** - WebSocket-powered real-time data streaming
- **📈 Trend Analysis** - Historical risk patterns and failure predictions

### 🔍 **Risk Assessment Module**  
- **📋 Pipeline Inventory** - Comprehensive list with key specifications and risk levels
- **🧮 Instant Risk Calculation** - Click any pipeline for immediate risk analysis
- **📊 Detailed Risk Breakdown** - Multi-factor analysis with contribution percentages
- **🎨 Color-coded Visualization** - Intuitive risk level identification

### 🤖 **AI Predictions**
- **🎯 Failure Probability Calculation** - Realistic percentages based on pipeline conditions
- **📅 Predicted Failure Dates** - AI-powered timeline projections
- **🔢 Confidence Scoring** - Model certainty indicators (85-97% confidence)
- **📈 Risk Factor Analysis** - Detailed breakdown of contributing factors

### 💾 **Data Management**
- **📤 CSV Import/Export** - Handle real-world pipeline inspection data
- **🔄 Real-time Processing** - Instant data validation and parsing
- **📊 Sample Data Included** - 10 realistic pipeline records for testing
- **🗃️ Historical Tracking** - Maintain records of all risk assessments

## 📊 Sample Data Overview

The system includes production-quality sample data representing real pipeline scenarios:

| Pipeline ID | Name | Age | Wall Loss | Corrosion Rate | Risk Level | Failure Probability |
|------------|------|-----|-----------|----------------|------------|-------------------|
| TX-001 | Gulf Coast Main | 30 years | 12.5% | 0.85 mil/yr | **Medium** | **0.48%** |
| TX-005 | East Texas Loop | 33 years | 15.8% | 1.15 mil/yr | **High** | **0.996%** |
| TX-007 | Coastal Connector | 7 years | 1.8% | 0.29 mil/yr | **Low** | **0.114%** |

*Each record includes 30+ data points including geographic location, material specifications, environmental conditions, and maintenance history.*

## � API Endpoints

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
4. See detailed risk breakdown with realistic failure probabilities
5. Observe color-coded risk levels and contributing factors

### **🤖 AI Prediction Testing**
1. Go to **Predictions** tab
2. Select a pipeline from the dropdown (TX-001 through TX-010)
3. Click "Generate AI Prediction"
4. View realistic failure probability (0.1% - 1.0%)
5. Examine confidence scores and risk factor analysis

### **⚡ Real-time Updates Testing**
1. Open the application in multiple browser tabs
2. Generate a prediction in one tab
3. Watch real-time updates appear in other tabs
4. Observe WebSocket connectivity status indicators

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

## � Deployment & Docker

### **🐳 Docker Support (Optional)**
For containerized deployment:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Services will be available at:
# - Frontend: http://localhost:3000  
# - Backend: http://localhost:3001
```

### **☁️ Production Deployment**
Ready for deployment to:
- **Heroku** - Direct GitHub integration
- **Netlify/Vercel** - Frontend hosting
- **AWS/Azure** - Full cloud deployment
- **Digital Ocean** - VPS deployment

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

## 🛠️ Development Tips

### **🔧 Backend Development**
```bash
# Watch mode for auto-restart
npm run dev

# Check API endpoints
curl http://localhost:3001/api/risk-assessments

# View real-time logs
tail -f logs/application.log
```

### **🎨 Frontend Development**  
```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **� Troubleshooting**
- **Port Conflicts**: Change ports in package.json scripts if 3000/3001 are occupied
- **CORS Issues**: Backend configured for http://localhost:3000 origin
- **WebSocket Connection**: Check browser console for connection status
- **CSV Parsing**: Sample data includes proper formatting examples

## 🎯 Key Learning Outcomes

This project demonstrates:

### **💻 Full-Stack Development**
- ✅ React functional components with TypeScript
- ✅ Node.js/Express RESTful API design  
- ✅ Real-time WebSocket communication
- ✅ CSV data processing and validation

### **🧠 Data Science & AI**
- ✅ Risk calculation algorithms
- ✅ Predictive modeling concepts
- ✅ Statistical analysis and probability
- ✅ Feature engineering techniques

### **🏗️ Software Architecture**
- ✅ Modular component design
- ✅ Service layer separation
- ✅ Type-safe development practices
- ✅ Error handling and logging

### **🎨 UI/UX Design**  
- ✅ Responsive design principles
- ✅ Data visualization best practices
- ✅ Interactive user interfaces
- ✅ Professional dashboard layouts

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

### **🔄 Development Workflow**
1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
4. **Make** your changes with proper TypeScript types
5. **Test** your changes thoroughly  
6. **Commit** with descriptive messages (`git commit -m 'Add amazing feature'`)
7. **Push** to your branch (`git push origin feature/amazing-feature`)
8. **Open** a Pull Request with detailed description

### **📝 Code Standards**
- ✅ Use TypeScript for all new code
- ✅ Follow ESLint configuration
- ✅ Add JSDoc comments for functions
- ✅ Include error handling
- ✅ Update README for new features

### **🧪 Testing Requirements**
- ✅ Test API endpoints manually
- ✅ Verify TypeScript compilation  
- ✅ Check responsive design
- ✅ Validate real-time updates

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Need Help?

### **🐛 Common Issues & Solutions**

**❌ "Port 3000 already in use"**
```bash
# Kill the process using port 3000
npx kill-port 3000
# Or change the port in package.json
```

**❌ "Cannot connect to backend"**
```bash
# Verify backend is running
curl http://localhost:3001/api/risk-assessments
# Check backend terminal for errors
```

**❌ "WebSocket connection failed"**
```bash
# Check browser console for connection status
# Verify both frontend and backend are running
# Ensure no firewall blocking connections
```

**❌ "CSV data not loading"**
```bash
# Verify sample data file exists
ls backend/src/data/pipeline_test_data.csv
# Check backend logs for parsing errors
```

### **💬 Get Support**
- 📧 **Email**: [your.email@domain.com](mailto:your.email@domain.com)
- � **Issues**: [GitHub Issues](https://github.com/yourusername/pipeline-risk-dashboard/issues)
- � **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- 🌟 **Portfolio**: [Your Portfolio Website](https://yourwebsite.com)

## 🏆 Acknowledgments

### **🙏 Special Thanks**
- **IRM Systems** for providing industry domain expertise and internship opportunity
- **React Team** for the excellent frontend framework and documentation  
- **Node.js Community** for the robust backend ecosystem
- **TypeScript Team** for type safety and developer experience improvements
- **Open Source Community** for the amazing libraries and tools used in this project

### **📚 Educational Resources**
- Pipeline integrity management industry standards
- Risk assessment methodologies in oil & gas
- Machine learning applications in industrial safety
- Real-time data visualization best practices

---

## 🌟 **Ready to Explore Pipeline Risk Assessment?**

### **👨‍💻 Developer Portfolio Project**
This application showcases modern full-stack development skills with real-world industry applications. Built to demonstrate proficiency in:

- ⚛️ **React/TypeScript** frontend development
- 🟢 **Node.js/Express** backend architecture  
- 📊 **Data processing** and visualization
- 🤖 **AI/ML** integration concepts
- 🎨 **Professional UI/UX** design
- ⚡ **Real-time** communication systems

### **🚀 Get Started in 2 Minutes**
```bash
# Clone and setup
git clone https://github.com/yourusername/pipeline-risk-dashboard.git
cd pipeline-risk-dashboard

# Install and run backend  
cd backend && npm install && npm run dev &

# Install and run frontend
cd frontend && npm install && npm run dev

# Open http://localhost:3000 and start exploring! 🎉
```

**Built with ❤️ for Pipeline Integrity Management | Showcasing Full-Stack Development Excellence**
