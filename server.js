// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const { authJwt } = require('./middleware/jwt');
// const Routes = require('./Routers/Routes');
// // const db = require('./Models/Config/db.config'); 

// const connectDB = require('./Models/Config/mongoose.config'); //MongoDB connection

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());


// app.use(authJwt());
// app.use('/api/v1', Routes);

// const PORT = process.env.PORT || 3000;

// //Connect to MongoDB and start server
// connectDB().then(() => {
//   console.log(`Connected to MongoDB at ${process.env.DB_URI}`);
//   app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
//   });
// }).catch(err => {
//   console.error('Failed to connect to MongoDB:', err.message);
// });


const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { authJwt } = require('./middleware/jwt');
const Routes = require('./Routers/Routes');
const connectDB = require('./Models/Config/mongoose.config'); // MongoDB connection
const { MakeData } = require('./superadmin'); 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(authJwt());
app.use('/api/v1', Routes);

const PORT = process.env.PORT || 3000;

// Connect to MongoDB and start server with optional data seeding
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log(`Connected to MongoDB at ${process.env.DB_URI}`);
 
    const args = process.argv;
    if (args[2] === 'Add_Data') {
      console.log('Adding data to database. Please wait...');
      await MakeData();
      console.log('Data seeding completed');
    } else {
      console.log('Running without data seeding');
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
    
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1); 
  }
};

// Start the application
startServer();