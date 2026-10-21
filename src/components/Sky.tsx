/** The menus' backdrop: a sunny sky with drifting clouds over rolling hills. Purely decorative. */
export function Sky() {
  return (
    <div className="sky" aria-hidden>
      <svg className="sky-sun" viewBox="0 0 200 200">
        <g className="sky-sun-rays">
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x="94" y="4" width="12" height="36" rx="6" transform={`rotate(${i * 30} 100 100)`} />
          ))}
        </g>
        <circle cx="100" cy="100" r="52" />
        <circle className="sky-sun-cheek" cx="74" cy="112" r="9" />
        <circle className="sky-sun-cheek" cx="126" cy="112" r="9" />
        <circle className="sky-sun-eye" cx="82" cy="92" r="6" />
        <circle className="sky-sun-eye" cx="118" cy="92" r="6" />
        <path className="sky-sun-mouth" d="M84 116 Q100 132 116 116" />
      </svg>
      <Cloud className="sky-cloud c1" />
      <Cloud className="sky-cloud c2" />
      <Cloud className="sky-cloud c3" />
      <svg className="sky-hills" viewBox="0 0 1200 220" preserveAspectRatio="none">
        <path className="hill-back" d="M0 120 C180 40 360 40 520 110 C680 180 860 30 1200 90 V220 H0 Z" />
        <path className="hill-front" d="M0 170 C220 100 420 120 600 160 C800 205 980 110 1200 140 V220 H0 Z" />
      </svg>
    </div>
  );
}

function Cloud({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 160 80">
      <path d="M30 70 a24 24 0 0 1 4-47 a30 30 0 0 1 56-8 a26 26 0 0 1 44 20 a22 22 0 0 1-4 35 Z" />
    </svg>
  );
}
