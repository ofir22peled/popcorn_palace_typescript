# Popcorn Palace - Quick Setup

### Clone and Run Project

requirements:
NodeJS version 18.18 or Higher.
NestJS version 10 (As provided with the project)


The server will run at: http://localhost:3000
The swagger is available at: http://localhost:3000/api


Copy and paste the following commands in your terminal:

```bash
git clone https://github.com/ofir22peled/popcorn_palace_typescript.git
cd popcorn_palace_typescript
npm install

# Start PostgreSQL with Docker Compose (if needed)
docker compose up -d

# Setup Prisma
npx prisma generate
npx prisma migrate dev

# Run the application
npm run build
npm run start:dev
```

### Run Tests

```bash
npm run test
```
