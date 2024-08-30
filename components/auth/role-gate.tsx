'use client';

import { useCurrentRole } from '@/hooks/useCurrentRole';
import { UserRole } from '@prisma/client';
import { FormError } from '../form-error';

interface Props {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: Props) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message="You do not have permissin to view this content!" />
    );
  }

  return <>{children}</>;
};
