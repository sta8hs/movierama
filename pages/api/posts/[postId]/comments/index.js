import { ValidateProps } from '@/api/lib/constants';
import { findPostById } from '@/lib/api/db';
import { findComments, insertComment } from '@/lib/api/db/comment';
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

  const comments = await findComments(
    db,
    req.query.postId,
    req.query.before ? new Date(req.query.before) : undefined,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  return res.json({ comments });
});

handler.post(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      content: ValidateProps.comment.content,
    },
    required: ['content'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const db = await getMongoDb();

    const content = req.body.content;

    const post = await findPostById(db, req.query.postId);

    if (!post) {
      return res.status(404).json({ error: { message: 'Post is not found.' } });
    }

    const comment = await insertComment(db, post._id, {
      creatorId: req.user._id,
      content,
    });

    return res.json({ comment });
  }
);

export default handler;
