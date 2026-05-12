// src/app/register/page.tsx
import { Suspense } from "react";
import { AuthShell } from "../auth-shell";
import { RegisterForm } from "../register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create Your Workspace"
      subtitle="Set up your engineering account and start managing projects."
      footerText="Already have an account?"
      footerLinkLabel="Sign in to your workspace"
      footerHref="/auth/login"
    >
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
