const database = require('../core/database');
const { ensureAgentById, stringToTag } = require('./controller-utils');
const { idField, Collections } = require('./constants');

function getIntentsByAgent(agentId) {
  return database.find(Collections.Intent, { agentId });
}

function getIntentsByDomain(domainId) {
  return database.find(Collections.Intent, { domainId });
}

async function intentExistsByTag(agentId, domainId, tag) {
  const intents = await database.find(Collections.Intent, {
    agentId,
    domainId,
    tag,
  });
  return intents && intents.length > 0;
}

async function findIntents(req, res) {
  const agent = await ensureAgentById(req, res);
  if (agent) {
    const agentId = agent[idField].toString();
    let intents;
    const { domainId } = req.params;
    if (domainId) {
      const domain = await database.findById(Collections.Domain, domainId);
      if (!domain || domain.agentId !== agentId) {
        return res.status(404).send('Domain not found');
      }
      intents = await getIntentsByDomain(domainId);
    } else {
      intents = await getIntentsByAgent(agentId);
    }
    return res.send(intents);
  }
  return true;
}

async function findIntentById(req, res) {
  const agent = await ensureAgentById(req, res);
  if (agent) {
    const agentId = agent[idField].toString();
    const { intentId } = req.params;
    if (!intentId) {
      return res.status(400).send('Intent id is mandatory');
    }
    const intent = await database.findById(Collections.Intent, intentId);
    if (!intent || intent.agentId !== agentId) {
      return res.status(404).send('Intent not found');
    }
    const { domainId } = req.params;
    if (domainId) {
      const domain = await database.findById(Collections.Domain, domainId);
      if (
        !domain ||
        domain.agentId !== agentId ||
        intent.domainId !== domainId
      ) {
        return res.status(404).send('Intent not found');
      }
    }
    return res.send(intent);
  }
  return true;
}

async function createIntent(req, res) {
  const agent = await ensureAgentById(req, res);
  if (agent) {
    if (!agent.canWrite) {
      return res.status(401).send('You have no rights to modify this bot');
    }
    const { domainId } = req.body;
    if (!domainId) {
      return res.status(400).send('Domain id is mandatory');
    }
    const domain = await database.findById(Collections.Domain, domainId);
    const agentId = agent[idField].toString();
    if (!domain || agentId !== domain.agentId) {
      return res.status(404).send('Domain not found');
    }
    const { name } = req.body;
    const tag = stringToTag(name);
    const alreadyExists = await intentExistsByTag(agentId, domainId, tag);
    if (alreadyExists) {
      return res
        .status(409)
        .send('Intent with same tag already exists in this domain');
    }
    const intent = {
      name,
      tag,
      agentId,
      domainId,
      utterances: req.body.utterances || [],
      answers: req.body.answers || [],
      slots: req.body.slots || [],
    };
    const result = await database.insertOne(Collections.Intent, intent);
    return res.status(200).send(result);
  }
  return true;
}

async function updateIntent(req, res) {
  const agent = await ensureAgentById(req, res);
  if (agent) {
    if (!agent.canWrite) {
      return res.status(401).send('You have no rights to modify this bot');
    }
    const { intentId } = req.params;
    if (!intentId) {
      return res.status(400).send('Intent id is mandatory');
    }
    const agentId = agent[idField].toString();
    const intent = await database.findById(Collections.Intent, intentId);
    if (!intent || intent.agentId !== agentId) {
      return res.status(404).send('Intent not found');
    }
    const newIntent = {
      _id: intent[idField],
      name: intent.name,
      tag: intent.tag,
      agentId: agent[idField].toString(),
      domainId: req.body.domainId || intent.domainId,
      utterances: req.body.utterances || intent.utterances || [],
      answers: req.body.answers || intent.answers || [],
      slots: req.body.slots || [],
    };
    await database.save(Collections.Intent, newIntent);
    const resultIntent = await database.findById(Collections.Intent, intentId);
    return res.status(200).send(resultIntent);
  }
  return true;
}

async function deleteIntent(req, res) {
  const agent = await ensureAgentById(req, res);
  if (agent) {
    if (!agent.canWrite) {
      return res.status(401).send('You have no rights to modify this bot');
    }
    const { intentId } = req.params;
    if (!intentId) {
      return res.status(400).send('Intent id is mandatory');
    }
    const intent = await database.findById(Collections.Intent, intentId);
    if (!intent) {
      return res.status(404).send('Intent not found');
    }
    await database.remove(Collections.Intent, { intentId });
    return res.status(200).send();
  }
  return true;
}

module.exports = {
  findIntents,
  findIntentById,
  createIntent,
  updateIntent,
  deleteIntent,
};
