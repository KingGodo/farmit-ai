import { LoginForm } from "@/components/login-form";
import { AuthSplit } from "@/components/auth-split";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <AuthSplit
      title="Sign in"
      description="Enter your admin credentials to continue."
    >
      <LoginForm />
    </AuthSplit>
  );
}
