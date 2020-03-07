const { MongoClient, ObjectId } = require('mongodb');

const idField = '_id';

class MongodbAdapter {
  constructor(settings = {}) {
    this.settings = typeof settings === 'string' ? { url: settings } : settings;
    this.url =
      this.settings.url ||
      process.env.MONGO_URL ||
      'mongodb://localhost:27017/defaultdb';
    this.dbName = this.url.slice(this.url.lastIndexOf('/') + 1);
    this.mongoClient = new MongoClient(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.mongoClient.connect((err, client) => {
        if (err) {
          return reject(err);
        }
        this.client = client;
        this.db = this.client.db(this.dbName);
        return resolve();
      });
    });
  }

  disconnect() {
    if (this.client) {
      this.client.close();
    }
  }

  executeInCollection(name, fn) {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection(name);
      fn(collection, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  find(name, condition = {}) {
    return this.executeInCollection(name, (collection, cb) => {
      collection.find(condition).toArray((err, result) => {
        if (err) {
          return cb(err);
        }
        return cb(undefined, result);
      });
    });
  }

  findOne(name, condition = {}) {
    return this.executeInCollection(name, (collection, cb) => {
      collection.findOne(condition, (err, result) => {
        if (err) {
          return cb(err);
        }
        return cb(undefined, result);
      });
    });
  }

  findById(name, id) {
    let oId;
    try {
      oId = new ObjectId(id);
    } catch (err) {
      return null;
    }
    return this.findOne(name, { [idField]: oId });
  }

  remove(name, condition, justOne = false) {
    return this.executeInCollection(name, (collection, cb) => {
      if (justOne) {
        collection.deleteOne(condition, (err, result) => {
          if (err) {
            return cb(err);
          }
          return cb(undefined, result);
        });
      } else {
        collection.deleteMany(condition, (err, result) => {
          if (err) {
            return cb(err);
          }
          return cb(undefined, result);
        });
      }
    });
  }

  removeById(name, id) {
    let oId;
    try {
      oId = new ObjectId(id);
    } catch (err) {
      return null;
    }
    return this.remove(name, { [idField]: oId }, true);
  }

  insertOne(name, item) {
    return this.executeInCollection(name, (collection, cb) => {
      collection.insertOne(item, (err, result) => {
        if (err) {
          return cb(err);
        }
        return cb(undefined, result.ops[0]);
      });
    });
  }

  insertMany(name, items) {
    return this.executeInCollection(name, (collection, cb) => {
      collection.inserMany(items, (err, result) => {
        if (err) {
          return cb(err);
        }
        return cb(undefined, result);
      });
    });
  }

  async save(name, item) {
    const id = item[idField] ? item[idField].toString() : item.id;
    if (!id) {
      return this.insertOne(name, item);
    }
    const oldItem = await this.findById(name, id);
    if (oldItem) {
      return this.update(name, item);
    }
    return this.insertOne(name, item);
  }

  update(name, item) {
    const id = item[idField] ? item[idField].toString() : item.id;
    const query = { [idField]: new ObjectId(id) };
    const cloned = { ...item };
    delete cloned[idField];
    delete cloned.id;
    const newValues = { $set: cloned };
    return this.executeInCollection(name, (collection, cb) => {
      collection.updateOne(query, newValues, (err, result) => {
        if (err) {
          return cb(err);
        }
        return cb(undefined, result);
      });
    });
  }
}

module.exports = MongodbAdapter;
