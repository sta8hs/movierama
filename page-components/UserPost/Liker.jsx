import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Container } from '@/components/Layout';
import { LoadingDots } from '@/components/LoadingDots';
import { Text, TextLink } from '@/components/Text';
import { useLikePages } from '@/lib/like';
import { fetcher } from '@/lib/fetch';
import { useCurrentUser } from '@/lib/user';
import Link from 'next/link';
import { useEffect } from 'react';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Heart } from 'tabler-icons-react';
import styles from './Commenter.module.css';

const LikerInner = ({ user, post }) => {
  const [updatingLike, setUpdatingLike] = useState(false);
  const contentRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [likesState, setLikesState] = useState(true);

  const { mutate } = useLikePages({ postId: post._id });

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const result = await fetcher(`/api/posts/${post._id}/likes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        console.log("Like result", result)
        if (result.error) {
          toast.success('You have un-liked the post');
          setLikesState(false)
        } else {
          toast.success('You have liked the post');
          setLikesState(true)
        }
        // refresh post lists
        mutate();
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [post._id]
  );

  useEffect(() => {
    async function checkHasLiked() {
      try {
        const likes = await fetch(`/api/posts/${post._id}/likes/${user._id}`);  
        
        setLikesState(likes.ok)
        console.log(likesState)
      } catch (e) {
        console.error(e);
      }
    }
    checkHasLiked();
  }, [post, user]);

  return (
    <button onClick={onSubmit} size="lg" loading={updatingLike}>
      <Heart
        size={18}
        color={'red'}
        className={likesState == true ? styles.liked : null}
      />
      {likesState}
    </button>
  );
};

const Liker = ({ post }) => {
  const { data, error } = useCurrentUser();
  const loading = !data && !error;
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    async function fetchLikeCount() {
      const response = await fetch(`/api/posts/${post._id}/likes/count`);
      const result = await response.json();
      setLikeCount(result.likes);
    }
    fetchLikeCount();
  }, [post]);

  return (
    <>
      {loading ? (
        <LoadingDots>Loading</LoadingDots>
      ) : data?.user ? (
        <LikerInner post={post} user={data.user} />
      ) : (
        <></>
      )}
      <small>{likeCount}</small>
    </>
  );
};

export default Liker;
