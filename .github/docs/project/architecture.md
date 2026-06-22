# Architecture

Frontend
- Angular

Backend
- Node.js + Express

Database
- MongoDB

Flow

Angular
↓
REST API
↓
Express Controllers
↓
Services
↓
MongoDB

Principles

- Thin controllers.
- Business logic in services.
- Repositories/models handle database access.
- Preserve current structure.