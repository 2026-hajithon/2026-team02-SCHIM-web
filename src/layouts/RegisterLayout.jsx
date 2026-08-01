import { Outlet, useNavigate } from "react-router";
import RegisterHeader from "../components/common/header/RegisterHeader.jsx";
import AppShell from "./AppShell.jsx";

// 단계 헤더와 공통 좌우 여백을 제공하는 등록 플로우 전용 레이아웃입니다.
function RegisterLayout({
  currentStep,
  totalStep = 3,
  className = "",
  contentClassName = "",
}) {
  const navigate = useNavigate();

  return (
    <AppShell>
      <div
        className={`flex min-h-dvh flex-col px-6 pt-[max(12px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))] ${className}`}
      >
        <RegisterHeader
          currentStep={currentStep}
          totalStep={totalStep}
          onBack={() => navigate(-1)}
          onClose={() => navigate("/")}
        />

        <main className={`mt-[22px] min-h-0 flex-1 ${contentClassName}`}>
          <Outlet />
        </main>
      </div>
    </AppShell>
  );
}

export default RegisterLayout;
