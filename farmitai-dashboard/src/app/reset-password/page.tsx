import { AuthSplit } from "@/components/auth-split";
import { ResetPasswordView } from "@/components/reset-password-form";

export const metadata = {
  title: "Set a new password",
};

export default function ResetPasswordPage() {
  return (
    <AuthSplit
      title="Choose a new password"
      description="This link expires 30 minutes after it was sent."
    >
      <ResetPasswordView />
    </AuthSplit>
  );
}
