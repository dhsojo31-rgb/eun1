/// <reference types="vite/client" />

declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    angle?: number;
    startVelocity?: number;
  }
  const confetti: (opts?: ConfettiOptions) => Promise<void> | null;
  export default confetti;
}
