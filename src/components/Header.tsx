'use client';

export default function Header() {
  return (
    <header className="relative pt-10 pb-6 text-center">
      {/* Decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />

      {/* Merry Christmas - top */}
      <p className="text-yellow-400/70 text-xs tracking-[0.3em] uppercase mb-4 font-medium">
        Merry Christmas
      </p>

      {/* Main title */}
      <h1 className="text-4xl font-bold title-gradient mb-3 tracking-tight">
        Our Memories
      </h1>

      {/* Names with heart */}
      <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass">
        <span className="text-white/90 font-medium text-sm">우리의 행복했던 2025년</span>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </header>
  );
}
