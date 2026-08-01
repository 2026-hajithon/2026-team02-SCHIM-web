import { useState } from "react";
import FloatingButton from "../components/common/button/FloatingButton.jsx";
import AppHeader from "../components/common/header/AppHeader.jsx";
import RegisterHeader from "../components/common/header/RegisterHeader.jsx";

const headerExamples = [
  { label: "로고", title: undefined },
  { label: "홈", title: "홈" },
  { label: "나의 감상카드", title: "나의 감상카드" },
  { label: "발견한 콘텐츠", title: "발견한 콘텐츠" },
  { label: "빈 state", title: " " },
];

function HeaderShowcasePage() {
  const [lastAction, setLastAction] = useState("메뉴 버튼을 눌러보세요.");

  return (
    <div className="mx-auto max-w-[860px]">
        <header className="mb-10">
          <p className="text-text-muted-grey body-13-sb mb-2 uppercase">
            Common component
          </p>
          <h1 className="heading-30-sb">Header showcase</h1>
          <p className="text-text-muted-warm body-15-r mt-3">
            로고형과 페이지 제목형 헤더를 동일한 규격으로 비교합니다.
          </p>
        </header>

        <div className="grid gap-6">
          {headerExamples.map(({ label, title }) => (
            <section key={label}>
              <p className="text-text-muted-warm body-13-sb mb-2">{label}</p>
              <div className="bg-bg-base w-full max-w-[388px] overflow-hidden rounded-lg ring-1 ring-white/10">
                <AppHeader
                  title={title}
                  menuLabel={`${label} 메뉴 열기`}
                  onMenuClick={() =>
                    setLastAction(`${label} 헤더의 메뉴를 눌렀습니다.`)
                  }
                />
              </div>
            </section>
          ))}
        </div>

        <section className="mt-14">
          <div className="mb-5">
            <p className="text-text-muted-grey body-13-sb mb-2 uppercase">
              Register flow
            </p>
            <h2 className="heading-24-b">Register header</h2>
          </div>

          <div className="bg-bg-base flex w-full max-w-[390px] flex-col gap-5 rounded-lg px-6 py-5 ring-1 ring-white/10">
            {[1, 2, 3].map((step) => (
              <RegisterHeader
                key={step}
                currentStep={step}
                onClose={() => setLastAction("등록 취소 버튼을 눌렀습니다.")}
                onBack={() =>
                  setLastAction(`${step}단계에서 이전 단계 버튼을 눌렀습니다.`)
                }
              />
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-5">
            <p className="text-text-muted-grey body-13-sb mb-2 uppercase">
              Primary action
            </p>
            <h2 className="heading-24-b">Floating button</h2>
          </div>

          <FloatingButton
            onClick={() => setLastAction("감상카드 작성 버튼을 눌렀습니다.")}
          />
        </section>

        <output
          className="text-text-muted-grey body-13-r mt-8 block"
          aria-live="polite"
        >
          {lastAction}
        </output>
    </div>
  );
}

export default HeaderShowcasePage;
