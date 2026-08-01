import { useContext } from "react";
import RegisterDraftContext from "./registerDraftContext.js";

function useRegisterDraft() {
  const context = useContext(RegisterDraftContext);

  if (!context) {
    throw new Error(
      "useRegisterDraft must be used within RegisterDraftProvider",
    );
  }

  return context;
}

export default useRegisterDraft;
