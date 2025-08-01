const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { authJwt } = require('./middleware/jwt');
const Routes = require('./Routers/Routes');
const connectDB = require('./Models/Config/mongoose.config');
const { MakeData } = require('./superadmin');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(authJwt());

// Ensure uploads/ folder exists
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('uploads/ folder created automatically');
}

//uploaded files
app.use('/uploads', express.static(uploadPath));

// API routes
app.use('/api/v1', Routes);

const PORT = process.env.PORT || 3000;

// Connect to DB and start server
const startServer = async () => {
  try {
    await connectDB();
    console.log(`Connected to MongoDB at ${process.env.DB_URI}`);

    if (process.argv[2] === 'Add_Data') {
      console.log('Adding data to database...');
      await MakeData();
      console.log('Data seeding completed');
    } else {
      console.log('Running without data seeding');
    }

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
