import { Navigate } from "react-router-dom";
import useRegisterDraft from "../context/useRegisterDraft.js";

function RequireSelectedContent({ children }) {
  const { draft } = useRegisterDraft();

  if (!draft.category) {
    return <Navigate to="/register/category" replace />;
  }

  if (!draft.selectedContent) {
    return <Navigate to="/register/content" replace />;
  }

  return children;
}

export default RequireSelectedContent;
