import { AuthSplit } from "@/components/auth-split";
import { CreateAccountForm } from "@/components/create-account-form";

export const metadata = {
  title: "Create account",
};

export default function CreateAccountPage() {
  return (
    <AuthSplit
      title="Create account"
      description="Set up an admin login with email and password."
    >
      <CreateAccountForm />
    </AuthSplit>
  );
}
