import imageIcon from "../../../assets/icon/image.svg";
import penIcon from "../../../assets/icon/ink_pen.svg";
import stickerIcon from "../../../assets/icon/kid_star.svg";
import textIcon from "../../../assets/icon/text_fields.svg";
import { CANVAS_PALETTE } from "./canvasConfig.js";

const tools = [
  { id: "text", label: "텍스트 추가", icon: textIcon },
  { id: "draw", label: "손그림", icon: penIcon },
  { id: "photo", label: "사진 추가", icon: imageIcon },
  { id: "sticker", label: "스티커 추가", icon: stickerIcon },
];

function CanvasDock({ activeTool, color, onToolSelect, onColorSelect }) {
  const showColorPalette = activeTool === "draw";

  return (
    <div
      className={`bg-bg-base mx-auto flex items-center gap-2 overflow-hidden rounded-[17px] px-4 py-2.5 shadow-[0_5px_17px_rgba(0,0,0,0.28)] ${
        showColorPalette ? "w-full" : "w-fit"
      }`}
    >
      {tools.map((tool) => {
        const isActive = activeTool === tool.id;

        return (
          <button
            key={tool.id}
            type="button"
            aria-label={tool.label}
            aria-pressed={isActive}
            onClick={() => onToolSelect(tool.id)}
            className={`grid size-10 shrink-0 place-items-center rounded-[9px] ${
              isActive ? "bg-paper-base" : ""
            }`}
          >
            <span
              aria-hidden="true"
              className={`block size-[18px] ${
                isActive ? "bg-ink-base" : "bg-ink-soft"
              }`}
              style={{
                WebkitMask: `url("${tool.icon}") center / contain no-repeat`,
                mask: `url("${tool.icon}") center / contain no-repeat`,
              }}
            />
          </button>
        );
      })}

      <span className="bg-ink-soft h-5 w-px shrink-0" aria-hidden="true" />

      {showColorPalette && (
        <div className="flex min-w-0 flex-1 items-center justify-between">
          {CANVAS_PALETTE.map((paletteColor, index) => (
            <button
              key={paletteColor}
              type="button"
              aria-label={`${index + 1}번째 색상 선택`}
              aria-pressed={color === paletteColor}
              onClick={() => onColorSelect(paletteColor)}
              className={`size-4 rounded-full border ${
                color === paletteColor
                  ? "border-paper-base"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: paletteColor }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CanvasDock;
