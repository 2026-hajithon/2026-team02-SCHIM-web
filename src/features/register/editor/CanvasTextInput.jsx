import { useEffect, useRef, useState } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./canvasConfig.js";

function CanvasTextInput({ position, color, onComplete, onCancel }) {
  const inputRef = useRef(null);
  const [text, setText] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const completeText = () => {
    const nextText = text.trim();

    if (nextText) {
      onComplete(nextText, position, color);
      return;
    }

    onCancel();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
      return;
    }

    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      completeText();
    }
  };

  return (
    <textarea
      ref={inputRef}
      value={text}
      rows={3}
      enterKeyHint="done"
      aria-label="캔버스 텍스트 입력"
      onChange={(event) => setText(event.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={completeText}
      className="absolute z-10 resize-none overflow-hidden border-0 bg-transparent p-0 text-[15px] leading-[1.5] font-semibold tracking-[-0.03em] outline-none"
      style={{
        color,
        left: `${(position.x / CANVAS_WIDTH) * 100}%`,
        top: `${(position.y / CANVAS_HEIGHT) * 100}%`,
        width: `${Math.min(72, ((CANVAS_WIDTH - position.x) / CANVAS_WIDTH) * 100)}%`,
      }}
    />
  );
}

export default CanvasTextInput;
