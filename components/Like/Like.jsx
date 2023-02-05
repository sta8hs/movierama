import { Avatar } from '@/components/Avatar';
import { Container } from '@/components/Layout';
import clsx from 'clsx';
import Link from 'next/link';
import styles from './Like.module.css';

const Comment = ({ comment, className }) => {
  return (
    <div className={clsx(styles.root, className)}>
      <Link href={`/user/${comment.creator.username}`}>
        <a>
          <Container className={styles.creator}>
            <Avatar
              size={36}
              url={comment.creator.profilePicture}
              username={comment.creator.username}
            />
            <Container column className={styles.meta}>
              <p className={styles.name}>{comment.creator.name}</p>
              <p className={styles.username}>{comment.creator.username}</p>
            </Container>
          </Container>
        </a>
      </Link>
      <div className={styles.wrap}>
        <p className={styles.content}>{comment.content}</p>
      </div>
    </div>
  );
};

export default Comment;
