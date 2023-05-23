const dbConfig = require('../config/dbConfig');

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DATABASE,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

sequelize.authenticate().then(() => {
    console.log('Successfully connected to the database');
}).catch((err) => {
    console.log(`Error connecting to the database: ${err.message}`);
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./userModel')(sequelize, DataTypes);
db.sequelize.sync({ force: false }).then(() => console.log('Resync is done !'));



module.exports = db;