import { useNavigate } from "react-router";
import FloatingButton from "../components/common/button/FloatingButton.jsx";

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <section className="py-6">
        <h1 className="sr-only">홈</h1>
        <p className="body-15-r text-text-muted-warm">
          낯선 사람의 감상을 스치며 콘텐츠를 발견해보세요.
        </p>
      </section>

      <div className="absolute right-6 bottom-[max(24px,env(safe-area-inset-bottom))]">
        <FloatingButton onClick={() => navigate("/register")} />
      </div>
    </>
  );
}

export default HomePage;
