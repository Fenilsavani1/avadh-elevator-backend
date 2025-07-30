// const mongoose = require('mongoose');
// const MONGO_URL = require('../../config')

// const connectToMongoDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URL , {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('Connected to MongoDB');
//   } catch (err) {
//     console.error('MongoDB connection error:', err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectToMongoDB;
const mongoose=require("mongoose")
require("dotenv").config()
const dbUrl=process.env.DB_URI || "";
console.log("dbUrl",dbUrl)

const connectDB=async()=>{      
    try {
        await mongoose.connect(dbUrl).then(()=>{
            console.log(`Database connected`)
            return true
        })
    } catch (error) {
        console.log(error.message)
        setTimeout(connectDB,5000)
    }
}

module.exports= connectDB