"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function ConfirmSignupPage() {
  const searchParams = useSearchParams();
  const [confirmationUrl, setConfirmationUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = searchParams.get("confirmation_url");
    setConfirmationUrl(url);
  }, [searchParams]);

  if (!confirmationUrl) {
    return <div className="flex flex-col items-center justify-center min-h-screen"><p className="text-red-500">Invalid or missing confirmation link.</p></div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Confirm Your Signup</h1>
      <p className="mb-6">Click the button below to complete your signup and activate your account.</p>
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => window.location.href = confirmationUrl}
      >
        Confirm Account
      </button>
    </div>
  );
}

export default function ConfirmSignupPageWrapper() {
  return (
    <Suspense>
      <ConfirmSignupPage />
    </Suspense>
  );
} 