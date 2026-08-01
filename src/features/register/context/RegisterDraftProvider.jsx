import { useEffect, useMemo, useReducer, useRef } from "react";
import RegisterDraftContext from "./registerDraftContext.js";

function createEmptyCanvas() {
  return {
    version: 1,
    background: "#fffaf0",
    elements: [],
  };
}

function createInitialDraft() {
  return {
    category: null,
    searchQuery: "",
    selectedContent: null,
    canvasDocument: createEmptyCanvas(),
    pngBlob: null,
    previewUrl: null,
    createdCard: null,
  };
}

function registerDraftReducer(state, action) {
  switch (action.type) {
    case "SET_CATEGORY":
      return {
        ...createInitialDraft(),
        category: action.payload,
      };

    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
      };

    case "SET_CONTENT":
      return {
        ...state,
        selectedContent: action.payload,
        canvasDocument: createEmptyCanvas(),
        pngBlob: null,
        previewUrl: null,
        createdCard: null,
      };

    case "SET_CANVAS_DOCUMENT":
      return {
        ...state,
        canvasDocument: action.payload,
      };

    case "SET_EXPORTED_IMAGE":
      return {
        ...state,
        pngBlob: action.payload.blob,
        previewUrl: action.payload.previewUrl,
      };

    case "SET_CREATED_CARD":
      return {
        ...state,
        createdCard: action.payload,
      };

    case "RESET":
      return createInitialDraft();

    default:
      return state;
  }
}

function RegisterDraftProvider({ children }) {
  const photoUrlsRef = useRef(new Set());
  const [draft, dispatch] = useReducer(
    registerDraftReducer,
    undefined,
    createInitialDraft,
  );

  useEffect(
    () => () => {
      if (draft.previewUrl) {
        URL.revokeObjectURL(draft.previewUrl);
      }
    },
    [draft.previewUrl],
  );

  useEffect(() => {
    const nextPhotoUrls = new Set(
      draft.canvasDocument.elements
        .filter(
          (element) =>
            element.type === "photo" && element.src?.startsWith("blob:"),
        )
        .map((element) => element.src),
    );

    photoUrlsRef.current.forEach((url) => {
      if (!nextPhotoUrls.has(url)) {
        URL.revokeObjectURL(url);
      }
    });

    photoUrlsRef.current = nextPhotoUrls;
  }, [draft.canvasDocument.elements]);

  useEffect(
    () => () => {
      photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  const value = useMemo(() => ({ draft, dispatch }), [draft]);

  return (
    <RegisterDraftContext.Provider value={value}>
      {children}
    </RegisterDraftContext.Provider>
  );
}

export default RegisterDraftProvider;
