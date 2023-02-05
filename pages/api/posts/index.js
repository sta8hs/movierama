import { ValidateProps } from '@/lib/api/constants';
import { findPosts, insertPost } from '@/lib/api/db';
import { auths, validateBody } from '@/lib/api/middlewares';
import { getMongoDb } from '@/lib/api/mongodb';
import { ncOpts } from '@/lib/api/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.get(async (req, res) => {
  const db = await getMongoDb();

  const posts = await findPosts(
    db,
    req.query.before ? new Date(req.query.before) : undefined,
    req.query.by,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );
  res.json({ posts });
});

handler.post(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      title: ValidateProps.post.title,
      content: ValidateProps.post.content,
    },
    required: ['title', 'content'],
    additionalProperties: false,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }

    const db = await getMongoDb();

    const post = await insertPost(db, {
      title: req.body.title,
      content: req.body.content,
      creatorId: req.user._id,
    });

    return res.json({ post });
  }
);

export default handler;
