'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createDoc } from '@/lib/actions/room.actions';
import toast from 'react-hot-toast';
import Spinner from './Spinner';

const AddDocumentBtn = ({ userId, email }: AddDocumentBtnProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const addDocument = async () => {
    try {
      setIsCreating(true);
      const room = await createDoc({ userId, email });
      if (room) router.push(`/docs/${room.id}`);
      toast.success('Document Created Successfully!');
    } catch (error) {
      toast.error('Error Creating Document');
      console.log(error);
    }
    setIsCreating(false);
  };
  return (
    <Button
      type="submit"
      onClick={addDocument}
      className="gradient-blue flex gap-1 shadow-md"
      disabled={isCreating}
    >
      {isCreating ? (
        <Spinner circleColor="#E5E7EB" pathColor="rgb(100 116 139 / 1)" />
      ) : (
        <Image src="/assets/icons/add.svg" alt="add" width={20} height={20} />
      )}
      <p className="hidden sm:block">Start a new document</p>
    </Button>
  );
};

export default AddDocumentBtn;
