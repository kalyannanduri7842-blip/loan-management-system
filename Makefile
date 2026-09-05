# Makefile for Kalyan Institutional Loan Management Platform

.PHONY: help install build run start dev test test-unit test-integration lint clean docker-build docker-run

help:
	@echo "Kalyan Loan Management Commands:"
	@echo "  make install           - Install npm dependencies"
	@echo "  make build             - Build and verify application assets"
	@echo "  make start             - Start production API server"
	@echo "  make run               - Run full application stack (start alias)"
	@echo "  make dev               - Run development server"
	@echo "  make test              - Run unit and integration tests"
	@echo "  make test-unit         - Run unit test suite"
	@echo "  make test-integration  - Run integration test suite"
	@echo "  make lint              - Run lint checks"
	@echo "  make docker-build      - Build Docker container image"
	@echo "  make docker-run        - Run containerized application"

install:
	npm install

build:
	npm run build

start:
	node backend/server.js

run: start

dev:
	node backend/server.js

test:
	node --test tests/unit/*.test.js tests/integration/*.test.js

test-unit:
	node --test tests/unit/*.test.js

test-integration:
	node --test tests/integration/*.test.js

lint:
	npm run lint

clean:
	@echo "Cleaning temporary build cache and logs..."

docker-build:
	docker build -t kalyan-loan-platform:latest .

docker-run:
	docker run -p 8080:8080 -p 5173:5173 kalyan-loan-platform:latest
