const MongodbAdapter = require('./mongodb-adapter');
const MemorydbAdapter = require('./memorydb-adapter');
const Collection = require('./collection');

class Database {
  constructor() {
    this.collections = {};
  }

  static getEngine(settings) {
    switch (settings.engine) {
      case 'mongodb':
        return new MongodbAdapter(settings);
      case 'memory':
        return new MemorydbAdapter(settings);
      default:
        return new MongodbAdapter(settings);
    }
  }

  getCollection(name) {
    if (!this.collections[name]) {
      this.collections[name] = new Collection(this, name);
    }
    return this.collections[name];
  }

  initialize(settings = { engine: 'mongodb' }) {
    if (!this.engine) {
      this.engine = Database.getEngine(settings);
    }
  }

  connect() {
    return this.engine.connect();
  }

  disconnect() {
    return this.engine.disconnect();
  }

  find(name, condition) {
    return this.engine.find(name, condition);
  }

  findOne(name, condition) {
    return this.engine.findOne(name, condition);
  }

  findById(name, id) {
    return this.engine.findById(name, id);
  }

  insertOne(name, item) {
    return this.engine.insertOne(name, item);
  }

  insertMany(name, items) {
    return this.engine.insertMany(name, items);
  }

  update(name, item) {
    return this.engine.update(name, item);
  }

  save(name, item) {
    return this.engine.save(name, item);
  }

  remove(name, condition, justOne) {
    return this.engine.remove(name, condition, justOne);
  }

  removeById(name, id) {
    return this.engine.removeById(name, id);
  }
}

const instance = new Database();

module.exports = instance;
