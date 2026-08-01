import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import {
  Image,
  Layer,
  Line,
  Rect,
  Stage,
  Text,
  Transformer,
} from "react-konva";
import useCanvasImage from "./useCanvasImage.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./canvasConfig.js";
import CanvasGuideBorder from "./CanvasGuideBorder.jsx";
import CanvasImageElement from "./CanvasImageElement.jsx";

function getLineDragPosition(points, position) {
  const xPoints = points.filter((_, index) => index % 2 === 0);
  const yPoints = points.filter((_, index) => index % 2 === 1);
  const minX = Math.min(...xPoints);
  const maxX = Math.max(...xPoints);
  const minY = Math.min(...yPoints);
  const maxY = Math.max(...yPoints);

  return {
    x: Math.min(Math.max(position.x, -minX), CANVAS_WIDTH - maxX),
    y: Math.min(Math.max(position.y, -minY), CANVAS_HEIGHT - maxY),
  };
}

function StickerElement({
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

const CanvasStage = forwardRef(function CanvasStage(
  {
    document,
    activeTool,
    selectedElementId,
    onSelect,
    onMove,
    onTransform,
    onTextPlace,
    onDrawStart,
    onDrawMove,
    onDrawEnd,
  },
  ref,
) {
  const stageRef = useRef(null);
  const transformerRef = useRef(null);

  useImperativeHandle(ref, () => stageRef.current, []);

  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;

    if (!transformer || !stage || !selectedElementId) {
      transformer?.nodes([]);
      transformer?.getLayer()?.batchDraw();
      return;
    }

    const [selectedNode] = stage.find(
      (node) => node.getAttr("elementId") === selectedElementId,
    );

    transformer.nodes(selectedNode ? [selectedNode] : []);
    transformer.getLayer()?.batchDraw();
  }, [document.elements, selectedElementId]);

  const handlePointerDown = (event) => {
    if (
      event.target === transformerRef.current ||
      event.target.getParent() === transformerRef.current
    ) {
      return;
    }

    const elementId = event.target.getAttr("elementId");

    if (elementId) {
      onSelect(elementId);
      return;
    }

    if (activeTool === "draw") {
      onDrawStart(event.target.getStage().getPointerPosition());
      return;
    }

    if (event.target === event.target.getStage()) {
      onSelect(null);
    }
  };

  const handlePointerMove = (event) => {
    if (activeTool !== "draw") {
      return;
    }

    onDrawMove(event.target.getStage().getPointerPosition());
  };

  const handleContainerPointerDown = (event) => {
    if (activeTool !== "text") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    onTextPlace({
      x: ((event.clientX - bounds.left) / bounds.width) * CANVAS_WIDTH,
      y: ((event.clientY - bounds.top) / bounds.height) * CANVAS_HEIGHT,
    });
  };

  return (
    <div
      onPointerDown={handleContainerPointerDown}
      className="relative aspect-[9/14] w-full touch-none overflow-clip rounded-[20px] [&_.konvajs-content]:!absolute [&_.konvajs-content]:!inset-0 [&_.konvajs-content]:!h-full [&_.konvajs-content]:!w-full [&_canvas]:!h-full [&_canvas]:!w-full"
    >
      <Stage
        ref={stageRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={onDrawEnd}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={onDrawEnd}
      >
        <Layer>
          <Rect
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            fill={document.background}
            listening={false}
          />

          {[...document.elements]
            .sort((first, second) =>
              (first.zIndex ?? 0) - (second.zIndex ?? 0),
            )
            .map((element) => {
            if (element.type === "text") {
              const scaleX = element.scaleX ?? 1;
              const scaleY = element.scaleY ?? 1;
              const elementHeight =
                element.height ?? element.fontSize * 1.5;

              return (
                <Text
                  key={element.id}
                  id={element.id}
                  elementId={element.id}
                  text={element.text}
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  fill={element.color}
                  fontFamily="Pretendard Variable, Pretendard, sans-serif"
                  fontSize={element.fontSize}
                  fontStyle="600"
                  lineHeight={1.5}
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
                      Math.max(0, CANVAS_HEIGHT - elementHeight * scaleY),
                    ),
                  })}
                  stroke={
                    selectedElementId === element.id ? "#211f1a" : undefined
                  }
                  strokeWidth={
                    selectedElementId === element.id ? 0.35 : 0
                  }
                  onClick={() => onSelect(element.id)}
                  onTap={() => onSelect(element.id)}
                  onDragEnd={(event) =>
                    onMove(element.id, event.target.x(), event.target.y())
                  }
                  onTransformEnd={(event) =>
                    onTransform(element.id, event.target)
                  }
                />
              );
            }

            if (element.type === "photo") {
              return (
                <CanvasImageElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElementId === element.id}
                  onSelect={() => onSelect(element.id)}
                  onMove={onMove}
                  onTransform={onTransform}
                />
              );
            }

            if (element.type === "sticker") {
              return (
                <StickerElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElementId === element.id}
                  onSelect={() => onSelect(element.id)}
                  onMove={onMove}
                  onTransform={onTransform}
                />
              );
            }

            if (element.type === "line") {
              return (
                <Line
                  key={element.id}
                  id={element.id}
                  elementId={element.id}
                  points={element.points}
                  x={element.x ?? 0}
                  y={element.y ?? 0}
                  rotation={element.rotation ?? 0}
                  scaleX={element.scaleX ?? 1}
                  scaleY={element.scaleY ?? 1}
                  stroke={element.color}
                  strokeWidth={element.strokeWidth}
                  tension={0.35}
                  lineCap="round"
                  lineJoin="round"
                  draggable
                  dragBoundFunc={(position) =>
                    getLineDragPosition(element.points, position)
                  }
                  hitStrokeWidth={20}
                  shadowColor={
                    selectedElementId === element.id ? "#211f1a" : undefined
                  }
                  shadowBlur={selectedElementId === element.id ? 4 : 0}
                  onClick={() => onSelect(element.id)}
                  onTap={() => onSelect(element.id)}
                  onDragEnd={(event) =>
                    onMove(element.id, event.target.x(), event.target.y())
                  }
                  onTransformEnd={(event) =>
                    onTransform(element.id, event.target)
                  }
                />
              );
            }

            return null;
          })}

          <Transformer
            ref={transformerRef}
            rotateEnabled
            keepRatio
            flipEnabled={false}
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
            ]}
            borderStroke="#211f1a"
            borderDash={[6, 4]}
            anchorFill="#fffaf0"
            anchorStroke="#211f1a"
            anchorSize={9}
            boundBoxFunc={(oldBox, newBox) => {
              const isTooSmall =
                Math.abs(newBox.width) < 24 || Math.abs(newBox.height) < 24;
              const isOutsideCanvas =
                newBox.x < 0 ||
                newBox.y < 0 ||
                newBox.x + newBox.width > CANVAS_WIDTH ||
                newBox.y + newBox.height > CANVAS_HEIGHT;

              return isTooSmall || isOutsideCanvas ? oldBox : newBox;
            }}
          />
        </Layer>
      </Stage>
      <CanvasGuideBorder />
    </div>
  );
});

export default CanvasStage;
