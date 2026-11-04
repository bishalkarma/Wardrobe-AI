import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/auth/actions";

export function SignOutForm() {
  return (
    <form action={signOutAction}>
      <button className="text-link sign-out-control" type="submit"><LogOut size={14} /> Sign out</button>
    </form>
  );
}
