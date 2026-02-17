export interface TextOptions {
  align?: "left" | "center" | "right" | "justify";
  angle?: number;
  charSpace?: number;
  horizontalScale?: number;
  isInputVisual?: boolean;
  isInputRtl?: boolean;
  isOutputVisual?: boolean;
  isOutputRtl?: boolean;
  isSymmetricSwapping?: boolean;
  lineHeightFactor?: number;
  maxWidth?: number;
  renderingMode?:
    | "fill"
    | "stroke"
    | "fillThenStroke"
    | "invisible"
    | "fillAndAddForClipping"
    | "strokeAndAddForClipping"
    | "fillThenStrokeAndAddForClipping"
    | "addToPathForClipping";
  baseline?:
    | "alphabetic"
    | "ideographic"
    | "bottom"
    | "top"
    | "middle"
    | "hanging";
}
