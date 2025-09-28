export default function TestPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-lg">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-gradient">
            Styles are Working!
          </h1>
          <p className="text-muted-foreground">
            If you can see a dark background and a styled card, your RootLayout
            and globals.css are configured correctly.
          </p>
          <button className="mt-4 rounded-md bg-primary px-4 py-2 font-bold text-primary-foreground">
            Styled Button
          </button>
        </div>
      </div>
    </main>
  );
}
