const moongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const DB_URI = process.env.DB_MONGO;

module.exports = () => {
  const connect = () => {
    moongoose.connect(
      DB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) {
          console.log('Error connecting to the database', err);
        } else {
          console.log('Database connected');
        }
      }
    );
  };
  connect();
};
