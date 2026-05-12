// src/app/login/page.tsx
import { Suspense } from "react";
import { AuthShell } from "../auth-shell";
import { LoginForm } from "../login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Access your architectural workspace and project files."
      footerText="Don't have an account?"
      footerLinkLabel="Register for a new project"
      footerHref="/auth/register"
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
