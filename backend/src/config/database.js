const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

let sequelize;

if (env === 'development' || env === 'test') {
  // SQLite for development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: console.log,
    define: {
      timestamps: true,
      underscored: false,
    },
  });
} else {
  // PostgreSQL for production
  sequelize = new Sequelize(
    process.env.DB_NAME || 'shiva_scm',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      define: {
        timestamps: true,
        underscored: false,
      },
    }
  );
}

module.exports = sequelize;
