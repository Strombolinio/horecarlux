/**
 * BrandName — renders "HoReCarLux" with per-letter colour styling.
 *   H  → red         (#ef4444)
 *   R  → silver-white (#e2e8f0)
 *   C  → light-blue  (#7dd3fc)
 *   all other letters → inherit parent colour
 */

interface LetterStyle {
  color?: string;
}

const LETTER_STYLES: Record<number, LetterStyle> = {
  0: { color: "#ef4444" }, // H — red
  2: { color: "#e2e8f0" }, // R — silver-white
  4: { color: "#7dd3fc" }, // C — light-blue
};

const BRAND = "HoReCarLux";

export function BrandName() {
  return (
    <>
      {BRAND.split("").map((char, i) => {
        const style = LETTER_STYLES[i];
        // Use char+index as key — string is fixed, positions never reorder
        const key = `${char}-${i}`;
        return style ? (
          <span key={key} style={{ color: style.color }}>
            {char}
          </span>
        ) : (
          <span key={key}>{char}</span>
        );
      })}
    </>
  );
}
