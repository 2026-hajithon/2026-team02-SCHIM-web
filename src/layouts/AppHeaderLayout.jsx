import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/common/header/AppHeader.jsx";
import MenuOverlay from "../components/common/menu/MenuOverlay.jsx";
import AppShell from "./AppShell.jsx";

// 로고 또는 페이지 제목과 메뉴가 필요한 일반 화면용 레이아웃입니다.
function AppHeaderLayout({
  children,
  title,
  className = "",
  contentClassName = "",
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((isOpen) => !isOpen), []);

  return (
    <AppShell className={className}>
      <div className="flex min-h-dvh flex-col">
        <AppHeader
          className="bg-bg-base relative z-50"
          title={title}
          menuExpanded={isMenuOpen}
          menuControls="app-menu-overlay"
          onMenuClick={toggleMenu}
        />

        <main
          className={`min-h-0 flex-1 ${contentClassName}`}
          aria-hidden={isMenuOpen || undefined}
          inert={isMenuOpen}
        >
          {children ?? <Outlet />}
        </main>
      </div>

      <MenuOverlay isOpen={isMenuOpen} onClose={closeMenu} />
    </AppShell>
  );
}

export default AppHeaderLayout;
