import { auth } from '@/auth';
import { UserInfo } from '@/components/auth/user-info';
import { currentUser } from '@/lib/auth';

export default async function Page() {
  const user = await currentUser();

  return <UserInfo user={user} label="Server Component" />;
}
