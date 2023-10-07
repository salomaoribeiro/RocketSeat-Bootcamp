import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';

import databaseConfig from '../config/database';

// models
import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

const models = [User, File, Appointment];
const MONGO_URL = 'mongodb://localhost:27017/gobarber';

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map((model) => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(MONGO_URL);
  }
}

export default new Database();
