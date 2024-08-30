'use client';

import { UserInfo } from '@/components/auth/user-info';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function Page() {
  const user = useCurrentUser();
  return <UserInfo user={user} label="Client Component" />;
}
