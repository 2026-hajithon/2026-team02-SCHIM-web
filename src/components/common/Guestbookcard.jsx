import { useState } from "react";
import { motion } from "framer-motion";

// TODO: 실제 방명록 열기 API로 교체
const openGuestbookAPI = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === "deleted-id") return reject({ status: 404 });

      resolve({
        title: "코인세탁방 24시",
        subtitle: "서울 마포구 연남동",
        type: "세탁소",
        quote: '"가만히 앉아 보고 있으니, 복잡했던\n생각도 조금씩 정리되네요."',
        guestbookCount: 12,
      });
    }, 600);
  });
};

export default function GuestbookCard({
  id,
  category,
  initialDate,
  onRefresh,
  onFlip,
  compact = false,
  disabled = false,
  imageUrl,
  imageAlt = "작성한 감상 카드",
  interactive = true,
  flipped,
  content,
  onFlipComplete,
  className = "",
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const isControlled = flipped !== undefined;
  const resolvedFlipped = isControlled ? flipped : isFlipped;
  const resolvedData = content ?? data;
  const canInteract = interactive && !disabled;

  const handleCardTap = async () => {
    if (!canInteract || resolvedFlipped || isLoading) return;

    setIsLoading(true);
    try {
      const response = content ?? (await openGuestbookAPI(id));
      setData(response);

      if (!isControlled) {
        setIsFlipped(true);
      }

      onFlip?.(id);
    } catch (error) {
      if (error.status === 404) {
        alert("사라진 방명록이에요.");
        onRefresh?.();
      } else {
        alert("오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const categoryLabel =
    {
      PLACE: "장소",
      BOOK: "도서",
      MUSIC: "음악",
      MOVIE: "영화",
      SHOW: "공연",
    }[category] || "콘텐츠";

  const categoryBgColor =
    {
      PLACE: "var(--color-key-place-500)",
      BOOK: "var(--color-key-book-500)",
      MUSIC: "var(--color-key-music-500)",
      MOVIE: "var(--color-key-movie-500)",
      SHOW: "var(--color-key-show-500)",
    }[category] || "var(--color-key-place-500)";

  return (
    <div
      className={`relative [perspective:1000px] ${
        canInteract ? "cursor-pointer" : "cursor-default"
      } ${compact ? "aspect-[126/184] w-full" : "h-[470px] w-[320px]"} ${className}`}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: resolvedFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
        onAnimationComplete={() => {
          if (resolvedFlipped) {
            onFlipComplete?.();
          }
        }}
        onClick={canInteract ? handleCardTap : undefined}
      >
        <div
          className={`card-blind absolute inset-0 flex h-full w-full flex-col items-center rounded-[4.14px] [backface-visibility:hidden] ${
            compact
              ? "gap-2 p-2.5"
              : "gap-[16.57px] px-[24px] pt-[28px] pb-[20px]"
          }`}
        >
          <div
            className={`flex w-full flex-1 items-center justify-center overflow-hidden border border-dashed border-[#b0a89f]/40 ${
              compact ? "rounded" : "rounded-[22px]"
            }`}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={imageAlt}
                className="size-full object-contain"
              />
            ) : (
              <span
                className={`${
                  compact ? "caption-12-r" : "body-17-sb"
                } text-[var(--color-ink-soft)] opacity-60`}
              >
                콘텐츠 영역
              </span>
            )}
          </div>

          <div className="caption-12-r text-[var(--color-ink-soft)]">
            {initialDate}
          </div>
        </div>

        {compact ? (
          <div
            className="absolute inset-0 flex h-full w-full flex-col items-center gap-2 rounded-[4.14px] p-2.5 text-[var(--color-ink-base)] shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={{ backgroundColor: categoryBgColor }}
          >
            <div className="flex shrink-0 items-center justify-center rounded-full border border-[var(--color-ink-base)]/20 px-2 py-0.5">
              <span className="caption-12-r">{categoryLabel}</span>
            </div>

            <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-md bg-[#d9d9d9] bg-black/5 shadow-inner">
              {resolvedData?.thumbnail && (
                <img
                  src={resolvedData.thumbnail}
                  alt={resolvedData.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="flex shrink-0 flex-col items-center">
              <h2 className="body-13-sb text-center leading-tight">
                {resolvedData?.title}
              </h2>
              <p className="caption-12-r text-center leading-tight opacity-75">
                {resolvedData?.subtitle}
              </p>
            </div>
          </div>
        ) : (
          <div
            className="text-ink-base absolute inset-0 h-full w-full rounded-[4.14px] shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]"
            style={{ backgroundColor: categoryBgColor }}
          >
            <div className="absolute top-[49px] left-1/2 flex w-[200px] -translate-x-1/2 flex-col items-center gap-[26px]">
              <div className="bg-bg-base rounded-full px-3.5 py-1.5 text-white">
                <span className="caption-12-sb leading-none">
                  {categoryLabel}
                </span>
              </div>

              <div className="flex w-full flex-col items-center gap-5 text-center">
                <h2 className="heading-26-b w-full whitespace-nowrap">
                  {resolvedData?.title}
                </h2>
                <div className="body-15-m text-ink-base/80 flex flex-col gap-0.5">
                  {resolvedData?.subtitle && <p>{resolvedData.subtitle}</p>}
                  {resolvedData?.type && <p>{resolvedData.type}</p>}
                </div>
              </div>
            </div>

            <div className="absolute top-[285px] left-[29px] flex w-[262px] flex-col items-center gap-3 text-center">
              <div className="bg-bg-base/25 h-px w-full" />
              {resolvedData?.quote && (
                <p className="body-15-r text-ink-base/80 whitespace-pre-line">
                  {resolvedData.quote}
                </p>
              )}
              <p className="text-ink-base text-[11px] leading-none font-semibold">
                이 콘텐츠에 남겨진 방명록 {resolvedData?.guestbookCount ?? 0}개
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
