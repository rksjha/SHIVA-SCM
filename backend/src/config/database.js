const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Railway provides DATABASE_URL automatically when you add a PostgreSQL plugin
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else if (
  process.env.DB_HOST ||
  process.env.NODE_ENV === 'production'
) {
  // Manual PostgreSQL config (local Docker or other cloud)
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
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
} else {
  // Development: PostgreSQL (requires Docker — run `docker-compose up -d db`)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'shiva_scm',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'shivascm2025',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.DB_LOGGING === 'true' ? console.log : false,
      define: {
        timestamps: true,
        underscored: false,
      },
    }
  );
}

module.exports = sequelize;
