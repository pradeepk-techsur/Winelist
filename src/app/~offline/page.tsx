export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d0605] text-white p-6 text-center">
      <div className="text-6xl mb-4">🍷</div>
      <h1 className="text-2xl font-semibold mb-2">You&apos;re offline</h1>
      <p className="text-white/60 max-w-xs">
        Your collection is available once you reconnect. Any changes you made
        will sync automatically when you&apos;re back online.
      </p>
    </div>
  );
}
