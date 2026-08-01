import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import RequireCategory from "../features/register/guards/RequireCategory.jsx";
import RequireExportedImage from "../features/register/guards/RequireExportedImage.jsx";
import RequireSelectedContent from "../features/register/guards/RequireSelectedContent.jsx";
import AppHeaderLayout from "../layouts/AppHeaderLayout.jsx";
import PlainLayout from "../layouts/PlainLayout.jsx";
import RegisterLayout from "../layouts/RegisterLayout.jsx";
import ArchivePage from "../pages/ArchivePage.jsx";
import HeaderShowcasePage from "../pages/HeaderShowcasePage.jsx";
import HomePage from "../pages/HomePage.jsx";
import ContentsPage from "../pages/ContentsPage.jsx";
import OnboardingPage from "../pages/OnboardingPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import CategoryPage from "../pages/register/CategoryPage.jsx";
import ContentPage from "../pages/register/ContentPage.jsx";
import RegisterFlowRoot from "../pages/register/RegisterFlowRoot.jsx";

const EditorPage = lazy(() => import("../pages/register/EditorPage.jsx"));
const PreviewPage = lazy(() => import("../pages/register/PreviewPage.jsx"));

// 💡 1. 온보딩 완료 여부를 검사하는 가드(Guard) 컴포넌트를 추가합니다.
function InitialRoute() {
  const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
  const hasAnonymousToken = Boolean(
    localStorage.getItem("schim.anonymousToken"),
  );

  if (!hasSeenOnboarding && !hasAnonymousToken) {
    // 온보딩을 안 봤다면 온보딩 페이지로 리다이렉트
    return <Navigate to="/onboarding" replace />;
  }

  // 온보딩을 봤다면 원래대로 홈 화면 렌더링
  return <HomePage />;
}

function AppRouter() {
  return (
    <Routes>
      {/* 💡 2. index(기본 경로)에 HomePage 대신 검사소인 InitialRoute를 연결합니다. */}
      <Route index element={<InitialRoute />} />

      <Route path="/contents" element={<ContentsPage />} />
      <Route
        element={
          <AppHeaderLayout title="발견한 콘텐츠" contentClassName="px-6" />
        }
      >
        <Route
          path="/discoveries"
          element={<ArchivePage type="discoveries" />}
        />
      </Route>

      <Route element={<AppHeaderLayout title="설정" contentClassName="px-6" />}>
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="/register" element={<RegisterFlowRoot />}>
        <Route index element={<Navigate to="category" replace />} />

        <Route element={<RegisterLayout currentStep={1} />}>
          <Route path="category" element={<CategoryPage />} />
        </Route>

        <Route element={<RegisterLayout currentStep={2} />}>
          <Route
            path="content"
            element={
              <RequireCategory>
                <ContentPage />
              </RequireCategory>
            }
          />
        </Route>

        <Route element={<PlainLayout />}>
          <Route
            path="editor"
            element={
              <RequireSelectedContent>
                <Suspense fallback={null}>
                  <EditorPage />
                </Suspense>
              </RequireSelectedContent>
            }
          />
          <Route
            path="preview"
            element={
              <RequireExportedImage>
                <Suspense fallback={null}>
                  <PreviewPage />
                </Suspense>
              </RequireExportedImage>
            }
          />
        </Route>
      </Route>

      <Route
        path="/onboarding"
        element={<PlainLayout contentClassName="px-6" />}
      >
        <Route index element={<OnboardingPage />} />
        <Route path="nickname" element={<OnboardingPage nickname />} />
      </Route>

      {import.meta.env.DEV && (
        <Route
          path="/showcase"
          element={
            <PlainLayout contentClassName="bg-bg-raised text-text-light px-5 py-10" />
          }
        >
          <Route index element={<HeaderShowcasePage />} />
        </Route>
      )}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
