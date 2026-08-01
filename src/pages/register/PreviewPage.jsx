import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router";
import GuestbookCard from "../../components/Guestbookcard.jsx";
import starIcon from "../../assets/icon/star.svg";
import RegisterCompleteView from "../../features/register/components/RegisterCompleteView.jsx";
import useRegisterDraft from "../../features/register/context/useRegisterDraft.js";

function downloadCardImage(imageBlob) {
  const downloadUrl = URL.createObjectURL(imageBlob);
  const anchor = document.createElement("a");

  anchor.href = downloadUrl;
  anchor.download = `schim-card-${Date.now()}.png`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
}

function formatCardDate(date) {
  const hour = date.getHours();
  const period =
    hour < 6 ? "새벽" : hour < 12 ? "오전" : hour < 18 ? "오후" : "저녁";
  const displayHour = hour % 12 || 12;
  const pad = (value) => String(value).padStart(2, "0");

  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(
    date.getDate(),
  )} ${period} ${displayHour}:${pad(date.getMinutes())}`;
}

function PreviewPage() {
  const navigate = useNavigate();
  const { draft, dispatch } = useRegisterDraft();
  const reducedMotion = useReducedMotion();
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const flipTimerRef = useRef(null);
  const completeTimerRef = useRef(null);
  const isCompleteScheduledRef = useRef(false);
  const [createdAt] = useState(() => formatCardDate(new Date()));
  const isSaving = submitStatus === "saving";
  const isExperienceScreen =
    submitStatus === "sending" ||
    submitStatus === "sent" ||
    submitStatus === "complete";

  useEffect(
    () => () => {
      window.clearTimeout(flipTimerRef.current);
      window.clearTimeout(completeTimerRef.current);
    },
    [],
  );

  const handleSubmit = () => {
    if (isSaving) {
      return;
    }

    setSubmitStatus("saving");
    setErrorMessage("");

    try {
      if (!draft.pngBlob) {
        throw new Error("저장할 카드 이미지가 없어요.");
      }

      downloadCardImage(draft.pngBlob);
      setSubmitStatus("sending");
      flipTimerRef.current = window.setTimeout(() => {
        setIsFlipped(true);
        setSubmitStatus("sent");
      }, reducedMotion ? 0 : 700);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "감상카드 저장에 실패했어요. 다시 시도해주세요.",
      );
    }
  };

  const handleFlipComplete = () => {
    if (isCompleteScheduledRef.current) {
      return;
    }

    isCompleteScheduledRef.current = true;
    completeTimerRef.current = window.setTimeout(
      () => setSubmitStatus("complete"),
      reducedMotion ? 0 : 700,
    );
  };

  const handleLeaveComplete = () => {
    dispatch({ type: "RESET" });
    navigate("/", { replace: true });
  };

  const categoryColor =
    {
      PLACE: "var(--color-key-place-500)",
      BOOK: "var(--color-key-book-500)",
      MUSIC: "var(--color-key-music-500)",
      MOVIE: "var(--color-key-movie-500)",
      SHOW: "var(--color-key-show-500)",
    }[draft.category] ?? "var(--color-text-light)";

  const contentCardData = {
    title: draft.selectedContent?.title || "코인세탁방 24시",
    subtitle:
      draft.selectedContent?.description ||
      (draft.category === "PLACE" ? "서울 마포구 연남동" : ""),
    type: draft.category === "PLACE" ? "세탁소" : "",
    quote: '"가만히 앉아 보고 있으니, 복잡했던\n생각도 조금씩 정리되네요."',
    guestbookCount: 12,
  };

  if (isExperienceScreen) {
    return (
      <section
        className="bg-bg-base relative min-h-dvh overflow-hidden"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          {submitStatus !== "complete" ? (
            <motion.div
              key="card"
              className="absolute inset-0"
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { y: "-100%", scale: 0.85, opacity: 0 }
              }
              transition={{
                duration: reducedMotion ? 0.01 : 0.35,
                ease: "easeIn",
              }}
            >
              <span
                aria-hidden="true"
                className="absolute top-[147px] left-1/2 block h-[21px] w-[19px] -translate-x-1/2"
                style={{
                  backgroundColor: isFlipped
                    ? categoryColor
                    : "var(--color-text-light)",
                  WebkitMask: `url("${starIcon}") center / contain no-repeat`,
                  mask: `url("${starIcon}") center / contain no-repeat`,
                }}
              />

              <div className="absolute top-[208px] left-1/2 -translate-x-1/2">
                <GuestbookCard
                  id="preview"
                  category={draft.category}
                  initialDate={createdAt}
                  imageUrl={draft.previewUrl}
                  imageAlt="작성한 감상 카드 미리보기"
                  interactive={false}
                  flipped={isFlipped}
                  content={contentCardData}
                  onFlipComplete={handleFlipComplete}
                />
              </div>
            </motion.div>
          ) : (
            <RegisterCompleteView
              key="complete"
              reducedMotion={reducedMotion}
              onExplore={handleLeaveComplete}
              onHome={handleLeaveComplete}
            />
          )}
        </AnimatePresence>
      </section>
    );
  }

  return (
    <section className="bg-bg-base text-text-light flex min-h-dvh flex-col px-6 pt-[max(62px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <button
        type="button"
        aria-label="에디터로 돌아가기"
        onClick={() => navigate(-1)}
        className="text-text-muted-warm h-[27px] w-fit text-[18px] leading-[1.5]"
      >
        ←
      </button>

      <div className="mt-[19px] text-center">
        <h1 className="text-[22px] leading-[1.5] font-bold tracking-[-0.03em]">
          나의 감상 카드가 만들어졌어요
        </h1>
        <p className="body-13-r text-text-muted-warm mt-1.5 tracking-[-0.03em]">
          열어보기 전까진 카드 내용만 보여요
        </p>
      </div>

      <div className="mx-auto mt-[42px] h-[419px] w-[285px]">
        <GuestbookCard
          id="preview"
          category={draft.category}
          initialDate={createdAt}
          imageUrl={draft.previewUrl}
          imageAlt="작성한 감상 카드 미리보기"
          interactive={false}
          className="origin-top-left scale-[0.890625]"
        />
      </div>

      {errorMessage && (
        <p className="body-13-r mt-4 text-center text-red-400" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="mt-[59px] grid h-[50px] grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={isSaving}
          className="border-overlay-ghost body-15-m rounded-md border px-4 py-3 disabled:opacity-50"
        >
          다시 편집
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSaving}
          className="bg-bg-muted text-text-light body-15-m rounded-md px-4 py-3 disabled:opacity-50"
        >
          {isSaving ? "저장 중" : "보내기"}
        </button>
      </div>
    </section>
  );
}

export default PreviewPage;
