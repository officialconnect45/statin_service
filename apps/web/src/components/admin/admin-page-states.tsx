export function AdminUnavailable({ title, message }: { title: string; message: string }) {
  return (
    <div className="mx-auto w-full max-w-[1320px] px-5 py-14 sm:px-8 lg:px-10">
      <div role="alert" className="rounded-3xl border border-danger/30 bg-white p-8">
        <p className="t-eyebrow text-danger">{title}</p>
        <p className="mt-3 text-lg font-medium">{message}</p>
        <p className="mt-2 text-sm text-mist">
          Data is stored in MongoDB through the Statin API. Start it with{" "}
          <code className="font-mono">npm run dev:api</code> and reload this page.
        </p>
      </div>
    </div>
  );
}

export function AdminPageSkeleton({ label }: { label: string }) {
  return (
    <div aria-busy="true" aria-label={label} className="mx-auto w-full max-w-[1320px] px-5 py-24 sm:px-8 lg:px-10">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-line" />
      <div className="mt-10 space-y-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-20 animate-pulse rounded-2xl bg-line" />
        ))}
      </div>
    </div>
  );
}
