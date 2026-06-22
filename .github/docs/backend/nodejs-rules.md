# Node.js Rules

Controllers

- Keep controllers thin.
- Validate request inputs.
- Delegate business logic to services.

Services

- Main location for business logic.
- Reuse existing methods.

Models

- Handle database access only.

General

- Modify existing APIs whenever possible.
- Avoid duplicate endpoints.
- Preserve response structure.
- Preserve backward compatibility.
- Follow existing async/await patterns.