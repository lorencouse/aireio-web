import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { userCreateProps } from '@/utils/types';

export const userCreate = async ({
  email,
  first_name,
  last_name,
  profile_image_url,
  user_id,
}: userCreateProps) => {
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
      .from('user')
      .insert([
        {
          email,
          first_name,
          last_name,
          profile_image_url,
          user_id,
        },
      ])
      .select();

    if (error?.code) return error;
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
