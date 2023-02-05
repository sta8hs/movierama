import { findLikeById } from '@/lib/api/db/likes';
import { getMongoDb } from '@/lib/api/mongodb';
import { ncOpts } from '@/lib/api/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.get(async (req, res) => {
  const db = await getMongoDb();

  const like = await findLikeById(db, req.query.postId, req.query.userId);

  if (!like) {
    return res.status(404).json({ error: { message: 'Like is not found.' } });
  }

  return res.json({ like });
});

export default handler;
