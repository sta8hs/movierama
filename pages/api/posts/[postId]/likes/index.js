import { findPostById } from '@/lib/api/db';
import {
  getLikes,
  insertLike,
  findLikeById,
  deleteLikeById,
} from '@/lib/api/db/likes';
import { auths, validateBody } from '@/lib/api/middlewares';
import { getMongoDb } from '@/lib/api/mongodb';
import { ncOpts } from '@/lib/api/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.get(async (req, res) => {
  const db = await getMongoDb();

  const post = await findPostById(db, req.query.postId);

  if (!post) {
    return res.status(404).json({ error: { message: 'Post is not found.' } });
  }

  const likes = await getLikes(
    db,
    req.query.postId,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  return res.json({ likes });
});

handler.post(
  ...auths,
  validateBody({
    type: 'object',
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const db = await getMongoDb();

    const post = await findPostById(db, req.query.postId);

    if (!post) {
      return res.status(404).json({ error: { message: 'Post is not found.' } });
    }

    const old_like = await findLikeById(db, req.query.postId, req.user._id);

    if (old_like) {
      const deleted = await deleteLikeById(db, req.query.postId, req.user._id);
      console.log('Deleted', deleted);
      return res
        .status(201)
        .json({ error: { message: 'Post already liked.' } });
    }

    const like = await insertLike(db, post._id, {
      creatorId: req.user._id,
    });

    return res.json({ like });
  }
);

export default handler;
