import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import RequireCategory from "../features/register/guards/RequireCategory.jsx";
import RequireCreatedCard from "../features/register/guards/RequireCreatedCard.jsx";
import RequireExportedImage from "../features/register/guards/RequireExportedImage.jsx";
import RequireSelectedContent from "../features/register/guards/RequireSelectedContent.jsx";
import AppHeaderLayout from "../layouts/AppHeaderLayout.jsx";
import PlainLayout from "../layouts/PlainLayout.jsx";
import RegisterLayout from "../layouts/RegisterLayout.jsx";
import ArchivePage from "../pages/ArchivePage.jsx";
import HeaderShowcasePage from "../pages/HeaderShowcasePage.jsx";
import HomePage from "../pages/HomePage.jsx";
import OnboardingPage from "../pages/OnboardingPage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import CategoryPage from "../pages/register/CategoryPage.jsx";
import CompletePage from "../pages/register/CompletePage.jsx";
import ContentPage from "../pages/register/ContentPage.jsx";
import EditorPage from "../pages/register/EditorPage.jsx";
import PreviewPage from "../pages/register/PreviewPage.jsx";
import RegisterFlowRoot from "../pages/register/RegisterFlowRoot.jsx";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppHeaderLayout contentClassName="relative px-6" />}>
          <Route index element={<HomePage />} />
        </Route>

        <Route
          element={
            <AppHeaderLayout
              title="나의 감상카드"
              contentClassName="px-6"
            />
          }
        >
          <Route
            path="/my-cards"
            element={<ArchivePage type="reflectionCard" />}
          />
        </Route>

        <Route
          element={
            <AppHeaderLayout
              title="발견한 콘텐츠"
              contentClassName="px-6"
            />
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
                  <EditorPage />
                </RequireSelectedContent>
              }
            />
            <Route
              path="preview"
              element={
                <RequireExportedImage>
                  <PreviewPage />
                </RequireExportedImage>
              }
            />
            <Route
              path="complete"
              element={
                <RequireCreatedCard>
                  <CompletePage />
                </RequireCreatedCard>
              }
            />
          </Route>
        </Route>

        <Route path="/onboarding" element={<PlainLayout contentClassName="px-6" />}>
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
    </BrowserRouter>
  );
}

export default AppRouter;
