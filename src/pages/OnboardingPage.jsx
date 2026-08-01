import { useState } from "react";
import { useNavigate } from "react-router-dom";
import onboardingOne from "../assets/Onboarding 1.svg";
import onboardingTwo from "../assets/Onboarding 2.svg";
import profileImg from "../assets/Profile.svg";
import Button from "../components/common/Button.jsx";
import AppShell from "../layouts/AppShell.jsx";

const slides = [
  {
    image: onboardingOne,
    title: "우연히 만나는 새로운 취향",
    description: "타인이 자신의 감상을 남긴 카드만 확인할 수 있어요",
  },
  {
    image: onboardingTwo,
    title: "카테고리 구분 없는 다양한 탐색",
    description: "책일 수도, 노래일 수도, 코인세탁방일 수도 있어요.",
  },
];

const nicknames = [
  "익명의 세탁소 요정",
  "익명의 오후 산책자",
  "익명의 새벽 독서가",
  "익명의 노래 수집가",
];

function Dots({ current, total = 3 }) {
  return (
    <div
      className="flex items-center justify-center gap-2"
      aria-label={`${current + 1} / ${total}`}
    >
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={`size-2.5 rounded-full ${index === current ? "bg-[var(--color-paper-base)]" : "bg-[var(--color-text-muted-grey)]"}`}
        />
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [nicknameIndex, setNicknameIndex] = useState(0);
  const isNicknameStep = step === 2;
  const slide = slides[step];

  const handleNext = () => {
    if (isNicknameStep) {
      // 💡 1. 온보딩을 완료했다는 기록을 로컬 스토리지에 남깁니다.
      localStorage.setItem("hasSeenOnboarding", "true");

      // 💡 2. /home 대신 기본 경로("/")로 이동하도록 수정합니다.
      navigate("/", { replace: true });
      return;
    }

    setStep((current) => current + 1);
  };

  return (
    <AppShell>
      <main className="flex min-h-dvh flex-col overflow-hidden bg-bg-base px-6 py-8 text-[var(--color-text-light)]">
        <div className="flex flex-1 flex-col items-center justify-center">
          {isNicknameStep ? (
            <section className="flex w-full flex-col items-center text-center">
              {/* CSS 그라데이션 대신 실제 프로필 에셋 사용 */}
              <img
                src={profileImg}
                alt="프로필"
                className="mb-4 size-[60px] object-cover"
              />
              <p className="body-15-sb">{nicknames[nicknameIndex]}</p>
              <button
                type="button"
                onClick={() =>
                  setNicknameIndex(
                    (current) => (current + 1) % nicknames.length,
                  )
                }
                className="body-13-r mt-4 rounded-[6px] bg-[var(--color-bg-elev-warm)] px-4 py-2 text-[var(--color-text-cream)]"
              >
                다시 뽑기
              </button>
            </section>
          ) : (
            <div className="relative max-h-[50dvh] w-full max-w-[262px] overflow-hidden">
              <img
                src={slide.image}
                alt="온보딩 안내"
                className="max-h-[50dvh] w-full object-contain"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--color-bg-base)] via-[color-mix(in_srgb,var(--color-bg-base)_85%,transparent)] to-transparent backdrop-blur-[2px]" />
            </div>
          )}
        </div>

        <section className="flex shrink-0 flex-col items-center text-center">
          <h1 className="heading-24-b">
            {isNicknameStep ? "당신의 이름은 비밀이에요" : slide.title}
          </h1>
          <p className="body-15-r mt-3 text-[var(--color-text-muted-grey)]">
            {isNicknameStep
              ? "별명이 마음에 들 때까지 뽑아보세요"
              : slide.description}
          </p>
          <div className="my-7">
            <Dots current={step} />
          </div>
          <Button
            variant={isNicknameStep ? "primary-light" : "primary-dark"}
            size="full"
            onClick={handleNext}
          >
            {isNicknameStep ? "시작하기" : "다음"}
          </Button>
        </section>
      </main>
    </AppShell>
  );
}
