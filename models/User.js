import mongoose, { model, models, Schema } from 'mongoose';

//https://mongoosejs.com/docs/guide.html
const UserSchema = new Schema({
  name: String,
  email: String,
  username: String,
  bio: String,
});

const User = models?.User || mongoose.model('User', UserSchema);

export default User;
