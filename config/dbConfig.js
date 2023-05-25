module.exports = {
  HOST: "localhost",
  USER: "root",
  DATABASE: "test_auth",
  PASSWORD: "abc@12345",
  PORT: 3307,
  dialect: "mysql",

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
