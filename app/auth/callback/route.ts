// app/auth/callback/route.ts
export const runtime = 'edge';

import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        getErrorRedirect(
          `${requestUrl.origin}/signin`, // fix interpolation
          error.name,
          "Sorry, we weren't able to log you in. Please try again."
        )
      );
    }
  }

  return NextResponse.redirect(
    getStatusRedirect(
      `${requestUrl.origin}/profile`, // fix interpolation
      'Success!',
      'You are now signed in.'
    )
  );
}
