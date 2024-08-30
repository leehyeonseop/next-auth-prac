import NavBar from './_components/navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-sky-400">
      <NavBar />
      {children}
    </div>
  );
}
