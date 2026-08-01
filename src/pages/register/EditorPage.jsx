import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import stickerAsset from "../../assets/sticker/star-red.svg";
import CanvasDock from "../../features/register/editor/CanvasDock.jsx";
import CanvasStage from "../../features/register/editor/CanvasStage.jsx";
import CanvasTextInput from "../../features/register/editor/CanvasTextInput.jsx";
import {
  BACKGROUND_PALETTE,
  EXPORT_PIXEL_RATIO,
  MAX_IMAGE_BYTES,
} from "../../features/register/editor/canvasConfig.js";
import useRegisterDraft from "../../features/register/context/useRegisterDraft.js";

function createElementId(type) {
  return `${type}-${crypto.randomUUID()}`;
}

function getNextZIndex(elements) {
  return Math.max(-1, ...elements.map((element) => element.zIndex ?? 0)) + 1;
}

function EditorPage() {
  const navigate = useNavigate();
  const { draft, dispatch } = useRegisterDraft();
  const stageRef = useRef(null);
  const fileInputRef = useRef(null);
  const drawingLineIdRef = useRef(null);
  const documentRef = useRef(draft.canvasDocument);
  const [canvasDocument, setCanvasDocument] = useState(draft.canvasDocument);
  const [activeTool, setActiveTool] = useState("draw");
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [drawColor, setDrawColor] = useState("#211f1a");
  const [textInputPosition, setTextInputPosition] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const setDocument = (updater, persist = true) => {
    const nextDocument =
      typeof updater === "function"
        ? updater(documentRef.current)
        : updater;

    documentRef.current = nextDocument;
    setCanvasDocument(nextDocument);

    if (persist) {
      dispatch({ type: "SET_CANVAS_DOCUMENT", payload: nextDocument });
    }
  };

  const handleToolSelect = (tool) => {
    setErrorMessage("");
    setActiveTool(tool);
    setSelectedElementId(null);
    setTextInputPosition(null);

    if (tool === "text") {
      return;
    }

    if (tool === "photo") {
      fileInputRef.current?.click();
      return;
    }

    if (tool === "sticker") {
      const stickerCount = canvasDocument.elements.filter(
        (element) => element.type === "sticker",
      ).length;
      const sticker = {
        id: createElementId("sticker"),
        type: "sticker",
        src: stickerAsset,
        x: 270 - (stickerCount % 4) * 18,
        y: 90 + (stickerCount % 4) * 22,
        width: 52,
        height: 58,
        rotation: -14,
        scaleX: 1,
        scaleY: 1,
        zIndex: getNextZIndex(canvasDocument.elements),
      };

      setDocument((currentDocument) => ({
        ...currentDocument,
        elements: [...currentDocument.elements, sticker],
      }));
      setSelectedElementId(sticker.id);
    }
  };

  const handleAddText = (text, position, color) => {
    const textCount = canvasDocument.elements.filter(
      (element) => element.type === "text",
    ).length;
    const textElement = {
      id: createElementId("text"),
      type: "text",
      text,
      x: Math.min(position.x, 310),
      y: Math.min(position.y, 520),
      width: Math.max(50, 328 - position.x),
      height: 68,
      color,
      fontSize: 15,
      rotation: textCount % 2 === 0 ? -2 : 0,
      scaleX: 1,
      scaleY: 1,
      zIndex: getNextZIndex(canvasDocument.elements),
    };

    setDocument((currentDocument) => ({
      ...currentDocument,
      elements: [...currentDocument.elements, textElement],
    }));
    setSelectedElementId(textElement.id);
    setActiveTool(null);
    setTextInputPosition(null);
  };

  const handlePhotoSelect = (event) => {
    const [file] = event.target.files;
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("이미지 파일을 선택해주세요.");
      return;
    }

    const photo = {
      id: createElementId("photo"),
      type: "photo",
      src: URL.createObjectURL(file),
      x: 50,
      y: 145,
      width: 260,
      height: 195,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      zIndex: getNextZIndex(canvasDocument.elements),
    };

    setDocument((currentDocument) => ({
      ...currentDocument,
      elements: [
        ...currentDocument.elements.filter(
          (element) => element.type !== "photo",
        ),
        photo,
      ],
    }));
    setSelectedElementId(photo.id);
    setActiveTool(null);
  };

  const handleMove = (elementId, x, y) => {
    setDocument((currentDocument) => ({
      ...currentDocument,
      elements: currentDocument.elements.map((element) =>
        element.id === elementId ? { ...element, x, y } : element,
      ),
    }));
  };

  const handleTransform = (elementId, node) => {
    setDocument((currentDocument) => ({
      ...currentDocument,
      elements: currentDocument.elements.map((element) =>
        element.id === elementId
          ? {
              ...element,
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
              scaleX: node.scaleX(),
              scaleY: node.scaleY(),
            }
          : element,
      ),
    }));
  };

  const handleLayerOrder = (direction) => {
    if (!selectedElementId) {
      return;
    }

    setDocument((currentDocument) => {
      const orderedElements = [...currentDocument.elements].sort(
        (first, second) =>
          (first.zIndex ?? 0) - (second.zIndex ?? 0),
      );
      const currentIndex = orderedElements.findIndex(
        (element) => element.id === selectedElementId,
      );
      const nextIndex = Math.min(
        Math.max(currentIndex + direction, 0),
        orderedElements.length - 1,
      );

      if (currentIndex < 0 || currentIndex === nextIndex) {
        return currentDocument;
      }

      [orderedElements[currentIndex], orderedElements[nextIndex]] = [
        orderedElements[nextIndex],
        orderedElements[currentIndex],
      ];

      return {
        ...currentDocument,
        elements: orderedElements.map((element, index) => ({
          ...element,
          zIndex: index,
        })),
      };
    });
  };

  const handleDelete = () => {
    if (!selectedElementId) {
      return;
    }

    setDocument((currentDocument) => ({
      ...currentDocument,
      elements: currentDocument.elements.filter(
        (element) => element.id !== selectedElementId,
      ),
    }));
    setSelectedElementId(null);
  };

  useEffect(() => {
    const handleDeleteKey = (event) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement;

      if (
        isTyping ||
        !selectedElementId ||
        (event.key !== "Delete" && event.key !== "Backspace")
      ) {
        return;
      }

      event.preventDefault();
      const nextDocument = {
        ...documentRef.current,
        elements: documentRef.current.elements.filter(
          (element) => element.id !== selectedElementId,
        ),
      };

      documentRef.current = nextDocument;
      setCanvasDocument(nextDocument);
      dispatch({ type: "SET_CANVAS_DOCUMENT", payload: nextDocument });
      setSelectedElementId(null);
    };

    window.addEventListener("keydown", handleDeleteKey);
    return () => window.removeEventListener("keydown", handleDeleteKey);
  }, [dispatch, selectedElementId]);

  const handleDrawStart = (point) => {
    if (!point) {
      return;
    }

    const lineId = createElementId("line");
    drawingLineIdRef.current = lineId;
    setDocument(
      (currentDocument) => ({
        ...currentDocument,
        elements: [
          ...currentDocument.elements,
          {
            id: lineId,
            type: "line",
            points: [point.x, point.y],
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            zIndex: getNextZIndex(currentDocument.elements),
            color: drawColor,
            strokeWidth: 5,
          },
        ],
      }),
      false,
    );
  };

  const handleDrawMove = (point) => {
    const lineId = drawingLineIdRef.current;

    if (!lineId || !point) {
      return;
    }

    setDocument(
      (currentDocument) => ({
        ...currentDocument,
        elements: currentDocument.elements.map((element) =>
          element.id === lineId
            ? { ...element, points: [...element.points, point.x, point.y] }
            : element,
        ),
      }),
      false,
    );
  };

  const handleDrawEnd = () => {
    if (!drawingLineIdRef.current) {
      return;
    }

    drawingLineIdRef.current = null;
    dispatch({
      type: "SET_CANVAS_DOCUMENT",
      payload: documentRef.current,
    });
  };

  const handleColorSelect = (color) => {
    if (activeTool === "background") {
      setDocument((currentDocument) => ({
        ...currentDocument,
        background: color,
      }));
      return;
    }

    setDrawColor(color);
  };

  const handleExport = async () => {
    if (!stageRef.current || isExporting) {
      return;
    }

    setIsExporting(true);
    setErrorMessage("");
    setSelectedElementId(null);

    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));

      let blob = await stageRef.current.toBlob({
        pixelRatio: EXPORT_PIXEL_RATIO,
        mimeType: "image/png",
      });

      if (blob.size > MAX_IMAGE_BYTES) {
        blob = await stageRef.current.toBlob({
          pixelRatio: 2,
          mimeType: "image/png",
        });
      }

      if (blob.size > MAX_IMAGE_BYTES) {
        throw new Error("IMAGE_TOO_LARGE");
      }

      const previewUrl = URL.createObjectURL(blob);
      dispatch({
        type: "SET_EXPORTED_IMAGE",
        payload: { blob, previewUrl },
      });
      navigate("/register/preview");
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message === "IMAGE_TOO_LARGE"
          ? "이미지 용량이 너무 커요. 사진을 줄이고 다시 시도해주세요."
          : "카드를 이미지로 만드는 데 실패했어요.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="bg-paper-base text-ink-base flex min-h-dvh flex-col px-6 pt-[max(32px,env(safe-area-inset-top))] ">
      <header className="flex h-[38px] items-center gap-4">
        <button
          type="button"
          aria-label="콘텐츠 선택으로 돌아가기"
          onClick={() => navigate("/register/content", { replace: true })}
          className="text-xl"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="실행 취소"
          disabled
          className="text-ink-soft text-lg"
        >
          ↺
        </button>
        <button
          type="button"
          aria-label="다시 실행"
          disabled
          className="text-paper-tape text-lg"
        >
          ↻
        </button>

        <span className="flex-1" />

        {selectedElementId && (
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleLayerOrder(-1)}
              className="body-13-r text-ink-soft px-1.5 py-2"
            >
              뒤로
            </button>
            <button
              type="button"
              onClick={() => handleLayerOrder(1)}
              className="body-13-r text-ink-soft px-1.5 py-2"
            >
              앞으로
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="body-13-sb text-ink-soft px-1.5 py-2"
            >
              삭제
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="bg-bg-base text-paper-base body-13-sb rounded-full px-4 py-2.5 disabled:opacity-50"
        >
          {isExporting ? "저장 중" : "다음"}
        </button>
      </header>

      <div className="relative mx-auto mt-[17px] w-full max-w-[342px]">
        <CanvasStage
          ref={stageRef}
          document={canvasDocument}
          activeTool={activeTool}
          selectedElementId={selectedElementId}
          onSelect={setSelectedElementId}
          onMove={handleMove}
          onTransform={handleTransform}
          onTextPlace={setTextInputPosition}
          onDrawStart={handleDrawStart}
          onDrawMove={handleDrawMove}
          onDrawEnd={handleDrawEnd}
        />
        {textInputPosition && (
          <CanvasTextInput
            position={textInputPosition}
            color={drawColor}
            onComplete={handleAddText}
            onCancel={() => setTextInputPosition(null)}
          />
        )}
      </div>

      {errorMessage && (
        <p className="body-13-r mt-3 text-center text-red-600" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="mx-auto mt-5 w-full max-w-[342px]">
        {activeTool === "background" && (
          <div className="mb-3 flex items-center justify-center gap-3">
            {BACKGROUND_PALETTE.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`배경색 ${color}`}
                aria-pressed={canvasDocument.background === color}
                onClick={() => handleColorSelect(color)}
                className="border-paper-tape size-7 rounded-full border"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        <CanvasDock
          activeTool={activeTool}
          color={drawColor}
          onToolSelect={handleToolSelect}
          onColorSelect={handleColorSelect}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoSelect}
        className="sr-only"
      />
    </section>
  );
}

export default EditorPage;
