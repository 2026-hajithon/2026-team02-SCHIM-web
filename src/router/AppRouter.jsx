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

function AppRouter() {
  return (
    <Routes>
        <Route index element={<HomePage />} />
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

        <Route
          element={<AppHeaderLayout title="설정" contentClassName="px-6" />}
        >
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
