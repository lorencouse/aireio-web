import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Database } from '@/types/supabase';

const useSupabase = () => {
  const supabase = createClientComponentClient<Database>();
  return supabase;
};

export default useSupabase;
