# 💰 Kalyan Institutional Loan Management Platform

**Kalyan Institutional Loan Management Platform** is a full-stack, enterprise-grade fintech application engineered for retail and institutional lending, microfinance management, automated underwriting, credit bureau risk scoring, multi-tier approval hierarchies, and automated EMI disbursement workflows.

---

## 📋 Table of Contents
- [Key Functional Roles & Workflows](#-key-functional-roles--workflows)
- [Dependencies](#-dependencies)
- [Installation](#-installation)
- [Build](#-build)
- [Run](#-run)
- [Usage & Demo Credentials](#-usage--demo-credentials)
- [Testing](#-testing)
- [Docker Deployment](#-docker-deployment)
- [Makefile Commands](#-makefile-commands)
- [Architecture & Modular Services](#-architecture--modular-services)
- [License](#-license)

---

## 🌟 Key Functional Roles & Workflows

1. **Customer Portal**:
   - Apply for Personal, Home, Auto, Education, and Business loans.
   - Real-time loan calculator with dynamic EMI schedule generation.
   - Application status tracker, document upload (Aadhaar/PAN/Salary Slip), and online installment payments.
2. **Employee (Credit Officer) Verification Workspace**:
   - Audit KYC documents, verify income statements, assess debt-to-income ratio (DTI), and submit credit recommendation.
3. **Manager Sanction & Disbursement Cockpit**:
   - Review credit officer audit notes, adjust sanctioned amounts, configure interest rates, and execute simulated bank disbursements.
4. **Administrator Platform Governance**:
   - Global portfolio overview, active NPA tracking, loan recovery metrics, and immutable security audit logs.

---

## 📦 Dependencies

The platform requires the following runtime dependencies:

- **Node.js**: `v18.0.0` or higher (v20+ recommended)
- **npm**: `v9.0.0` or higher
- **Docker** (Optional for containerization): `Docker Engine 20.10+` and `Docker Compose v2+`
- **Optional Python**: `python >= 3.8` (if using virtual environments: `python -m venv venv`)

---

## ⚙️ Installation

To install all platform dependencies, clone the repository and run:

```bash
# Install core dependencies
npm install

# Alternatively using clean install for CI/CD
npm ci
```

If setting up an optional Python microservice environment:
```bash
# Create python virtual environment (optional)
python -m venv venv
# Activate on Windows: .\venv\Scripts\activate
# Activate on Linux/macOS: source venv/bin/activate
```

---

## 🔨 Build

To compile and verify all platform assets and validate production database schemas:

```bash
# Build and verify application assets
npm run build
```

Using Docker to build the container image:
```bash
# Build container image
docker build -t kalyan-loan-platform:latest .
```

---

## 🚀 Run

You can launch the complete application stack using any of the following methods:

### Method 1: Unified Application Launcher (Recommended)
```bash
npm start
# Launches the unified API service on http://127.0.0.1:8080
```

### Method 2: Development Mode
```bash
npm run dev
# Starts backend server with verbose live logging
```

### Method 3: Separate Frontend & Backend Services
```bash
# Terminal 1: Backend API Server (Port 8080)
node backend/server.js

# Terminal 2: Frontend Web Platform (Port 5173)
cd frontend && npm run dev
```

---

## 👥 Usage & Demo Credentials

Once running, access the web client at **http://localhost:5173** (or API directly at **http://127.0.0.1:8080**).

### Local Development Login Credentials

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| 👑 **Administrator** | `admin@demo.com` | `123456` | Global audit trails, employee management, system settings |
| 👔 **Branch Manager** | `manager@demo.com` | `123456` | Loan sanctioning, interest rate determination, disbursement |
| 📋 **Credit Officer** | `employee@demo.com` | `123456` | KYC audit, income verification, credit scoring recommendation |
| 👤 **Customer (Rahul)** | `customer@demo.com` | `123456` | Loan application, EMI schedule, online payments |

### Key API Endpoints (Guaranteed JSON Responses)

- `GET  /` — Discovery endpoint and API health status
- `GET  /api/health` — Platform health check and active loan metrics
- `POST /api/auth/login` — User authentication and role JWT generation
- `GET  /api/public/loan-types` — Directory of eligible loan products & interest rates
- `POST /api/customer/apply` — Submit multi-step loan application
- `POST /api/employee/applications/:id/recommend` — Credit officer recommendation
- `POST /api/manager/applications/:id/approve` — Manager sanction & rate configuration
- `POST /api/manager/applications/:id/disburse` — Execute loan fund disbursement
- `POST /api/customer/loans/:id/pay-emi` — Process online EMI installment payment

---

## 🧪 Testing

Execute the automated test suites covering EMI math, role-based authorization, and full 4-role application lifecycles:

```bash
# Run all unit and integration tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

---

## 🐳 Docker Deployment

To run containerized Kalyan Loan Platform in production:

```bash
# Build the Docker image
docker build -t kalyan-loan-platform:latest .

# Run the container
docker run -d -p 8080:8080 -p 5173:5173 --name kalyan-loan-app kalyan-loan-platform:latest

# Or launch with Docker Compose
docker compose up -d
```

---

## 🛠️ Makefile Commands

For standard POSIX/UNIX development workflows, use the provided `Makefile`:

```bash
make install          # Install dependencies
make build            # Build project assets
make run              # Start application server
make test             # Run test suites
make lint             # Verify code quality
make docker-build     # Build Docker container image
```

---

## 🏛️ Architecture & Modular Services

Kalyan Loan Management Platform is structured into modular enterprise financial domain services:

- **Underwriting & Risk Engine**: DTI calculations, credit threshold filters, and risk grading.
- **Credit Bureau CIBIL Gateway**: Historical score simulator and delinquency analysis.
- **KYC Document OCR Service**: Automated identity document validation and fraud detection.
- **Disbursement NEFT Gateway**: Simulated fund transfers with bank reference generation.
- **EMI NACH Mandate Service**: Amortization schedules, late fee calculations, and automated deductions.
- **Delinquency & NPA Recovery**: 30/60/90-day overdue aging buckets and legal notice generators.
- **RBI Regulatory Compliance**: Statutory audit logging, data retention, and reporting.

---

## 📄 License

Proprietary enterprise software. (C) 2026 Kalyan Financial Technologies Inc. All rights reserved.
