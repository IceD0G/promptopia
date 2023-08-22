'use client';
import React, { useEffect, useMemo, useState } from 'react';
import PromptCard from '@components/PromptCard';
import { useDebounceEffect } from '@utils/useDebounce';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className={'mt-16 prompt_layout'}>
      {data.map(post => {
        return <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />;
      })}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const filterPosts = useMemo(() => {
    const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return posts.filter(post => {
      const tags = regex.test(post.tag);
      const prompt = regex.test(post.prompt);
      const username = regex.test(post.creator.username);
      const email = regex.test(post.creator.email);
      return tags || prompt || username || email;
    });
  }, [posts, searchText]);
  const handleSearchText = ({ target: { value } }) => {
    setSearchText(value);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt', {
        next: { revalidate: 10, cache: 'no-store' },
      });
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  useDebounceEffect(() => setFilteredPosts(filterPosts), 500, [searchText]);

  return (
    <section className={'feed'}>
      <form className={'relative w-full flex-center'}>
        <input
          type="text"
          placeholder={'Search for a tag or a username'}
          value={searchText}
          onChange={handleSearchText}
          required
          className={'search_input peer'}
        />
      </form>
      <PromptCardList
        data={searchText ? filteredPosts : posts}
        handleTagClick={tag => {
          setSearchText(tag.replace('#', ''));
        }}
      />
    </section>
  );
};

export default Feed;
