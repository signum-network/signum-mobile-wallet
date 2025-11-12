// Direction of the light influence for shading
export type LightDir = "top" | "right" | "left";

// Structure representing one drawable element (a single triangle cell)
export type Elem = {
  x: number;
  y: number;
  shape: 0 | 1;        // 0 = first triangle type, 1 = second triangle type
  light?: LightDir;    // optional light direction for shading
  hidden?: boolean;    // if true, this triangle is not rendered
};

/**
 * === ELEMENTS ===
 * This array defines the relative positions, shapes, and light directions
 * for all small triangles that make up a single hashicon.
 * It was copied directly from the original JavaScript source (array "e").
 */
export const ELEMENTS: Elem[] = [
  { x: 0,    y: 0,     shape: 1, hidden: true },
  { x: 0,    y: 0,     shape: 0, light: "top" },
  { x: 0,    y: 0.25,  shape: 1, light: "left" },
  { x: 0,    y: 0.25,  shape: 0, light: "left" },
  { x: 0,    y: 0.5,   shape: 1, light: "left" },
  { x: 0,    y: 0.5,   shape: 0, light: "left" },
  { x: 0,    y: 0.75,  shape: 1, hidden: true },
  { x: 0.25, y: -0.125, shape: 0, light: "top" },
  { x: 0.25, y: 0.125, shape: 1, light: "top" },
  { x: 0.25, y: 0.125, shape: 0, light: "top" },
  { x: 0.25, y: 0.375, shape: 1, light: "left" },
  { x: 0.25, y: 0.375, shape: 0, light: "left" },
  { x: 0.25, y: 0.625, shape: 1, light: "left" },
  { x: 0.25, y: 0.625, shape: 0, light: "left" },
  { x: 0.5,  y: 0,     shape: 1, light: "top" },
  { x: 0.5,  y: 0,     shape: 0, light: "top" },
  { x: 0.5,  y: 0.25,  shape: 1, light: "top" },
  { x: 0.5,  y: 0.25,  shape: 0, light: "right" },
  { x: 0.5,  y: 0.5,   shape: 1, light: "right" },
  { x: 0.5,  y: 0.5,   shape: 0, light: "right" },
  { x: 0.5,  y: 0.75,  shape: 1, light: "right" },
  { x: 0.75, y: -0.125, shape: 0, hidden: true },
  { x: 0.75, y: 0.125, shape: 1, light: "top" },
  { x: 0.75, y: 0.125, shape: 0, light: "right" },
  { x: 0.75, y: 0.375, shape: 1, light: "right" },
  { x: 0.75, y: 0.375, shape: 0, light: "right" },
  { x: 0.75, y: 0.625, shape: 1, light: "right" },
  { x: 0.75, y: 0.625, shape: 0, hidden: true },
];

/**
 * === TRIANGLES ===
 * Each triangle shape is defined by three relative coordinates.
 * These are used as templates for drawing all cells in the icon grid.
 * Copied directly from the original JavaScript array "r".
 */
export const TRIANGLES = [
  { x1: 0, y1: 0.25, x2: 0.25, y2: 0.125, x3: 0.25, y3: 0.375 }, // triangle type 0
  { x1: 0, y1: 0,    x2: 0.25, y2: 0.125, x3: 0,    y3: 0.25  }, // triangle type 1
];

/**
 * === DEFAULTS ===
 * These parameters control color generation and lighting effects.
 * The values are the same as in the original UMD source,
 * but rewritten in a more readable format.
 */
export const DEFAULTS = {
  size: 100, // default canvas size used in original library
  hue:        { min: 0,   max: 360 },
  saturation: { min: 70,  max: 100 },
  lightness:  { min: 45,  max: 65 },
  variation:  { min: 5,   max: 20, enabled: true },
  shift:      { min: 60,  max: 300 },
  figurealpha:{ min: 0.7, max: 1.2 },
  light:      { top: 10, right: -8, left: -4, enabled: true },
};
