import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="font-heading text-8xl text-accent">404</h1>
      <h2 className="mt-2 font-heading text-3xl uppercase">Page Not Found</h2>
      <p className="mt-2 text-gray-400">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-accent px-5 py-3 font-semibold text-accent-text"
      >
        Back to Home
      </Link>
    </div>
  );
}