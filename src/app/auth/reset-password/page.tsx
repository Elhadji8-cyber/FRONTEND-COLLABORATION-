import { Suspense } from "react";
import { AuthShell } from "../auth-shell";
import { ResetPasswordForm } from "../reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Réinitialiser le mot de passe"
      subtitle="Choisissez un nouveau mot de passe pour votre compte."
      footerText="Vous avez déjà un compte ?"
      footerLinkLabel="Connectez-vous"
      footerHref="/auth/login"
    >
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
