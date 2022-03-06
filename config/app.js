require('dotenv').config();

const config = { 
  port: process.env.PORT|| 3001,
  pgUser: process.env.PGUSER || 'selectel',
  pgHost: process.env.PGHOST || '0.0.0.0',
  pgDatabase: process.env.PGDATABASE || 'selectel',
  pgPassword: process.env.PGPASSWORD || 'postgres',
  pgPort: process.env.PGPORT || 5432,
}

module.exports = config;
