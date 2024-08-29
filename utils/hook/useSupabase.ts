import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';

import { Database } from '@/types/supabase';

const useSupabase = () => {
  const supabase = createClientComponentClient<Database>();

  // const supabase = createClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  //   process.env.SUPABASE_SERVICE_ROLE_KEY as string
  // );

  return supabase;
};

export default useSupabase;
