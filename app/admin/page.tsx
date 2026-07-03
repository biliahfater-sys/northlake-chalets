import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/admin-app";

export const metadata: Metadata = {
  title: "Back office",
  robots: { index: false, follow: false },
};

/**
 * /admin — the demo back office. Auth is a session passcode only: this is a
 * UI shell ready to be wired to a real auth provider + database; nothing
 * here exposes data that isn't already in the visitor's own browser.
 */
export default function AdminPage() {
  return <AdminApp />;
}
