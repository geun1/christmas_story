'use client';

export default function Header() {
  return (
    <header className="relative pt-6 pb-2 text-center">
      {/* Decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />

      {/* Merry Christmas - top */}
      <p className="text-yellow-400/70 text-xs tracking-[0.3em] uppercase mb-3 font-medium">
        Merry Christmas
      </p>

      {/* Main title */}
      <h1 className="text-4xl font-bold title-gradient mb-1 tracking-tight">
        Our Memories
      </h1>

      {/* Year */}
      {/* <p className="text-white/40 text-xs tracking-widest mb-4">
        2024 - 2025
      </p> */}

      {/* Names with heart */}
      <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass">
        {/* <span className="text-white/90 font-medium text-sm">명서</span>
        <span className="text-red-400 heart-beat text-lg">&#10084;</span>
        <span className="text-white/90 font-medium text-sm">와의 추억</span> */}
        <span className="text-white/90 font-medium text-sm">우리의 행복했던 2025년</span>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </header>
  );
}
