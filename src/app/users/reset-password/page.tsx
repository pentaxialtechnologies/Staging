import React, { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordPage";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
