const mongoose = require('mongoose'); 
 
require("dotenv").config({path: "../environment/.env"});


 
const connectDB = async () => { 
  try { 
    await mongoose.connect( 
        `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@flytunerdb.xokhg0q.mongodb.net/?retryWrites=true&w=majority&appName=flytunerdb`,
      { 
        dbName: 'flytunerdb', 
      } 
    ); 
    console.log('Mongo DB connected to flytunerdb'); 
  } catch (e) { 
    console.log(e.message); 
    process.exit(1); // we exit the process with a failure code 1; 
  } 
}; 
 
module.exports = connectDB;