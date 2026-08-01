import { Navigate } from "react-router-dom";
import useRegisterDraft from "../context/useRegisterDraft.js";

function RequireCategory({ children }) {
  const { draft } = useRegisterDraft();

  if (!draft.category) {
    return <Navigate to="/register/category" replace />;
  }

  return children;
}

export default RequireCategory;
