export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-2 text-lg font-semibold">Site Configuration</h2>
        <p className="text-sm text-gray-600">
          Environment variables are configured in <code className="rounded bg-gray-100 px-1">.env.local</code>:
        </p>
        <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-gray-600">
          <li>NEXT_PUBLIC_SITE_URL</li>
          <li>DATABASE_URL</li>
          <li>NEXTAUTH_SECRET / AUTH_SECRET</li>
          <li>ADMIN_EMAIL / ADMIN_PASSWORD (seed only)</li>
          <li>GEMINI_API_KEY</li>
          <li>GEMINI_MODEL_PRO / GEMINI_MODEL_FLASH</li>
          <li>GOOGLE_SITE_VERIFICATION</li>
          <li>REVALIDATE_SECRET</li>
          <li>CLOUDINARY_*</li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">
          Course content is not seeded. Use{" "}
          <a href="/admin/import" className="font-medium text-emerald-600 hover:underline">
            CSV Import
          </a>{" "}
          to add courses, then generate Urdu content from AI Agent.
        </p>
      </div>
    </div>
  );
}
