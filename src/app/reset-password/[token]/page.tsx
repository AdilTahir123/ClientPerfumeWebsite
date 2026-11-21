import type { Metadata } from "next";
import ResetForm from "./ResetForm";

export const metadata: Metadata = { title: "Reset password | HAAD Fragrances", robots: { index: false }, referrer: "no-referrer" };
export default async function ResetPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ResetForm token={token} />;
}
