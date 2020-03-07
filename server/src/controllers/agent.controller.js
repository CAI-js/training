const database = require('../core/database');
const {
  getAgentsFiltered,
  getAgentByIdFiltered,
  ensureAgentById,
  stringToTag,
} = require('./controller-utils');
const { idField, Collections } = require('./constants');

async function agentExistsByTag(tag) {
  const agents = await database.find(Collections.Agent, { tag });
  return agents && agents.length > 0;
}

async function findAllAgents(req, res) {
  const agents = await getAgentsFiltered(req.user.email, req.user.isAdmin);
  return res.send(agents);
}

async function findAgentById(req, res) {
  const agent = await ensureAgentById(req, res);
  if (agent) {
    res.send(agent);
  }
}

async function createAgent(req, res) {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send('Agent name is mandatory');
  }
  const tag = stringToTag(name);
  const alreadyExists = await agentExistsByTag(tag);
  if (alreadyExists) {
    return res.status(409).send('Agent with same tag already exists');
  }
  const agent = {
    name,
    description: req.body.description || name,
    tag,
    owner: req.user.email,
    writers: req.body.writers || [],
    readers: req.body.readers || [],
    status: 'Never Trained',
  };
  const result = await database.insertOne(Collections.Agent, agent);
  return res.status(200).send(result);
}

async function updateAgent(req, res) {
  const agent = await ensureAgentById(req, res);
  if (agent) {
    if (!agent.isOwner) {
      return res.status(401).send('Only owner of a bot can modify it');
    }
    const newAgent = {
      _id: agent[idField],
      name: agent.name,
      description:
        req.body.description && req.body.description !== 'null'
          ? req.body.description
          : agent.description,
      tag: agent.tag,
      owner:
        req.body.owner && req.body.owner !== 'null'
          ? req.body.owner
          : agent.owner,
      writers:
        req.body.writers && req.body.writers !== 'null'
          ? req.body.writers
          : agent.writers,
      readers:
        req.body.readers && req.body.readers !== 'null'
          ? req.body.readers
          : agent.readers,
      status: agent.status || 'Never Trained',
    };
    await database.save(Collections.Agent, newAgent);
    const result = await getAgentByIdFiltered(
      newAgent[idField],
      req.user.email,
      req.user.isAdmin
    );
    return res.status(200).send(result);
  }
  return true;
}

async function deleteAgent(req, res) {
  const agent = await ensureAgentById(req, res);
  if (agent) {
    if (!agent.isOwner) {
      return res.status(401).send('Only owner of a bot can modify it');
    }
    const agentId = agent[idField];
    await database.removeById(Collections.Agent, agentId);
    await database.remove(Collections.Domain, { agentId });
    await database.remove(Collections.Intent, { agentId });
    await database.remove(Collections.Entity, { agentId });
    return res.status(200).send('done');
  }
  return true;
}

module.exports = {
  findAllAgents,
  findAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
};
