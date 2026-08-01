import { Navigate } from "react-router-dom";
import useRegisterDraft from "../context/useRegisterDraft.js";

function RequireCreatedCard({ children }) {
  const { draft } = useRegisterDraft();

  if (!draft.createdCard) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RequireCreatedCard;
