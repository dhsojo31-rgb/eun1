/**
 * 안경원 매장 배경 (SVG, 외부 이미지 없음)
 * - 안경테 진열 벽, 거울, 카운터, 창문, 식물, 조명
 * - 로고 자리는 교육자 모드에서 매장 이름으로 바꿀 수 있음
 */
interface Props {
  storeName: string;
  /** consult: 상담실 느낌(차분한 톤), exam: 검사실 느낌 */
  variant?: 'store' | 'consult';
  dim?: number; // 0~1 어둡게
}

function Frame({ x, y, color = '#2b2b2b', scale = 1 }: { x: number; y: number; color?: string; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round">
      <rect x="0" y="0" width="26" height="18" rx="7" />
      <rect x="34" y="0" width="26" height="18" rx="7" />
      <path d="M26 7 q4 -4 8 0" />
      <path d="M0 6 l-8 -3 M60 6 l8 -3" />
    </g>
  );
}

const FRAME_COLORS = ['#2b2b2b', '#6b4f3a', '#b08968', '#3b5b7a', '#8c8c8c', '#c99a5b', '#1f3a5f', '#5a3e36'];

export function StoreBackground({ storeName, variant = 'store', dim = 0 }: Props) {
  const rows = [0, 1, 2, 3];
  const cols = [0, 1, 2, 3];
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbf8f3" />
            <stop offset="1" stopColor="#ece5dc" />
          </linearGradient>
          <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9c6ad" />
            <stop offset="1" stopColor="#c3aa8a" />
          </linearGradient>
          <linearGradient id="mirror" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e9f3f6" />
            <stop offset="0.5" stopColor="#cfe3ea" />
            <stop offset="1" stopColor="#b7d2dc" />
          </linearGradient>
          <linearGradient id="window" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#dff1fb" />
            <stop offset="1" stopColor="#f6fbfd" />
          </linearGradient>
          <linearGradient id="counter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f5f0e8" />
            <stop offset="1" stopColor="#e2d8ca" />
          </linearGradient>
          <linearGradient id="counterSide" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5d7f7a" />
            <stop offset="1" stopColor="#3f5f5b" />
          </linearGradient>
          <radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#fff6d6" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff6d6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0.05" />
            <stop offset="0.6" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.18" />
          </linearGradient>
        </defs>

        {/* 벽 */}
        <rect x="0" y="0" width="1600" height="620" fill="url(#wall)" />
        {/* 벽 패널 라인 */}
        <g stroke="#e3dbd0" strokeWidth="2">
          <line x1="0" y1="120" x2="1600" y2="120" />
        </g>
        {/* 바닥 */}
        <rect x="0" y="620" width="1600" height="280" fill="url(#floor)" />
        <g stroke="#b79d7e" strokeOpacity="0.35" strokeWidth="2">
          {[660, 710, 770, 840].map((y) => (
            <line key={y} x1="0" y1={y} x2="1600" y2={y} />
          ))}
          {[-200, 100, 400, 700, 1000, 1300, 1600, 1900].map((x, i) => (
            <line key={i} x1={x} y1="900" x2={800 + (x - 800) * 0.55} y2="620" />
          ))}
        </g>
        {/* 걸레받이 */}
        <rect x="0" y="606" width="1600" height="16" fill="#cbbba5" />

        {/* 천장 조명 */}
        {[260, 800, 1340].map((x) => (
          <g key={x}>
            <line x1={x} y1="0" x2={x} y2="70" stroke="#b9b1a6" strokeWidth="3" />
            <path d={`M ${x - 46} 70 L ${x + 46} 70 L ${x + 30} 104 L ${x - 30} 104 Z`} fill="#f4efe6" stroke="#d6cec2" strokeWidth="2" />
            <ellipse cx={x} cy="110" rx="140" ry="60" fill="url(#lamp)" />
          </g>
        ))}

        {/* 왼쪽 진열 벽 */}
        <g>
          <rect x="60" y="150" width="400" height="440" rx="14" fill="#ffffff" stroke="#e4ddd3" strokeWidth="3" />
          {rows.map((r) => (
            <g key={r}>
              <rect x="80" y={205 + r * 100} width="360" height="8" rx="3" fill="#d9cfc2" />
              <rect x="80" y={213 + r * 100} width="360" height="6" rx="3" fill="#c8bcac" opacity="0.6" />
              {cols.map((c) => (
                <Frame key={c} x={100 + c * 88} y={176 + r * 100} color={FRAME_COLORS[(r * 4 + c) % FRAME_COLORS.length]} scale={1.1} />
              ))}
            </g>
          ))}
          <rect x="60" y="590" width="400" height="20" rx="4" fill="#d6cabb" />
        </g>

        {/* 중앙: 로고 사인 + 거울 */}
        <g>
          <rect x="560" y="150" width="480" height="78" rx="16" fill="#ffffff" stroke="#e4ddd3" strokeWidth="3" />
          <g transform="translate(596 170)" fill="none" stroke="#0f766e" strokeWidth="5" strokeLinecap="round">
            <circle cx="14" cy="20" r="12" />
            <circle cx="46" cy="20" r="12" />
            <path d="M26 20 h8 M2 16 l-8 -6 M58 16 l8 -6" />
          </g>
          <text x="690" y="200" fontSize="32" fontWeight="800" fill="#0f766e" fontFamily="Pretendard, sans-serif" letterSpacing="1">
            {storeName}
          </text>
          <rect x="620" y="262" width="360" height="330" rx="20" fill="url(#mirror)" stroke="#d2c6b6" strokeWidth="8" />
          <path d="M 650 290 L 760 290 L 700 560 L 640 560 Z" fill="#ffffff" opacity="0.35" />
          <path d="M 900 290 L 950 290 L 930 560 L 880 560 Z" fill="#ffffff" opacity="0.25" />
        </g>

        {/* 오른쪽: 창문 + 식물 + 소형 진열 */}
        <g>
          <rect x="1120" y="140" width="400" height="300" rx="14" fill="url(#window)" stroke="#d9d0c3" strokeWidth="8" />
          <line x1="1320" y1="144" x2="1320" y2="436" stroke="#d9d0c3" strokeWidth="8" />
          <line x1="1124" y1="290" x2="1516" y2="290" stroke="#d9d0c3" strokeWidth="8" />
          {/* 창밖 풍경 */}
          <circle cx="1440" cy="210" r="34" fill="#fff4c2" opacity="0.9" />
          <path d="M1124 400 Q1200 330 1280 380 T1430 360 T1516 395 L1516 436 L1124 436 Z" fill="#cfe6d2" />
          {/* 식물 */}
          <g transform="translate(1210 440)">
            <path d="M0 160 h130 l-12 -110 h-106 Z" fill="#b89a7a" />
            <rect x="-6" y="40" width="142" height="18" rx="6" fill="#a78a6d" />
            <g fill="#4e8f5c">
              <ellipse cx="65" cy="-10" rx="22" ry="60" />
              <ellipse cx="25" cy="10" rx="20" ry="50" transform="rotate(-30 25 10)" />
              <ellipse cx="105" cy="10" rx="20" ry="50" transform="rotate(30 105 10)" />
              <ellipse cx="45" cy="30" rx="18" ry="42" transform="rotate(-60 45 30)" />
              <ellipse cx="85" cy="30" rx="18" ry="42" transform="rotate(60 85 30)" />
            </g>
          </g>
          {/* 소형 진열대 */}
          <rect x="1380" y="470" width="180" height="130" rx="10" fill="#ffffff" stroke="#e4ddd3" strokeWidth="3" />
          <rect x="1392" y="520" width="156" height="6" rx="3" fill="#d9cfc2" />
          <Frame x={1400} y={496} color="#1f3a5f" />
          <Frame x={1478} y={496} color="#c99a5b" />
          <Frame x={1400} y={556} color="#6b4f3a" />
          <Frame x={1478} y={556} color="#2b2b2b" />
        </g>

        {/* 카운터 (오른쪽 앞) */}
        <g>
          <path d="M 880 700 L 1600 700 L 1600 900 L 880 900 Z" fill="url(#counterSide)" />
          <path d="M 860 660 L 1600 660 L 1600 700 L 880 700 Z" fill="url(#counter)" />
          <rect x="860" y="652" width="740" height="12" rx="4" fill="#fbf7f0" />
          {/* 카운터 위 소품: 안경 받침, 태블릿, 안내판 */}
          <rect x="930" y="612" width="120" height="44" rx="8" fill="#334155" />
          <rect x="938" y="618" width="104" height="30" rx="4" fill="#60a5fa" opacity="0.8" />
          <rect x="1100" y="604" width="150" height="52" rx="6" fill="#ffffff" stroke="#d8d0c4" strokeWidth="3" />
          <text x="1175" y="636" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0f766e" fontFamily="Pretendard, sans-serif">
            상담 안내
          </text>
          <g transform="translate(1320 630)">
            <rect x="0" y="0" width="140" height="26" rx="6" fill="#e6ddd0" />
            <Frame x={40} y={2} color="#2b2b2b" />
          </g>
          <ellipse cx="1500" cy="640" rx="40" ry="14" fill="#cbbba5" />
          <rect x="1490" y="560" width="20" height="80" rx="6" fill="#d6cabb" />
          <ellipse cx="1500" cy="556" rx="36" ry="30" fill="#6bb27a" />
        </g>

        {/* 대기 의자 (왼쪽 뒤) */}
        <g transform="translate(470 520)">
          <rect x="0" y="0" width="70" height="60" rx="10" fill="#8fb0ad" />
          <rect x="0" y="60" width="70" height="20" rx="6" fill="#6f918e" />
          <rect x="8" y="80" width="8" height="26" fill="#4d6b69" />
          <rect x="54" y="80" width="8" height="26" fill="#4d6b69" />
        </g>

        {variant === 'consult' && <rect x="0" y="0" width="1600" height="900" fill="#1f2937" opacity="0.25" />}
        <rect x="0" y="0" width="1600" height="900" fill="url(#vignette)" />
        {dim > 0 && <rect x="0" y="0" width="1600" height="900" fill="#0f172a" opacity={dim} />}
      </svg>
    </div>
  );
}
