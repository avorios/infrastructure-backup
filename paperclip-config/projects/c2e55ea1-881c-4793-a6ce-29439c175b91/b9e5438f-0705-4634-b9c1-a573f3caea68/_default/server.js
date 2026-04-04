const http = require('http');

const PORT = process.env.PORT || 3000;

// --- In-memory data store ---
const store = {
  agents: [],
  tasks: [],
  _nextAgentId: 1,
  _nextTaskId: 1,
};

// --- Helpers ---
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function json(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function notFound(res) {
  json(res, 404, { error: 'Not found' });
}

// --- Route handlers ---
async function handleRequest(req, res) {
  const { method, url } = req;

  // Health check
  if (url === '/health' && method === 'GET') {
    return json(res, 200, { status: 'ok', uptime: process.uptime() });
  }

  // --- Agents ---
  if (url === '/api/agents' && method === 'GET') {
    return json(res, 200, store.agents);
  }

  if (url === '/api/agents' && method === 'POST') {
    const body = await parseBody(req);
    if (!body.name) {
      return json(res, 400, { error: 'name is required' });
    }
    const agent = {
      id: store._nextAgentId++,
      name: body.name,
      role: body.role || null,
      status: body.status || 'active',
      createdAt: new Date().toISOString(),
    };
    store.agents.push(agent);
    return json(res, 201, agent);
  }

  // --- Tasks ---
  if (url === '/api/tasks' && method === 'GET') {
    return json(res, 200, store.tasks);
  }

  if (url === '/api/tasks' && method === 'POST') {
    const body = await parseBody(req);
    if (!body.title) {
      return json(res, 400, { error: 'title is required' });
    }
    const task = {
      id: store._nextTaskId++,
      title: body.title,
      description: body.description || null,
      status: body.status || 'todo',
      assigneeId: body.assigneeId || null,
      priority: body.priority || 'medium',
      createdAt: new Date().toISOString(),
    };
    store.tasks.push(task);
    return json(res, 201, task);
  }

  notFound(res);
}

// --- Server ---
const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((err) => {
    console.error('Request error:', err);
    json(res, 500, { error: 'Internal server error' });
  });
});

server.listen(PORT, () => {
  console.log(`HITCO API server running on port ${PORT}`);
});
