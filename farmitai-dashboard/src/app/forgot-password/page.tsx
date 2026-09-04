import { AuthSplit } from "@/components/auth-split";
import { ForgotPasswordForm } from "@/components/forgot-password-form";

export const metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <AuthSplit
      title="Reset your password"
      description="Enter the email on your admin account and we’ll send a reset link."
    >
      <ForgotPasswordForm />
    </AuthSplit>
  );
}
