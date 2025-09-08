import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-2">Kandid – Linkbird.ai Replica</h1>
        <p className="opacity-70">Please <Link className="underline" href="/login">sign in</Link> to continue.</p>
      </div>
    </main>
  );
}
