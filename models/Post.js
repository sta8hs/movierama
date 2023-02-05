import mongoose, { model, models, Schema } from 'mongoose';

//https://mongoosejs.com/docs/guide.html
const PostSchema = new Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
    text: String,
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    parent: { type: mongoose.Types.ObjectId, ref: 'Post' },
  },
  {
    //https://mongoosejs.com/docs/timestamps.html
    timestamps: true,
  }
);

const Post = models?.Post || mongoose.model('Post', PostSchema);

export default Post;
