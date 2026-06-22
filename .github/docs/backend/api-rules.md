# API Rules

Requests

- Validate inputs.
- Use existing DTO patterns.

Responses

- Preserve current response format.
- Maintain HTTP status codes.

Errors

- Follow existing error handling.
- Reuse middleware.

Changes

- Modify existing endpoints before creating new ones.
- Avoid breaking existing consumers.