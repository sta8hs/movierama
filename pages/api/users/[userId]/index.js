import { findUserById } from '@/lib/api/db';
import { getMongoDb } from '@/lib/api/mongodb';
import { ncOpts } from '@/lib/api/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

handler.get(async (req, res) => {
  const db = await getMongoDb();
  const user = await findUserById(db, req.query.userId);
  res.json({ user });
});

export default handler;
