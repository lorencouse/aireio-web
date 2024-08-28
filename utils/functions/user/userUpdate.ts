import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { userUpdateProps } from '@/utils/types';
import { UserProfile } from '@/utils/types';

export const userUpdate = async ({
user
}: UserProfile) => {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update([
        {
          user.name,
          user.username,
          user.language,
          user.email,
          user.bio,
          user.websites,
          user.dob,
          user.theme,
          user.favorites,
          user.current_city_id,
          user.avatar_url
        }
      ])
      .eq('id', user.id)
      .select();

    if (data) return data;

    if (error) return error;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
