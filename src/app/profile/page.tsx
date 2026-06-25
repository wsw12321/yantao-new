import { redirect } from 'next/navigation';
import { getAuthContext } from '@/lib/auth';
import { getLoginUrl } from '@/lib/config';

export default async function ProfileRedirectPage() {
  const auth = await getAuthContext();

  if (!auth.configured) {
    redirect('/dashboard');
  }

  if (!auth.user) {
    redirect(getLoginUrl('/profile'));
  }

  redirect(`/profile/${auth.user.id}`);
}
