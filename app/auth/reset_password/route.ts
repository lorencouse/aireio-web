import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getErrorRedirect, getStatusRedirect } from '@/utils/helpers';

export async function GET(request: NextRequest) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the `@supabase/ssr` package. It exchanges an auth code for the user's session.
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        getErrorRedirect(
          `${requestUrl.origin}/signin/forgot_password`,
          error.name,
          "Sorry, we weren't able to log you in. Please try again."
        )
      );
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(
    getStatusRedirect(
      `${requestUrl.origin}/signin/update_password`,
      'You are now signed in.',
      'Please enter a new password for your account.'
    )
  );
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const requestUrl = new URL(request.url);

  // Get the new password from the request body
  const { password } = await request.json();

  if (!password) {
    return NextResponse.redirect(
      getErrorRedirect(
        `${requestUrl.origin}/signin/update_password`,
        'MissingPassword',
        'Please provide a new password.'
      )
    );
  }

  // Update the user's password
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return NextResponse.redirect(
      getErrorRedirect(
        `${requestUrl.origin}/signin/update_password`,
        error.name,
        'Failed to update password. Please try again.'
      )
    );
  }

  // Redirect to a success page or dashboard
  return NextResponse.redirect(
    getStatusRedirect(
      `${requestUrl.origin}/account`,
      'Password updated successfully',
      'Your password has been updated. You can now use your new password to log in.'
    )
  );
}
