// app/profile/page.tsx

import { Separator } from '@/components/ui/separator';
import { ContactInfoForm } from './contact-info-form';
import { getUserProfile } from '@/utils/supabase/queries';

export default async function ContactInfoPage() {
  const userProfile = await getUserProfile();

  if (!userProfile) {
    return null;
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
      <ContactInfoForm userProfile={userProfile} />
    </div>
  );
}