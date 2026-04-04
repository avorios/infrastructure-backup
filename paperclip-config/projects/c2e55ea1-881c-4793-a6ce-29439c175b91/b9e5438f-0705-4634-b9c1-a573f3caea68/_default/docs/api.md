# HITCO Workforce Management API

A lightweight, vanilla Node.js HTTP API for managing agents and tasks in the HITCO workforce management system.

## Getting Started

### Prerequisites

- Node.js 18 or later

### Running the Server

```bash
npm start
```

The server starts on `http://localhost:3000` by default.

### Quick Test

```bash
curl http://localhost:3000/health
```

## Base URL

All API endpoints are served under:

```
http://localhost:3000
```

## Endpoints

### Health Check

Check that the server is running.

```
GET /health
```

**Response** `200 OK`

```json
{
  "status": "ok"
}
```

---

### Agents

Manage workforce agents — the units of work capacity in the system.

#### List Agents

```
GET /api/agents
```

**Response** `200 OK`

```json
[
  {
    "id": "a1b2c3",
    "name": "Backend Developer",
    "role": "engineer",
    "status": "active",
    "createdAt": "2026-04-03T12:00:00.000Z"
  }
]
```

#### Create Agent

```
POST /api/agents
Content-Type: application/json
```

**Request Body**

| Field  | Type   | Required | Description                  |
|--------|--------|----------|------------------------------|
| name   | string | yes      | Display name of the agent    |
| role   | string | yes      | Role (e.g. `engineer`, `qa`) |
| status | string | no       | Defaults to `active`         |

**Example**

```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{"name": "QA Engineer", "role": "qa"}'
```

**Response** `201 Created`

```json
{
  "id": "d4e5f6",
  "name": "QA Engineer",
  "role": "qa",
  "status": "active",
  "createdAt": "2026-04-03T12:05:00.000Z"
}
```

---

### Tasks

Track and manage work items assigned to agents.

#### List Tasks

```
GET /api/tasks
```

**Response** `200 OK`

```json
[
  {
    "id": "t1u2v3",
    "title": "Scaffold server",
    "status": "in_progress",
    "assigneeId": "a1b2c3",
    "createdAt": "2026-04-03T12:10:00.000Z"
  }
]
```

#### Create Task

```
POST /api/tasks
Content-Type: application/json
```

**Request Body**

| Field      | Type   | Required | Description                                          |
|------------|--------|----------|------------------------------------------------------|
| title      | string | yes      | Short description of the task                        |
| status     | string | no       | Defaults to `todo`. Values: `todo`, `in_progress`, `done` |
| assigneeId | string | no       | ID of the agent assigned to this task                |

**Example**

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Write tests", "assigneeId": "a1b2c3"}'
```

**Response** `201 Created`

```json
{
  "id": "w4x5y6",
  "title": "Write tests",
  "status": "todo",
  "assigneeId": "a1b2c3",
  "createdAt": "2026-04-03T12:15:00.000Z"
}
```

---

## Error Handling

All errors return a JSON body with a `message` field:

```json
{
  "message": "Agent not found"
}
```

| Status Code | Meaning                          |
|-------------|----------------------------------|
| 400         | Bad request (missing/invalid fields) |
| 404         | Resource not found               |
| 405         | Method not allowed               |
| 500         | Internal server error            |

## Data Storage

The API currently uses an **in-memory data store**. Data does not persist across server restarts. This is suitable for development and prototyping.

## Architecture Notes

- **No framework** — built on the Node.js `http` module directly.
- **Single entry point** — `server.js` handles routing and request dispatch.
- **JSON only** — all request and response bodies are JSON (`Content-Type: application/json`).
