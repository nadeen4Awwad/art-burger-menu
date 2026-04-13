export default function SteamEffect() {
  return (
    <svg
      viewBox="0 0 100 120"
      fill="none"
      overflow="visible"
      style={{
        position: 'absolute',
        bottom: '58%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 120,
        height: 140,
        zIndex: 30,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
        filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.1))' // تخفيف الظل الخارجي
      }}
    >
      <defs>
        {/* تقليل stdDeviation ينعم البخار ويجعله أقل حدة */}
        <filter id="steamFilter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
          <feDisplacementMap in="blur" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* تقليل شفافية الألوان الأساسية في التدرج */}
        <radialGradient id="steamGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="70%" stopColor="white" stopOpacity="0.1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g filter="url(#steamFilter)">
        {/* الخيط الأول - تقليل الـ opacity القصوى إلى 0.4 */}
        <ellipse cx="50" cy="100" rx="12" ry="20" fill="url(#steamGradient)">
          <animate attributeName="cy" values="100;40;-20" dur="4s" repeatCount="indefinite" />
          <animate attributeName="rx" values="10;25;35" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.4;0.2;0" dur="4s" repeatCount="indefinite" />
          <animate attributeName="cx" values="50;55;45;50" dur="4s" repeatCount="indefinite" />
        </ellipse>

        {/* الخيط الثاني - تقليل الـ opacity القصوى إلى 0.3 */}
        <ellipse cx="40" cy="100" rx="8" ry="15" fill="url(#steamGradient)">
          <animate attributeName="cy" values="100;30;-30" dur="5s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="rx" values="8;20;30" dur="5s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.3;0.1;0" dur="5s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="cx" values="40;30;45;35" dur="5s" begin="1s" repeatCount="indefinite" />
        </ellipse>

        {/* الخيط الثالث - تقليل الـ opacity القصوى إلى 0.2 */}
        <ellipse cx="60" cy="100" rx="10" ry="18" fill="url(#steamGradient)">
          <animate attributeName="cy" values="100;20;-40" dur="4.5s" begin="2.5s" repeatCount="indefinite" />
          <animate attributeName="rx" values="10;22;32" dur="4.5s" begin="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.2;0.1;0" dur="4.5s" begin="2.5s" repeatCount="indefinite" />
          <animate attributeName="cx" values="60;70;55;65" dur="4.5s" begin="2.5s" repeatCount="indefinite" />
        </ellipse>

        {/* نفحة القاعدة - شفافة جداً */}
        <ellipse cx="50" cy="100" rx="15" ry="10" fill="url(#steamGradient)">
          <animate attributeName="opacity" values="0;0.2;0" dur="2s" repeatCount="indefinite" />
          <animate attributeName="scale" values="0.8;1.1" dur="2s" repeatCount="indefinite" />
        </ellipse>
      </g>
    </svg>
  );
}