import { Image } from "react-konva";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./canvasConfig.js";
import useCanvasImage from "./useCanvasImage.js";

function CanvasImageElement({
  element,
  isSelected,
  onSelect,
  onMove,
  onTransform,
}) {
  const image = useCanvasImage(element.src);
  const scaleX = element.scaleX ?? 1;
  const scaleY = element.scaleY ?? 1;

  return (
    <Image
      image={image}
      id={element.id}
      elementId={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation ?? 0}
      scaleX={scaleX}
      scaleY={scaleY}
      draggable
      dragBoundFunc={(position) => ({
        x: Math.min(
          Math.max(position.x, 0),
          Math.max(0, CANVAS_WIDTH - element.width * scaleX),
        ),
        y: Math.min(
          Math.max(position.y, 0),
          Math.max(0, CANVAS_HEIGHT - element.height * scaleY),
        ),
      })}
      stroke={isSelected ? "#211f1a" : undefined}
      strokeWidth={isSelected ? 1.5 : 0}
      dash={isSelected ? [6, 4] : undefined}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(event) =>
        onMove(element.id, event.target.x(), event.target.y())
      }
      onTransformEnd={(event) => onTransform(element.id, event.target)}
    />
  );
}

export default CanvasImageElement;
