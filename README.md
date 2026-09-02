# Fintech Loan Management System

A comprehensive, high-scale loan management system designed to handle the entire lifecycle of loan origination, review, approval, disbursement, and EMI tracking.

## Architecture

This project is structured as a full-stack Javascript application:
- **Frontend**: React, Vite, Tailwind CSS (running on port 5173)
- **Backend**: Node.js, Express (running on port 5000)
- **Data**: Handled via mock JSON database / in-memory storage for rapid prototyping.

## Dependencies

- **Node.js**: v16+
- **NPM**: v8+
- (Optional) **Docker** & **Docker Compose**

## Installation

You can install all dependencies using the provided Makefile:

```bash
make install
```
Alternatively, install them manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

## Usage & Run Instructions

### Running Locally for Development

To start both the frontend and backend concurrently:
```bash
make dev
```
- Frontend will be available at `http://localhost:5173`
- Backend API will be available at `http://localhost:5000`

### Building for Production

To create a production build of the frontend:
```bash
make build
```

### Running with Docker

This project includes a full Docker setup. 

To build the Docker image:
```bash
make docker-build
```

To run the full stack via Docker Compose:
```bash
make docker-run
# or
docker-compose up
```

## Features
- **Customer Portal**: Loan application, EMI schedule, Document upload
- **Admin Portal**: Application review, Disbursement management, Notification center
- **Security**: Role-based access control (Admin vs Customer)
