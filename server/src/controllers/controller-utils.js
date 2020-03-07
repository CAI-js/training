const database = require('../core/database');
const { Collections } = require('./constants');

async function getAgents() {
  return database.find(Collections.Agent);
}

async function getAgentById(id) {
  return database.findById(Collections.Agent, id);
}

function applyFilter(agent, email, isAdmin = false) {
  if (agent.owner === email || isAdmin) {
    return { ...agent, isOwner: true, canWrite: true };
  }
  if (agent.writers && agent.writers.includes(email)) {
    return { ...agent, isOwner: false, canWrite: true };
  }
  if (agent.readers && agent.readers.includes(email)) {
    return { ...agent, isOwner: false, canWrite: false };
  }
  return undefined;
}

async function getAgentsFiltered(email, isAdmin) {
  const agents = await getAgents();
  const filtered = agents
    .map(x => applyFilter(x, email, isAdmin))
    .filter(x => x);
  return filtered;
}

async function getAgentByIdFiltered(id, email, isAdmin) {
  const agent = await getAgentById(id);
  const filtered = applyFilter(agent, email, isAdmin);
  return filtered;
}

function stringToTag(name) {
  return name.toLowerCase().replace(/[^A-Z0-9]+/gi, '_');
}

async function ensureAgentById(req, res) {
  const { agentId } = req.params;
  if (!agentId) {
    res.status(400).send('Agent id is mandatory');
    return undefined;
  }
  const agent = await getAgentByIdFiltered(
    agentId,
    req.user.email,
    req.user.isAdmin
  );
  if (!agent) {
    res.status(404).send('Agent not found');
    return undefined;
  }
  return agent;
}

module.exports = {
  getAgents,
  getAgentById,
  getAgentsFiltered,
  getAgentByIdFiltered,
  stringToTag,
  ensureAgentById,
};
