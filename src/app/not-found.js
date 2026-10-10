export const metadata = {
  title: "Page Not Found",
  description:
    "The page you requested could not be found on Addis Eats.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main>
      <h1>Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </main>
  );
}