const { uuid } = require('@nlpjs/basic');

const idField = '_id';

class MemorydbAdapter {
  constructor(settings = {}) {
    this.settings = settings;
    this.collections = {};
    console.log('Using memory DB');
  }

  connect() {
    this.collections = {};
    this.insertOne('users', {
      email: 'jseijas@gmail.com',
      password: '$2a$10$VbKw77ib1bzmkb/5JV4/6.bfomiVOZaBndDJEOM.QkTJPG5Oskyiy',
      isAdmin: true,
    });
    return Promise.resolve();
  }

  disconnect() {
    this.collections = {};
  }

  getCollection(name, autoCreate = true) {
    if (!this.collections[name] && autoCreate) {
      this.collections[name] = {};
    }
    return this.collections[name];
  }

  static match(item, condition, conditionKeys) {
    for (let i = 0; i < conditionKeys.length; i += 1) {
      const key = conditionKeys[i];
      if (item[key] !== condition[key]) {
        return false;
      }
    }
    return true;
  }

  find(name, condition = {}) {
    return new Promise(resolve => {
      const collection = this.getCollection(name);
      const keys = Object.keys(collection);
      const conditionKeys = Object.keys(condition);
      const result = [];
      for (let i = 0; i < keys.length; i += 1) {
        const item = collection[keys[i]];
        if (MemorydbAdapter.match(item, condition, conditionKeys)) {
          result.push(item);
        }
      }
      return resolve(result);
    });
  }

  findOne(name, condition = {}) {
    return new Promise(resolve => {
      this.find(name, condition).then(items => {
        return resolve(items[0]);
      });
    });
  }

  findById(name, id) {
    return new Promise(resolve => {
      const collection = this.getCollection(name);
      return resolve(collection[id]);
    });
  }

  innerInsertOne(name, item) {
    const newId = uuid();
    const clone = { ...item, [idField]: newId };
    const collection = this.getCollection(name);
    collection[newId] = clone;
    return clone;
  }

  insertOne(name, item) {
    return new Promise(resolve => resolve(this.innerInsertOne(name, item)));
  }

  insertMany(name, items) {
    return new Promise(resolve => {
      const result = [];
      for (let i = 0; i < items.length; i += 1) {
        result.push(this.innerInsertOne(name, items[i]));
      }
      return resolve(result);
    });
  }

  save(name, item) {
    return new Promise(resolve => {
      const oldItem = item[idField] ? this.findById(item[idField]) : undefined;
      if (oldItem) {
        return this.update(name, item).then(result => resolve(result));
      }
      return this.insertOne(name, item).then(result => resolve(result));
    });
  }

  update(name, item) {
    return new Promise((resolve, reject) => {
      const id = item[idField];
      const collection = this.getCollection(name);
      if (collection[id]) {
        collection[id] = item;
        return resolve(item);
      }
      return reject(new Error('Trying to update a non existing item'));
    });
  }

  remove(name, condition, justOne = false) {
    return new Promise(resolve => {
      const collection = this.getCollection(name);
      const collectionKeys = Object.keys(collection);
      const conditionKeys = Object.keys(condition);
      let result = 0;
      for (let i = 0; i < collectionKeys.length; i += 1) {
        const key = collectionKeys[i];
        if (MemorydbAdapter.match(collection[key], condition, conditionKeys)) {
          delete collection[key];
          if (justOne) {
            return resolve(1);
          }
          result += 1;
        }
      }
      return resolve(result);
    });
  }

  removeById(name, id) {
    return new Promise(resolve => {
      const collection = this.getCollection(name);
      if (collection[id]) {
        delete collection[id];
        return resolve(1);
      }
      return resolve(0);
    });
  }
}

module.exports = MemorydbAdapter;
