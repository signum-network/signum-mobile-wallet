import React, { useMemo } from "react";
import { View } from "react-native";
import Svg, { Path, G, Rect } from "react-native-svg";
import { keccak256 } from "js-sha3";
import { colord } from "colord";
import { PATTERN } from "@/lib/hashiconPattern";

/**
 * This component renders EmeraldPay-style hashicons natively with react-native-svg.
 * It ports the original algorithm (your index.html UMD) 1:1:
 * - same triangle geometry
 * - same color generation (hue/sat/lightness + variation + shift + light offsets)
 * - same per-cell alpha from the big PATTERN table
 *
 * No WebView, no HTML, works in EAS release builds.
 */

/* ---------- Original geometry & parameters (ported) ---------- */

type LightDir = "top" | "right" | "left";

type Elem = {
  x: number;
  y: number;
  shape: 0 | 1; // index into TRIANGLES
  light?: LightDir;
  hidden?: boolean;
};

// From original array "e"
const ELEMENTS: Elem[] = [
  { x: 0, y: 0, shape: 1, hidden: true },
  { x: 0, y: 0, shape: 0, light: "top" },
  { x: 0, y: 0.25, shape: 1, light: "left" },
  { x: 0, y: 0.25, shape: 0, light: "left" },
  { x: 0, y: 0.5, shape: 1, light: "left" },
  { x: 0, y: 0.5, shape: 0, light: "left" },
  { x: 0, y: 0.75, shape: 1, hidden: true },
  { x: 0.25, y: -0.125, shape: 0, light: "top" },
  { x: 0.25, y: 0.125, shape: 1, light: "top" },
  { x: 0.25, y: 0.125, shape: 0, light: "top" },
  { x: 0.25, y: 0.375, shape: 1, light: "left" },
  { x: 0.25, y: 0.375, shape: 0, light: "left" },
  { x: 0.25, y: 0.625, shape: 1, light: "left" },
  { x: 0.25, y: 0.625, shape: 0, light: "left" },
  { x: 0.5, y: 0, shape: 1, light: "top" },
  { x: 0.5, y: 0, shape: 0, light: "top" },
  { x: 0.5, y: 0.25, shape: 1, light: "top" },
  { x: 0.5, y: 0.25, shape: 0, light: "right" },
  { x: 0.5, y: 0.5, shape: 1, light: "right" },
  { x: 0.5, y: 0.5, shape: 0, light: "right" },
  { x: 0.5, y: 0.75, shape: 1, light: "right" },
  { x: 0.75, y: -0.125, shape: 0, hidden: true },
  { x: 0.75, y: 0.125, shape: 1, light: "top" },
  { x: 0.75, y: 0.125, shape: 0, light: "right" },
  { x: 0.75, y: 0.375, shape: 1, light: "right" },
  { x: 0.75, y: 0.375, shape: 0, light: "right" },
  { x: 0.75, y: 0.625, shape: 1, light: "right" },
  { x: 0.75, y: 0.625, shape: 0, hidden: true },
];

// From original array "r" (order matters: 0, then 1)
const TRIANGLES = [
  { x1: 0, y1: 0.25, x2: 0.25, y2: 0.125, x3: 0.25, y3: 0.375 }, // index 0
  { x1: 0, y1: 0, x2: 0.25, y2: 0.125, x3: 0, y3: 0.25 },         // index 1
];

const DEFAULTS = {
  hue: { min: 0, max: 360 },
  saturation: { min: 70, max: 100 },
  lightness: { min: 45, max: 65 },
  variation: { min: 5, max: 20, enabled: true },
  shift: { min: 60, max: 300 },
  figurealpha: { min: 0.7, max: 1.2 },
  light: { top: 10, right: -8, left: -4, enabled: true },
};

/* -------------------- utils -------------------- */

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
function pickRange(rng: number, min: number, max: number) {
  return min + (rng % (max - min));
}
// Normalize seed for keccak256: always pass a valid input type.
function normalizeSeed(seed: unknown): string | Uint8Array | ArrayBuffer {
  if (seed instanceof Uint8Array || seed instanceof ArrayBuffer) return seed;
  return String(seed ?? "");
}

/* -------------------- component -------------------- */

type Props = {
  seed: string | number | bigint | Uint8Array | ArrayBuffer;
  size?: number;          // px
  borderRadius?: number;  // px
  backgroundColor?: string; // optional background (behind triangles)
};

export default function HashIconNativeSVG({
  seed,
  size = 40,
  borderRadius = 8,
  backgroundColor = "transparent",
}: Props) {
  const data = useMemo(() => {
    // 1) Original hashing path: keccak → arrayBuffer → Uint16Array
    const buf = keccak256.arrayBuffer(normalizeSeed(seed));
    const u16 = new Uint16Array(buf);

    // 2) Derive base H/S/L and modifiers (exactly like the UMD)
    const hue = pickRange(u16[0], DEFAULTS.hue.min, DEFAULTS.hue.max);
    const sat = pickRange(u16[1], DEFAULTS.saturation.min, DEFAULTS.saturation.max);
    const lig = pickRange(u16[2], DEFAULTS.lightness.min, DEFAULTS.lightness.max);
    const shift = pickRange(u16[3], DEFAULTS.shift.min, DEFAULTS.shift.max);
    const figA =
      pickRange(
        u16[4],
        Math.round(DEFAULTS.figurealpha.min * 10),
        Math.round(DEFAULTS.figurealpha.max * 10)
      ) / 10;

    // 3) Pattern index
    const patternIndex = u16[5] % PATTERN.length;

    // 4) Variation seed
    const varBase = u16[6] ?? 0;

    const lightOf = (dir?: LightDir) => {
      if (!DEFAULTS.light.enabled || !dir) return 0;
      return DEFAULTS.light[dir] ?? 0;
    };

    const elems = ELEMENTS.map((e, idx) => {
      const tri = TRIANGLES[e.shape];
      // variation per element like original: Math.round(n[6]/(c+1)) → pick in range
      const vRand = Math.round(varBase / (idx + 1));
      const variation = DEFAULTS.variation.enabled
        ? pickRange(vRand, DEFAULTS.variation.min, DEFAULTS.variation.max)
        : 0;

      // Base fill color (HSL, with light offset)
      const H1 = ((Math.round(hue + variation) % 360) + 360) % 360;
      const S1 = Math.round(sat); // 0..100 (CSS percentage)
      const L1 = Math.round(clamp(lig + lightOf(e.light), 0, 100));

      const baseColor = colord({ h: H1, s: S1, l: L1 }).toRgbString(); // "rgb(...)"

      // Overlay color (hue shifted by 'shift'), alpha added later per pattern
      const H2 = ((Math.round(hue + shift + variation) % 360) + 360) % 360;
      const S2 = Math.round(sat);
      const L2 = Math.round(clamp(lig + lightOf(e.light), 0, 100));

      return {
        hidden: !!e.hidden,
        x: e.x,
        y: e.y,
        tri,
        baseColor,
        overlayH: H2,
        overlayS: S2,
        overlayL: L2,
      };
    });

    return { elems, patternIndex, figA };
  }, [seed]);

  // Convert triangle (relative 0..1) to absolute path for the given size
  const toPath = (t: (typeof TRIANGLES)[number], ox: number, oy: number) => {
    const X = (v: number) => (v + ox) * size;
    const Y = (v: number) => (v + oy) * size;
    return `M ${X(t.x1)},${Y(t.y1)} L ${X(t.x2)},${Y(t.y2)} L ${X(t.x3)},${Y(t.y3)} Z`;
  };

  const { elems, patternIndex, figA } = data;

  return (
    <View style={{ width: size, height: size, overflow: "hidden", borderRadius }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {backgroundColor !== "transparent" && (
          <Rect x={0} y={0} width={size} height={size} fill={backgroundColor} />
        )}

        <G>
          {elems.map((el, i) => {
            if (el.hidden) return null;

            const d = toPath(el.tri, el.x, el.y);

            // Base layer
            const base = <Path key={`b-${i}`} d={d} fill={el.baseColor} />;

            // Pattern overlay alpha: patternCell(0..9) * figA / 10 (same as UMD)
            const cell = PATTERN[patternIndex][i] ?? 0;
            let overlay: React.ReactNode = null;
            if (cell > 0) {
              const alpha = (cell * figA) / 10;
              const ov = colord({
                h: el.overlayH,
                s: el.overlayS,
                l: el.overlayL,
                a: alpha,
              }).toRgbString(); // "rgba(...)"
              overlay = <Path key={`o-${i}`} d={d} fill={ov} />;
            }

            return (
              <React.Fragment key={i}>
                {base}
                {overlay}
              </React.Fragment>
            );
          })}
        </G>
      </Svg>
    </View>
  );
}
