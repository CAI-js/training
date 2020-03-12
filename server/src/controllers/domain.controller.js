const database = require('../core/database');
const { ensureAgentById, stringToTag } = require('./controller-utils');
const { idField, Collections } = require('./constants');

async function domainExistsByTag(agentId, tag) {
  const domains = await database.find(Collections.Domain, { agentId, tag });
  return domains && domains.length > 0;
}

function getDomainsByAgent(agentId) {
  return database.find(Collections.Domain, { agentId });
}

async function findDomains(req, res) {
  const agent = await ensureAgentById(req, res);
  if (agent) {
    const domains = await getDomainsByAgent(agent[idField].toString());
    res.send(domains);
  }
}

async function findDomainById(req, res) {
  const agent = await ensureAgentById(req, res);
  if (agent) {
    const agentId = agent[idField].toString();
    const { domainId } = req.params;
    if (!domainId) {
      return res.status(400).send('Domain id is mandatory');
    }
    const domain = await database.findById(Collections.Domain, domainId);
    if (!domain || domain.agentId !== agentId) {
      return res.status(404).send('Domain not found');
    }
    return res.send(domain);
  }
  return true;
}

async function createDomain(req, res) {
  const agent = await ensureAgentById(req, res);
  if (agent) {
    if (!agent.canWrite) {
      return res.status(401).send('You have no rights to modify this bot');
    }
    const { name } = req.body;
    const tag = stringToTag(name);
    const alreadyExists = await domainExistsByTag(agent[idField], tag);
    if (alreadyExists) {
      return res.status(409).send('Domain with same tag already exists');
    }
    const domain = {
      name,
      tag,
      agentId: agent[idField].toString(),
      language: req.body.language || 'en',
    };
    const result = await database.insertOne(Collections.Domain, domain);
    return res.status(200).send(result);
  }
  return true;
}

async function updateDomain(req, res) {
  const agent = await ensureAgentById(req, res);
  if (agent) {
    if (!agent.canWrite) {
      return res.status(401).send('You have no rights to modify this bot');
    }
    const { domainId } = req.params;
    if (!domainId) {
      return res.status(400).send('Domain id is mandatory');
    }
    const agentId = agent[idField];
    const domain = await database.findById(Collections.Domain, domainId);
    // TODO: Always returns 404 because domain.agentId is string and angentId is Object
    if (!domain || domain.agentId !== agentId) {
      return res.status(404).send('Domain not found');
    }
    const newDomain = {
      _id: domain[idField],
      name: domain.name,
      tag: domain.tag,
      agentId: domain.agentId,
      language:
        req.body.language && req.body.language !== 'null'
          ? req.body.language
          : domain.language,
    };
    await database.save(Collections.Domain, newDomain);
    const resultDomain = await database.findById(Collections.Domain, domainId);
    return res.status(200).send(resultDomain);
  }
  return true;
}

async function deleteDomain(req, res) {
  const agent = await ensureAgentById(req, res);
  if (agent) {
    if (!agent.canWrite) {
      return res.status(401).send('You have no rights to modify this bot');
    }
    const { domainId } = req.params;
    if (!domainId) {
      return res.status(400).send('Domain id is mandatory');
    }
    const agentId = agent[idField];
    const domain = await database.findById(Collections.Domain, domainId);
    // TODO: Always returns 404 because domain.agentId is string and angentId is Object
    if (!domain || domain.agentId !== agentId) {
      return res.status(404).send('Domain not found');
    }
    await database.removeById(Collections.Domain, domainId);
    await database.remove(Collections.Intent, { domainId });
    return res.status(200).send();
  }
  return true;
}

module.exports = {
  findDomains,
  findDomainById,
  createDomain,
  updateDomain,
  deleteDomain,
};
