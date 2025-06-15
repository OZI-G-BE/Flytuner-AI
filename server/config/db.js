import mongoose from "mongoose"
 
import dotenv from 'dotenv';

dotenv.config({
  path: '../environment/.env'
});

 
export const connectDB = async () => { 
  try { 

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    
    db.once('open', () => {console.log('Mongo DB connected to flytunerdb')  })


    await mongoose.connect( 
        `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@flytunerdb.xokhg0q.mongodb.net/?retryWrites=true&w=majority&appName=flytunerdb`); 


  } catch (e) { 
    console.log(e.message); 
    
  } 
};




const fileSchema = new mongoose.Schema({
  title: String,
  summary: String,

  pdf: {
    data: Buffer,
    contentType: String,
    filename: String,
  },

  audio: {
    data: Buffer,
    contentType: String,
    filename: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

    expireAt:  { type: Date,
      required: true },
});

fileSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const FileModel = mongoose.model("File", fileSchema);


