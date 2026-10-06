import type { CustomerLook, Emotion } from '../types';

interface Props {
  look: CustomerLook;
  gender: 'male' | 'female';
  emotion: Emotion;
  className?: string;
}

/** 고객 캐릭터 (상반신, SVG). 감정에 따라 눈썹·눈·입·볼·땀방울이 달라진다. */
export function CustomerFigure({ look, gender, emotion, className }: Props) {
  const { skin, hair, hairStyle, top, accent, glasses, mature } = look;
  const lineColor = '#3a2e2a';

  const backHair = () => {
    switch (hairStyle) {
      case 'long':
        return <path d="M80 190 C 70 300, 80 380, 95 420 L 265 420 C 280 380, 290 300, 280 190 C 260 100, 100 100, 80 190 Z" fill={hair} />;
      case 'wave':
        return (
          <path
            d="M78 200 C 60 280, 70 340, 60 400 C 90 410, 100 380, 110 420 L 250 420 C 260 380, 270 410, 300 400 C 290 340, 300 280, 282 200 C 262 100, 98 100, 78 200 Z"
            fill={hair}
          />
        );
      case 'bob':
        return <path d="M84 190 C 72 260, 78 310, 95 330 L 265 330 C 282 310, 288 260, 276 190 C 258 100, 102 100, 84 190 Z" fill={hair} />;
      case 'tied':
        return (
          <>
            <circle cx="262" cy="150" r="34" fill={hair} />
            <path d="M90 190 C 84 230, 86 260, 96 280 L 264 280 C 274 260, 276 230, 270 190 C 254 100, 106 100, 90 190 Z" fill={hair} />
          </>
        );
      default:
        return null;
    }
  };

  const frontHair = () => {
    switch (hairStyle) {
      case 'short':
        return <path d="M86 185 C 90 110, 130 82, 180 82 C 230 82, 270 110, 274 185 C 250 150, 220 140, 180 142 C 140 140, 110 150, 86 185 Z" fill={hair} />;
      case 'side':
        return (
          <path d="M86 190 C 88 110, 128 84, 180 84 C 236 84, 274 112, 276 190 C 262 150, 232 136, 196 140 C 170 142, 150 160, 126 178 C 112 186, 98 190, 86 190 Z" fill={hair} />
        );
      case 'long':
      case 'wave':
        return (
          <path d="M82 200 C 84 110, 130 80, 180 80 C 232 80, 278 110, 280 200 C 262 150, 236 132, 200 132 C 176 132, 160 150, 140 166 C 120 180, 100 190, 82 200 Z" fill={hair} />
        );
      case 'bob':
        return <path d="M84 196 C 86 110, 130 82, 180 82 C 232 82, 276 110, 278 196 C 258 146, 230 134, 180 134 C 130 134, 104 146, 84 196 Z" fill={hair} />;
      case 'tied':
        return <path d="M90 190 C 92 112, 132 86, 180 86 C 230 86, 270 112, 272 190 C 254 150, 224 140, 180 140 C 136 140, 108 150, 90 190 Z" fill={hair} />;
    }
  };

  const brows = () => {
    switch (emotion) {
      case 'angry':
        return (
          <g stroke={lineColor} strokeWidth="7" strokeLinecap="round" fill="none">
            <path d="M112 160 L 158 176" />
            <path d="M248 160 L 202 176" />
          </g>
        );
      case 'uncomfortable':
        return (
          <g stroke={lineColor} strokeWidth="6" strokeLinecap="round" fill="none">
            <path d="M114 176 L 158 166" />
            <path d="M246 176 L 202 166" />
          </g>
        );
      case 'very_happy':
        return (
          <g stroke={lineColor} strokeWidth="6" strokeLinecap="round" fill="none">
            <path d="M114 162 Q 136 150 158 162" />
            <path d="M202 162 Q 224 150 246 162" />
          </g>
        );
      default:
        return (
          <g stroke={lineColor} strokeWidth="6" strokeLinecap="round" fill="none">
            <path d="M114 168 Q 136 160 158 166" />
            <path d="M202 166 Q 224 160 246 168" />
          </g>
        );
    }
  };

  const eyes = () => {
    switch (emotion) {
      case 'very_happy':
        return (
          <g stroke={lineColor} strokeWidth="7" strokeLinecap="round" fill="none">
            <path d="M118 198 Q 137 180 156 198" />
            <path d="M204 198 Q 223 180 242 198" />
          </g>
        );
      case 'angry':
        return (
          <g>
            <path d="M118 198 Q 137 188 156 196 L 156 206 L 118 206 Z" fill="#fff" />
            <path d="M204 196 Q 223 188 242 198 L 242 206 L 204 206 Z" fill="#fff" />
            <circle cx="140" cy="200" r="7" fill={lineColor} />
            <circle cx="220" cy="200" r="7" fill={lineColor} />
          </g>
        );
      case 'uncomfortable':
        return (
          <g>
            <ellipse cx="137" cy="198" rx="17" ry="12" fill="#fff" />
            <ellipse cx="223" cy="198" rx="17" ry="12" fill="#fff" />
            <circle cx="133" cy="200" r="8" fill={lineColor} />
            <circle cx="219" cy="200" r="8" fill={lineColor} />
            <circle cx="130" cy="197" r="2.5" fill="#fff" />
            <circle cx="216" cy="197" r="2.5" fill="#fff" />
          </g>
        );
      default:
        return (
          <g>
            <ellipse cx="137" cy="196" rx="18" ry="15" fill="#fff" />
            <ellipse cx="223" cy="196" rx="18" ry="15" fill="#fff" />
            <circle cx="139" cy="198" r="9" fill={lineColor} />
            <circle cx="225" cy="198" r="9" fill={lineColor} />
            <circle cx="142" cy="194" r="3" fill="#fff" />
            <circle cx="228" cy="194" r="3" fill="#fff" />
          </g>
        );
    }
  };

  const mouth = () => {
    switch (emotion) {
      case 'very_happy':
        return <path d="M150 252 Q 180 290 210 252 Z" fill="#c2414a" stroke={lineColor} strokeWidth="4" strokeLinejoin="round" />;
      case 'happy':
        return <path d="M152 254 Q 180 276 208 254" fill="none" stroke={lineColor} strokeWidth="5" strokeLinecap="round" />;
      case 'neutral':
        return <path d="M158 260 L 202 260" fill="none" stroke={lineColor} strokeWidth="5" strokeLinecap="round" />;
      case 'uncomfortable':
        return <path d="M154 266 Q 168 256 180 264 Q 192 272 206 262" fill="none" stroke={lineColor} strokeWidth="5" strokeLinecap="round" />;
      case 'angry':
        return <path d="M152 270 Q 180 246 208 270 Z" fill="#8b2630" stroke={lineColor} strokeWidth="4" strokeLinejoin="round" />;
    }
  };

  return (
    <svg viewBox="0 0 360 460" className={className} role="img" aria-label="고객">
      {/* 뒷머리 */}
      {backHair()}
      {/* 몸통 */}
      <path d="M40 460 C 40 360, 100 330, 150 322 L 210 322 C 260 330, 320 360, 320 460 Z" fill={top} />
      <path d="M150 322 L 180 372 L 210 322 Z" fill={accent} />
      <path d="M40 460 C 44 400, 70 360, 100 346 L 112 460 Z" fill="#000" opacity="0.08" />
      {/* 목 */}
      <rect x="156" y="272" width="48" height="64" rx="18" fill={skin} />
      <path d="M156 300 Q 180 324 204 300 L 204 316 Q 180 336 156 316 Z" fill="#000" opacity="0.08" />
      {/* 귀 */}
      <ellipse cx="86" cy="204" rx="14" ry="20" fill={skin} />
      <ellipse cx="274" cy="204" rx="14" ry="20" fill={skin} />
      {/* 얼굴 */}
      <ellipse cx="180" cy="192" rx="96" ry="108" fill={skin} />
      {/* 성숙한 느낌: 눈 밑 옅은 선 */}
      {mature && (
        <g stroke="#000" strokeOpacity="0.12" strokeWidth="3" fill="none" strokeLinecap="round">
          <path d="M120 222 Q 137 230 154 222" />
          <path d="M206 222 Q 223 230 240 222" />
        </g>
      )}
      {/* 앞머리 */}
      {frontHair()}
      {gender === 'male' && mature && hairStyle === 'side' && (
        <path d="M86 190 C 80 230, 84 250, 90 260" stroke={hair} strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.5" />
      )}
      {/* 볼 */}
      {(emotion === 'very_happy' || emotion === 'happy') && (
        <g fill="#f87171" opacity={emotion === 'very_happy' ? 0.4 : 0.22}>
          <ellipse cx="112" cy="236" rx="18" ry="10" />
          <ellipse cx="248" cy="236" rx="18" ry="10" />
        </g>
      )}
      {emotion === 'angry' && (
        <g fill="#ef4444" opacity="0.35">
          <ellipse cx="112" cy="236" rx="18" ry="10" />
          <ellipse cx="248" cy="236" rx="18" ry="10" />
        </g>
      )}
      {brows()}
      {eyes()}
      {/* 코 */}
      <path d="M180 212 Q 172 238 184 240" fill="none" stroke="#000" strokeOpacity="0.22" strokeWidth="4" strokeLinecap="round" />
      {mouth()}
      {/* 안경 */}
      {glasses && (
        <g fill="none" stroke="#1f2937" strokeWidth="5" strokeLinecap="round">
          <rect x="108" y="178" width="58" height="42" rx="14" fill="#fff" fillOpacity="0.18" />
          <rect x="194" y="178" width="58" height="42" rx="14" fill="#fff" fillOpacity="0.18" />
          <path d="M166 196 Q 180 188 194 196" />
          <path d="M108 194 L 84 188 M252 194 L 276 188" />
        </g>
      )}
      {/* 땀방울 / 화남 표시 */}
      {emotion === 'uncomfortable' && (
        <path className="anim-bob" d="M286 150 C 286 150, 300 172, 288 182 C 276 190, 270 174, 286 150 Z" fill="#60a5fa" />
      )}
      {emotion === 'angry' && (
        <g stroke="#dc2626" strokeWidth="5" strokeLinecap="round" fill="none" className="anim-bob">
          <path d="M282 120 q 10 -4 20 0 M292 110 q -4 10 0 20" />
          <path d="M282 142 q 10 -4 20 0 M292 132 q -4 10 0 20" />
        </g>
      )}
    </svg>
  );
}
