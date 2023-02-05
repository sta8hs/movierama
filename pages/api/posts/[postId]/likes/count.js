import { findPostById } from '@/lib/api/db';
import { countLikes } from '@/lib/api/db/likes';
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

  const likes = await countLikes(db, req.query.postId);

  return res.json({ likes });
});

export default handler;
