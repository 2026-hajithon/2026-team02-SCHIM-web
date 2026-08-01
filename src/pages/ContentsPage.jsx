import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import GuestbookCard from "../components/common/Guestbookcard.jsx";
import getContentGuestbooks from "../features/contents/api/getContentGuestbooks.js";
import AppShell from "../layouts/AppShell.jsx";

const categoryTheme = {
  PLACE: {
    label: "장소",
    color: "var(--color-key-place-500)",
  },
  MUSIC: {
    label: "음악",
    color: "var(--color-key-music-500)",
  },
  BOOK: {
    label: "도서",
    color: "var(--color-key-book-500)",
  },
  MOVIE: {
    label: "영화",
    color: "var(--color-key-movie-500)",
  },
  SHOW: {
    label: "공연",
    color: "var(--color-key-show-500)",
  },
  PERFORMANCE: {
    label: "공연",
    color: "var(--color-key-show-500)",
  },
  ETC: {
    label: "기타",
    color: "var(--color-paper-base)",
  },
};

function formatCreatedAt(createdAt) {
  if (!createdAt) {
    return "";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function readCachedContent(contentId) {
  if (!contentId) {
    return null;
  }

  try {
    const cached = window.sessionStorage.getItem(
      `schim.content.${contentId}`,
    );

    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

export default function ContentsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const requestIdRef = useRef(0);
  const contentId = params.get("contentId") ?? params.get("deckId");
  const content = useMemo(
    () => location.state?.content ?? readCachedContent(contentId),
    [contentId, location.state],
  );
  const [cards, setCards] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const loadGuestbooks = useCallback(async () => {
    if (!contentId) {
      setLoadStatus("error");
      setErrorMessage("콘텐츠 정보를 찾을 수 없어요.");
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoadStatus("loading");
    setErrorMessage("");

    try {
      const result = await getContentGuestbooks({ contentId });

      if (requestId !== requestIdRef.current) {
        return;
      }

      setCards(result.items);
      setNextCursor(result.nextCursor);
      setHasNext(result.hasNext);
      setLoadStatus("success");
    } catch {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setErrorMessage("방명록을 불러오지 못했어요. 다시 시도해주세요.");
      setLoadStatus("error");
    }
  }, [contentId]);

  useEffect(() => {
    if (contentId && location.state?.content) {
      window.sessionStorage.setItem(
        `schim.content.${contentId}`,
        JSON.stringify(location.state.content),
      );
    }

    const timeoutId = window.setTimeout(loadGuestbooks, 0);

    return () => window.clearTimeout(timeoutId);
  }, [contentId, loadGuestbooks, location.state]);

  const loadMoreGuestbooks = async () => {
    if (!contentId || !hasNext || !nextCursor || loadStatus === "loading-more") {
      return;
    }

    setLoadStatus("loading-more");

    try {
      const result = await getContentGuestbooks({
        contentId,
        cursor: nextCursor,
      });

      setCards((current) => {
        const knownIds = new Set(current.map((card) => card.guestbookId));
        const newCards = result.items.filter(
          (card) => !knownIds.has(card.guestbookId),
        );

        return [...current, ...newCards];
      });
      setNextCursor(result.nextCursor);
      setHasNext(result.hasNext);
      setLoadStatus("success");
    } catch {
      setLoadStatus("success");
    }
  };

  const theme = categoryTheme[content?.category] ?? {
    label: "콘텐츠",
    color: "var(--color-paper-base)",
  };
  const title = content?.title ?? "콘텐츠 방명록";
  const subtitle = content?.subtitle ?? content?.description ?? "";

  return (
    <AppShell>
      <main className="min-h-dvh bg-bg-base pb-[72px]">
        <section
          className="relative rounded-b-[4px] px-6 pt-8 pb-6 text-ink-base"
          style={{ backgroundColor: theme.color }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="이전 페이지로 돌아가기"
            className="absolute top-5 right-5 grid size-9 place-items-center rounded-full transition-colors hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-base"
          >
            <span aria-hidden="true" className="text-[22px] leading-none">
              ×
            </span>
          </button>

          <div className="caption-12-sb mb-6 inline-flex rounded-full bg-ink-base px-3 py-1 text-paper-base">
            {theme.label}
          </div>
          <h1 className="heading-24-b pr-10">{title}</h1>
          {subtitle && <p className="body-13-r mt-1 opacity-75">{subtitle}</p>}
        </section>

        <section
          className="grid grid-cols-2 gap-3 px-4 pt-4"
          aria-label={`${title} 방명록 카드 목록`}
        >
          {loadStatus === "loading" ? (
            <p className="body-15-r text-text-muted-warm col-span-2 py-16 text-center">
              방명록을 불러오는 중이에요.
            </p>
          ) : loadStatus === "error" ? (
            <div className="col-span-2 flex flex-col items-center gap-4 py-16 text-center">
              <p className="body-15-r text-text-muted-warm" role="alert">
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={loadGuestbooks}
                className="body-15-m rounded-md bg-bg-muted px-4 py-2"
              >
                다시 시도
              </button>
            </div>
          ) : cards.length === 0 ? (
            <p className="body-15-r text-text-muted-warm col-span-2 py-16 text-center">
              아직 등록된 방명록이 없어요.
            </p>
          ) : (
            cards.map((card) => (
              <GuestbookCard
                key={card.guestbookId}
                id={card.guestbookId}
                category={content?.category}
                initialDate={formatCreatedAt(card.createdAt)}
                imageUrl={card.imageUrl}
                imageAlt={`${card.authorNickname}님의 감상 카드`}
                compact
                disabled
              />
            ))
          )}
        </section>

        {hasNext && loadStatus !== "loading" && (
          <div className="px-4 pt-6">
            <button
              type="button"
              onClick={loadMoreGuestbooks}
              disabled={loadStatus === "loading-more"}
              className="body-15-m w-full rounded-md bg-bg-muted py-3 disabled:opacity-50"
            >
              {loadStatus === "loading-more" ? "불러오는 중" : "더 보기"}
            </button>
          </div>
        )}
      </main>
    </AppShell>
  );
}
