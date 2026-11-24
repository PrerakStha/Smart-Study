// Temporary stand-in so nav links don't bounce back to the workspace
export default function ComingSoonPage({ title = 'Coming soon' }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 text-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-3 text-zinc-400">This page is being built in a later sprint.</p>
    </main>
  );
}