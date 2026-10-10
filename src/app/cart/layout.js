export const metadata = {
  title: "Your Cart",
  description:
    "Review the dishes in your Addis Eats cart and prepare your food order.",
  alternates: {
    canonical: "/cart",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartLayout({ children }) {
  return children;
}