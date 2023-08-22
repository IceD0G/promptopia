'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import Profile from '@components/Profile';

const UserProfile = () => {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${userId}/posts`);
      const data = await response.json();
      setUserPosts(data);
    };
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setUser(data);
    };

    if (userId) {
      fetchPosts();
      fetchUser();
    }
  }, [userId]);

  const handleEdit = post => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async post => {
    const hasConfirmed = confirm('Are you sure you want to delete this prompt?');

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: 'DELETE',
        });

        const filteredPosts = userPosts.filter(item => item._id !== post._id);

        setUserPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  console.log(user);

  return (
    <Profile
      name={`${user?.username}`}
      desc={`Welcome to ${user?.username}'s personalized profile page. Share ${user?.username}'s exceptional prompts and inspire others with the power of their imagination`}
      data={userPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default UserProfile;
