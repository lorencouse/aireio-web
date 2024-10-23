import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export const createClient = (request: NextRequest) => {
  const response = NextResponse.next({
    request: {
      headers: request.headers
    }
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options
          });
          response.cookies.set({
            name,
            value,
            ...options
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.delete({
            name,
            ...options
          });
          response.cookies.delete({
            name,
            ...options
          });
        }
      }
    }
  );

  return { supabase, response };
};

export async function updateSession(request: NextRequest) {
  const { supabase, response } = createClient(request);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (
    (!user && request.nextUrl.pathname.startsWith('/profile')) ||
    (!user && request.nextUrl.pathname.startsWith('/favorites'))
  ) {
    return NextResponse.redirect(
      new URL('/signin/password_signin', request.url)
    );
  }

  return response;
}
