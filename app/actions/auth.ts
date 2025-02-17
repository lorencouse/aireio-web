// app/actions/auth.ts
'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return { error: error.message };
  }

  // Manually set the auth cookie\
  const cookieStore = await cookies();
  cookieStore.set('sb-auth-token', data.session?.access_token ?? '', {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });

  redirect('/');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Clear the auth cookie
  const cookieStore = await cookies();
  cookieStore.set('sb-auth-token', '', {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0
  });

  redirect('/login');
}

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  return session;
}
