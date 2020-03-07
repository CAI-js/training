class Collection {
  constructor(db, name) {
    this.db = db;
    this.name = name;
  }

  find(condition) {
    return this.db.find(this.name, condition);
  }

  findOne(condition) {
    return this.db.findOne(this.name, condition);
  }

  findById(id) {
    return this.db.findById(this.name, id);
  }

  insertOne(item) {
    return this.db.insertOne(this.name, item);
  }

  insertMany(items) {
    return this.db.insertMany(this.name, items);
  }

  update(item) {
    return this.db.update(this.name, item);
  }

  save(item) {
    return this.db.save(this.name, item);
  }

  remove(condition, justOne) {
    return this.db.remove(this.name, condition, justOne);
  }

  removeById(id) {
    return this.db.removeById(this.name, id);
  }
}

module.exports = Collection;
