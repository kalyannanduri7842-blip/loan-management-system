.PHONY: install start build dev docker-build docker-run

install:
	cd backend && npm install
	cd frontend && npm install

start:
	cd backend && npm start

dev:
	cd backend && npm run dev & cd frontend && npm run dev

build:
	cd frontend && npm run build

docker-build:
	docker build -t fintech-loan-app .

docker-run:
	docker-compose up
