import { Suspense } from "react";
import { AuthShell } from "../auth-shell";
import { ForgotPasswordForm } from "../forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Mot de passe oublié"
      subtitle="Entrez votre email pour recevoir un lien de réinitialisation."
      footerText="Vous vous souvenez de votre mot de passe ?"
      footerLinkLabel="Retour à la connexion"
      footerHref="/auth/login"
    >
      <Suspense>
        <ForgotPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
