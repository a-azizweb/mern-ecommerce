const app = require('./app');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary');
//importing fnc for connecting to database
const connectDatabase = require('./config/database');

//getting environment variables from cinfig.env file
dotenv.config({ path: 'Backend/config/config.env' });

//connecting to  database
connectDatabase();

//adding cloudinary
cloudinary.config({
  cloud_name: 'debqaeiq0',
  api_key: '977463469786126',
  api_secret: '1fydOSTECCyyZD39o5EGAqn8KoE',
});

//Handling uncaughtException error
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to uncaught Exception');
  process.exit(1);
});

//listening to server
const server = app.listen(process.env.PORT, () => {
  console.log(
    `serrver is working at port http://localhost:${process.env.PORT}`
  );
});

//Hendling unhandledRejection Error
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down server due to unHandled Promise Rejection');
  server.close(() => {
    process.exit(1);
  });
});
