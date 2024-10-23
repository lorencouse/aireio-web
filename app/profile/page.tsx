// app/profile/page.tsx

import { Separator } from '@/components/ui/separator';
import { ContactInfoForm } from './contact-info-form';
import { UserProfile } from '@/utils/types';
import { getUserProfile } from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';

export default async function ContactInfoPage() {
  const profile: UserProfile | null = await getUserProfile();

  if (!profile) {
    redirect('/signin/password_signin');
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Contact Info</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see your info on the site.
        </p>
      </div>
      <Separator />
      <ContactInfoForm userProfile={profile} />
    </div>
  );
}
