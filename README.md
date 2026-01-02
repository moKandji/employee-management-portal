# Employee Management Portal / Portail de gestion des employés

## English

### Overview
A pragmatic, full-stack application for managing employees, departments, and access requests. It showcases enterprise-ready CRUD, audit trail fields, simple workflow management, JWT authentication, and a KPI dashboard suitable for banking, insurance, private, and public sector contexts.

### Features
- Employee, Department, and Access Request CRUD
- Role-based access control (Admin, Manager, Viewer)
- Workflow transitions for access requests
- Audit trail fields (CreatedAt, UpdatedAt, UpdatedBy)
- KPI dashboard (active employees, pending requests, status counts)
- Clean Architecture backend (Domain, Application, Infrastructure, Server)
- Angular standalone components with Angular Material
- Dockerized SQL Server, API, and frontend

### Tech Stack
- Backend: ASP.NET Core Web API (.NET 8), EF Core, SQL Server, FluentValidation, JWT
- Frontend: Angular (standalone), Angular Material, Reactive Forms
- DevOps: Docker, GitHub Actions

### Quick Start (Docker)
```bash
cp .env.example .env
docker compose up --build
```

Open:
- API: http://localhost:5000/swagger (development)
- Frontend: http://localhost:4200

### Local Development
Backend:
```bash
cd backend
# Apply migrations manually in your environment if needed
# dotnet ef database update --project src/EmployeeManagement.Infrastructure --startup-project src/EmployeeManagement.Server

dotnet restore EmployeeManagement.sln
dotnet run --project src/EmployeeManagement.Server
```

Frontend:
```bash
cd frontend
npm install
npm start
```

### Demo Users
- admin / Password123! (Admin)
- manager / Password123! (Manager)
- viewer / Password123! (Viewer)

### API Base Path
All endpoints are available under `/api/v1`.

### Clean Architecture Overview
```
EmployeeManagement
├── Domain
├── Application
├── Infrastructure
└── Server
```

### Screenshots
Place screenshots in `/docs/screenshots`.

---

## Français

### Aperçu
Une application full-stack pragmatique qui permet de gérer des employés, des départements et les demandes d'accès. Elle démontre des compétences d'entreprise : CRUD, audit, workflow simple, authentification JWT et tableau de bord KPI — utile pour les secteurs bancaire, assurance, privé et public.

### Fonctionnalités
- CRUD pour employés, départements et demandes d'accès
- Contrôle d'accès basé sur les rôles (Admin, Manager, Viewer)
- Transitions de workflow pour les demandes d'accès
- Champs d'audit (CreatedAt, UpdatedAt, UpdatedBy)
- Tableau de bord KPI (employés actifs, demandes en attente, statuts)
- Backend en Clean Architecture (Domain, Application, Infrastructure, Server)
- Angular avec composants standalone et Angular Material
- SQL Server, API et frontend via Docker

### Stack technique
- Backend : ASP.NET Core Web API (.NET 8), EF Core, SQL Server, FluentValidation, JWT
- Frontend : Angular (standalone), Angular Material, formulaires réactifs
- DevOps : Docker, GitHub Actions

### Démarrage rapide (Docker)
```bash
cp .env.example .env
docker compose up --build
```

Ouvrir :
- API : http://localhost:5000/swagger (développement)
- Frontend : http://localhost:4200

### Développement local
Backend :
```bash
cd backend
# Appliquer les migrations si nécessaire
# dotnet ef database update --project src/EmployeeManagement.Infrastructure --startup-project src/EmployeeManagement.Server

dotnet restore EmployeeManagement.sln
dotnet run --project src/EmployeeManagement.Server
```

Frontend :
```bash
cd frontend
npm install
npm start
```

### Utilisateurs démo
- admin / Password123! (Admin)
- manager / Password123! (Manager)
- viewer / Password123! (Viewer)

### Base de l'API
Toutes les routes sont disponibles sous `/api/v1`.

### Aperçu de la Clean Architecture
```
EmployeeManagement
├── Domain
├── Application
├── Infrastructure
└── Server
```

### Captures d'écran
Placez les captures dans `/docs/screenshots`.
