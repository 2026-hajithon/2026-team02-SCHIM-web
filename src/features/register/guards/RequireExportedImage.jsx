import { Navigate } from "react-router-dom";
import useRegisterDraft from "../context/useRegisterDraft.js";

function RequireExportedImage({ children }) {
  const { draft } = useRegisterDraft();

  if (!draft.category) {
    return <Navigate to="/register/category" replace />;
  }

  if (!draft.selectedContent) {
    return <Navigate to="/register/content" replace />;
  }

  if (!draft.pngBlob) {
    return <Navigate to="/register/editor" replace />;
  }

  return children;
}

export default RequireExportedImage;
