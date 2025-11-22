'use client'
import React from 'react'
import Postform from '@/Forms/BlogForm';
import { useSelector } from 'react-redux';
import {useRouter} from 'next/navigation';
function AddBlogs() {
    const authStatus = useSelector((state: { auth: { status: boolean; } }) => state.auth.status);
    const router = useRouter();
    if (!authStatus) {
        router.back();
    }

    return (
        <Postform />
    )
}

export default AddBlogs;
