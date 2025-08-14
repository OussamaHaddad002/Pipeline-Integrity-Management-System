# Pipeline Risk Assessment Dashboard

A comprehensive pipeline integrity management system for the oil & gas industry, featuring real-time monitoring, AI-powered risk prediction, and interactive visualization.

## 🚀 Features

### Core Capabilities
- **Interactive Map Visualization** - Real-time pipeline network display with risk-based color coding
- **AI-Powered Risk Prediction** - Machine learning models for failure probability assessment
- **Real-time Monitoring** - WebSocket-based live updates and alerts
- **Comprehensive Risk Assessment** - Multi-factor risk scoring and analysis
- **Spatial Analysis** - PostGIS-powered geographic queries and analysis
- **Dashboard Analytics** - Key performance indicators and trend analysis
- **Data Import/Export** - CSV and GeoJSON format support
- **Mobile Responsive** - Optimized for field use on mobile devices

### Technical Excellence
- **Production-Ready Architecture** - Microservices with Docker containerization
- **Type Safety** - Full TypeScript implementation across frontend and backend
- **Security First** - JWT authentication, input validation, rate limiting
- **Performance Optimized** - Spatial indexing, caching, and efficient queries
- **Scalable Design** - Horizontal scaling support with load balancing
- **Comprehensive Testing** - Unit tests and integration test coverage

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Node.js Backend │    │  Python AI/ML   │
│   (TypeScript)   │◄──►│   (Express.js)   │◄──►│   Service       │
│   Port: 3000     │    │   Port: 5000     │    │   Port: 8000    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 ▼
                    ┌─────────────────┐
                    │  PostgreSQL +   │
                    │    PostGIS      │
                    │   Port: 5432    │
                    └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **React 18+** with TypeScript for type-safe UI development
- **Tailwind CSS** for responsive and modern styling
- **Leaflet** for interactive map visualization
- **Recharts** for data visualization and analytics
- **Socket.io Client** for real-time updates
- **Vite** for fast development and optimized builds

### Backend
- **Node.js** with Express.js framework
- **TypeScript** for type safety and developer experience
- **Socket.io** for WebSocket communication
- **Winston** for structured logging
- **Helmet** and security middleware
- **Rate limiting** and CORS protection

### Database
- **PostgreSQL 15.13-3** for robust data storage
- **PostGIS 3.4.2** for spatial data and geographic queries
- **Spatial indexing** for optimized geographic operations
- **Materialized views** for dashboard performance

### AI/ML
- **Python 3.11+** with scikit-learn
- **Random Forest** and Gradient Boosting models
- **Feature engineering** and advanced analytics
- **Model versioning** and confidence scoring
- **Flask API** for model serving

### DevOps
- **Docker** containerization for all services
- **Docker Compose** for local development
- **Multi-stage builds** for optimized images
- **Health checks** for service monitoring
- **Volume persistence** for data storage

## 📋 Prerequisites

- **Docker** 20.10+ and Docker Compose 2.0+
- **Node.js** 18+ (for local development)
- **Python** 3.11+ (for AI model development)
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/pipeline-risk-dashboard.git
cd pipeline-risk-dashboard
```

### 2. Environment Setup
```bash
# Copy environment templates
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Edit environment variables as needed
nano .env
```

### 3. Start with Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 4. Initialize Database
```bash
# Run database migrations (first time only)
docker-compose exec backend npm run migrate

# Seed sample data
docker-compose exec backend npm run seed
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8000
- **Database**: localhost:5432

## 🔧 Development Setup

### Local Development (Alternative to Docker)

1. **Setup Database**
```bash
# Install PostgreSQL with PostGIS
# Ubuntu/Debian:
sudo apt-get install postgresql-15 postgresql-15-postgis-3

# Create database
sudo -u postgres createdb pipeline_risk
sudo -u postgres psql -d pipeline_risk -c "CREATE EXTENSION postgis;"
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database connection
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

4. **AI Model Setup**
```bash
cd ai-model
pip install -r requirements.txt
cp .env.example .env
python api_server.py
```

## 📊 Database Schema

### Core Tables
- **pipelines** - Pipeline infrastructure data with geometry
- **risk_factors** - Individual risk factors and measurements
- **risk_assessments** - Calculated risk scores and levels
- **predictions** - AI model predictions and confidence scores
- **incidents** - Historical incident and failure data
- **maintenance_records** - Maintenance scheduling and history

### Key Features
- **Spatial Indexes** - Optimized geographic queries
- **Materialized Views** - Fast dashboard metrics
- **Triggers** - Automatic timestamp updates
- **Constraints** - Data integrity and validation
- **Functions** - Custom risk calculation procedures

## 🤖 AI Model Details

### Features Used
- Pipeline age and installation date
- Material properties and specifications
- Environmental conditions (soil, temperature)
- Historical maintenance and incident data
- Corrosion rates and cathodic protection
- Operating conditions vs. design limits

### Model Architecture
- **Ensemble Approach** - Random Forest + Gradient Boosting
- **Feature Engineering** - Automated feature creation
- **Cross-Validation** - K-fold validation for robustness
- **Confidence Scoring** - Uncertainty quantification
- **Model Versioning** - Tracking and rollback capabilities

### Prediction Outputs
- Failure probability (0-1 scale)
- Confidence score (0-1 scale)
- Predicted failure date
- Risk level categorization
- Maintenance recommendations
- Feature importance ranking

## 🔒 Security Features

- **JWT Authentication** - Secure API access
- **Input Validation** - Joi schema validation
- **Rate Limiting** - API abuse prevention
- **CORS Protection** - Cross-origin request security
- **Helmet Security** - HTTP header protection
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - Input sanitization

## 📈 Performance Optimizations

### Database
- Spatial indexing with GIST
- Materialized views for metrics
- Connection pooling
- Query optimization

### Frontend
- Code splitting and lazy loading
- Asset optimization and compression
- Efficient re-rendering with React
- Service worker for caching

### Backend
- Response caching
- Database query optimization
- Async/await patterns
- Memory management

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test
npm run test:coverage

# Frontend tests
cd frontend
npm test
npm run test:coverage

# AI model tests
cd ai-model
pytest
pytest --cov=.
```

## 📤 API Documentation

### Core Endpoints

#### Pipelines
- `GET /api/pipelines` - List pipelines with pagination
- `GET /api/pipelines/:id` - Get specific pipeline
- `POST /api/pipelines` - Create new pipeline
- `PUT /api/pipelines/:id` - Update pipeline
- `DELETE /api/pipelines/:id` - Delete pipeline

#### Risk Assessment
- `GET /api/risk-assessments` - List assessments
- `POST /api/risk-assessments` - Create assessment
- `GET /api/risk-assessments/pipeline/:id` - Pipeline risk history

#### AI Predictions
- `POST /api/predictions/calculate` - Generate prediction
- `GET /api/predictions/pipeline/:id` - Get predictions

#### Spatial Queries
- `GET /api/spatial/nearby/:lat/:lng/:radius` - Find nearby pipelines
- `GET /api/spatial/intersects` - Bounding box queries

### WebSocket Events
- `pipeline:updated` - Pipeline data changes
- `risk:calculated` - New risk assessment
- `incident:created` - New incident reported
- `alert:critical` - Critical alert notifications

## 🐳 Docker Configuration

### Services
- **frontend** - React app with Nginx
- **backend** - Node.js API server
- **ai-model** - Python ML service
- **database** - PostgreSQL with PostGIS
- **cache** - Redis for session storage
- **nginx** - Reverse proxy (production)

### Volumes
- **postgres_data** - Database persistence
- **redis_data** - Cache persistence
- **ai_models** - ML model storage

## 🌍 Environment Variables

### Backend (.env)
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/pipeline_risk
JWT_SECRET=your-super-secret-key
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
PYTHON_API_URL=http://localhost:8000
```

### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000
REACT_APP_MAP_TILES_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### AI Model (.env)
```bash
FLASK_ENV=production
DATABASE_URL=postgresql://user:pass@localhost:5432/pipeline_risk
MODEL_PATH=/app/models
LOG_LEVEL=info
```

## 🚀 Deployment

### AWS Deployment
1. Set up EC2 instances or ECS clusters
2. Configure RDS for PostgreSQL with PostGIS
3. Set up ALB for load balancing
4. Configure CloudFront for CDN
5. Set up S3 for static assets and backups

### Production Checklist
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database backups scheduled
- [ ] Log monitoring configured
- [ ] Health checks enabled
- [ ] Performance monitoring active
- [ ] Security scanning completed

## 📝 Sample Data

The system includes comprehensive sample data generation:
- 50+ realistic pipeline segments
- Geographic coordinates across different regions
- Various risk factors and severity levels
- Historical incident data
- Environmental conditions
- Maintenance records

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Write comprehensive tests
- Document API changes
- Update README for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Common Issues

**Database Connection Issues**
```bash
# Check if PostgreSQL is running
docker-compose ps database

# View database logs
docker-compose logs database

# Reset database
docker-compose down -v
docker-compose up -d database
```

**Frontend Build Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**AI Model Loading Issues**
```bash
# Check Python dependencies
pip install -r requirements.txt

# Verify model files
ls -la models/

# Retrain model if needed
python risk_predictor.py
```

### Getting Help
- 📧 Email: support@irm-systems.com
- 📝 Issues: [GitHub Issues](https://github.com/your-org/pipeline-risk-dashboard/issues)
- 📚 Documentation: [Wiki](https://github.com/your-org/pipeline-risk-dashboard/wiki)

## 🏆 Acknowledgments

- IRM Systems for domain expertise
- PostGIS community for spatial database capabilities
- React and Node.js communities for excellent frameworks
- Open source contributors for various libraries used

---

**Built with ❤️ for Pipeline Integrity Management**
