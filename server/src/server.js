const { dock } = require('@nlpjs/basic');
const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');
const db = require('./core/database');
const { configurePassport } = require('./core/auth');
const mount = require('./routes');

class Server {
  constructor(settings = {}) {
    this.settings = settings;
  }

  get dock() {
    return this.defaultDock;
  }

  get logger() {
    return this.defaultDock.get('logger');
  }

  static async initializeDatabase() {
    db.initialize({ engine: process.env.DB_ENGINE });
    await db.connect();
  }

  async initializeExpress() {
    configurePassport(db, passport);
    this.port =
      this.settings.port || process.env.PORT || process.env.port || 3000;
    this.app = express();
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(passport.initialize());
    this.app.use('/public', express.static(`${process.cwd()}../public`));
    mount(this.app);
    this.app.use(function(error, req, res, next) {
      if (error.message) {
        return res.status(error.status || 500).json({ error: error.message });
      }
      return next();
    });
    this.app.use(function(req, res) {
      res.status(404).send('Sorry cant find that!');
    });

    this.app.listen(this.port, err => {
      if (err) {
        this.logger.error(err);
      } else {
        this.logger.info(`Server started on port ${this.port}`);
      }
    });
  }

  static async initializeBots() {
    // TODO
  }

  async start() {
    this.defaultDock = dock;
    await Server.initializeDatabase();
    await this.initializeExpress();
    await Server.initializeBots();
  }
}

const instance = new Server();

module.exports = instance;
