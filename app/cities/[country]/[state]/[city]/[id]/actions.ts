import { createClient } from "@/utils/supabase/server"

import React from 'react'

export const SubmitUserPlaceData = () => {

    const supabase = createClient()
    const user = getUser(supabase);

    

}

