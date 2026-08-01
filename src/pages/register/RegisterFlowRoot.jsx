import { Outlet } from "react-router";
import RegisterDraftProvider from "../../features/register/context/RegisterDraftProvider.jsx";

// 등록 하위 라우트가 이동하는 동안 작성 중인 데이터를 유지합니다.
function RegisterFlowRoot() {
  return (
    <RegisterDraftProvider>
      <Outlet />
    </RegisterDraftProvider>
  );
}

export default RegisterFlowRoot;
