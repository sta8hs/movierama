import mongoose from 'mongoose';

export async function initMongoose() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('mongoDB connection successful');
  } catch (error) {
    console.log(error);
  }
}
