'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import Form from '@components/Form';

const EditPrompt = () => {
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    prompt: '',
    tag: '',
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get('id');
  const handleSubmit = async e => {
    e.preventDefault();
    if (!promptId) return alert('Prompt ID not found');
    try {
      const res = await fetch(`/api/prompt/${promptId}`, {
        method: 'PATCH',
        body: JSON.stringify({ prompt: post.prompt, tag: post.tag }),
      });
      if (res.ok) {
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
    setSubmitting(true);
  };

  useEffect(() => {
    const getPromptDetails = async () => {
      const response = await fetch(`api/prompt/${promptId}`);
      const data = await response.json();
      setPost(data);
    };
    if (promptId) getPromptDetails();
  }, [promptId]);

  return (
    <Form type={'Edit'} post={post} setPost={setPost} submitting={submitting} handleSubmit={handleSubmit}>
      EditPrompt
    </Form>
  );
};

export default EditPrompt;
