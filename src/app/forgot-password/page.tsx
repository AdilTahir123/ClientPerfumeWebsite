import type { Metadata } from "next";
import ForgotForm from "./ForgotForm";

export const metadata: Metadata = { title: "Forgot password | HAAD Fragrances", robots: { index: false } };
export default function ForgotPage() {
  return <ForgotForm />;
}
