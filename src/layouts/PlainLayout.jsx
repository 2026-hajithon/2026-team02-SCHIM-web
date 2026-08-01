import { Outlet } from "react-router-dom";
import AppShell from "./AppShell.jsx";

// 자체 헤더를 사용하거나 헤더가 필요 없는 화면용 레이아웃입니다.
function PlainLayout({
  children,
  className = "",
  contentClassName = "",
}) {
  return (
    <AppShell>
      <div className={`flex min-h-dvh flex-col ${className}`}>
        <main className={`min-h-0 flex-1 ${contentClassName}`}>
          {children ?? <Outlet />}
        </main>
      </div>
    </AppShell>
  );
}

export default PlainLayout;
