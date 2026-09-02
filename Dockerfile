FROM node:18-alpine
WORKDIR /app
COPY . .
RUN cd backend && npm install
RUN cd frontend && npm install
EXPOSE 5000 5173
CMD ["sh", "-c", "cd backend && npm start & cd frontend && npm run dev -- --host"]
