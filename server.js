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


const uploadPath = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('public/uploads/ folder created automatically');
}

app.use('/public/uploads', express.static(uploadPath));
app.use(authJwt());

app.use('/api/v1', Routes);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    console.log(`Connected to MongoDB at ${process.env.DB_URI}`);
  const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
    if (process.argv[2] === 'Add_Data') {
      console.log('Adding data to database...');
      await MakeData();
       setTimeout(() => {
        server.close((err) => {
          if (err) {
            console.error('Error closing server:', err);
            process.exit(1); 
          }
          console.log('Server has been stopped after seeding data.');
          process.exit(0); 
        });
      }, 10000);
      console.log('Data seeding completed');
    } else {
      console.log('Running without data seeding');
    }

  

  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
