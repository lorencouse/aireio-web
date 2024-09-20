'use server';
import { cookies } from 'next/headers';

export async function create() {
  // const cookievalue = await cookies().get('lorencookie');
  // console.log("Testing 123 " + cookievalue.value);
  // cookies().set('lorencookie', 'testing123');
  const jwt = cookies().get('sb-pbjjmfifdzbptzlotsej-auth-token.0');
  console.log(jwt?.value);

  
}
