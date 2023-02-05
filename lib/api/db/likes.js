import { ObjectId } from 'mongodb';
import { dbProjectionUsers } from '.';

export async function getLikes(db, postId, limit) {
  return db
    .collection('likes')
    .aggregate([
      {
        $match: {
          postId: new ObjectId(postId),
        },
      },
      { $sort: { _id: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      { $project: dbProjectionUsers('creator.') },
    ])
    .toArray();
}

export async function findLikeById(db, postId, userId) {
  const likes = await db
    .collection('likes')
    .aggregate([
      {
        $match: {
          postId: new ObjectId(postId),
          creatorId: new ObjectId(userId),
        },
      },
      { $limit: 1 },
    ])
    .toArray();
  return likes.length !== 0;
}

export async function deleteLikeById(db, postId, userId) {
  const result = await db.collection('likes').deleteOne({
    postId: new ObjectId(postId),
    creatorId: new ObjectId(userId),
  });
  return result.deletedCount === 1;
}

export async function countLikes(db, postId) {
  return db
    .collection('likes')
    .aggregate([
      {
        $match: {
          postId: new ObjectId(postId),
        },
      },
      {
        $group: {
          _id: '$postId',
          count: { $sum: 1 },
        },
      },
    ])
    .toArray()
    .then((results) => results[0].count);
}

export async function insertLike(db, postId, { creatorId }) {
  const like = {
    postId: new ObjectId(postId),
    creatorId,
    createdAt: new Date(),
  };
  const { insertedId } = await db.collection('likes').insertOne(like);
  like._id = insertedId;
  return like;
}
