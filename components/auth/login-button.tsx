'use client';

import { useRouter } from 'next/navigation';

interface Props {
  children: React.ReactNode;
  mode?: 'modal' | 'redirect';
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = 'redirect',
  asChild,
}: Props) => {
  const router = useRouter();

  const onClick = () => {
    console.log('클릭');
    router.push('/auth/login');
  };

  if (mode === 'modal') {
    return <span>TODO : Implement modal</span>;
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
