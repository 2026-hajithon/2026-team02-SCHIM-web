import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import starIconSrc from "../assets/icon/star.svg";
import heartIconSrc from "../assets/icon/favorite.svg";
import Button from "../components/common/Button";
import FloatingButton from "../components/common/button/FloatingButton";
import GuestbookCard from "../components/common/Guestbookcard";
import getSurfCards from "../features/surfing/api/getSurfCards.js";
import openGuestbook from "../features/surfing/api/openGuestbook.js";
import AppHeaderLayout from "../layouts/AppHeaderLayout";

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

export default function Home() {
  const navigate = useNavigate();
  const requestIdRef = useRef(0);
  const [cards, setCards] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedState, setFlippedState] = useState({});
  const [openedState, setOpenedState] = useState({});
  const [savedState, setSavedState] = useState({});
  const [nextCursor, setNextCursor] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const loadInitialCards = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setLoadStatus("loading");
    setErrorMessage("");

    try {
      const result = await getSurfCards();

      if (requestId !== requestIdRef.current) {
        return;
      }

      setCards(result.items);
      setNextCursor(result.nextCursor);
      setHasNext(result.hasNext);
      setActiveIndex(0);
      setLoadStatus("success");
    } catch {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setErrorMessage("카드를 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
      setLoadStatus("error");
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadInitialCards, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadInitialCards]);

  const loadMoreCards = async () => {
    if (!hasNext || !nextCursor || loadStatus === "loading-more") {
      return;
    }

    setLoadStatus("loading-more");

    try {
      const result = await getSurfCards({ cursor: nextCursor });

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

  const currentCard = cards[activeIndex];
  const currentCardId = currentCard?.guestbookId;
  const isCurrentFlipped = Boolean(flippedState[currentCardId]);
  const isCurrentSaved = Boolean(savedState[currentCardId]);

  const handleFlip = (id, openedCard) => {
    setFlippedState((current) => ({ ...current, [id]: true }));
    setOpenedState((current) => ({ ...current, [id]: openedCard }));
    setSavedState((current) => ({
      ...current,
      [id]: Boolean(openedCard.saved),
    }));
  };

  const handleSave = () => {
    setSavedState((current) => ({
      ...current,
      [currentCardId]: true,
    }));
  };

  const handleOpenContent = () => {
    const content = openedState[currentCardId];
    const contentId = content?.contentId;

    navigate(
      contentId
        ? `/contents?contentId=${encodeURIComponent(contentId)}`
        : "/contents",
      { state: contentId ? { content } : undefined },
    );
  };

  return (
    <AppHeaderLayout>
      <div className="relative flex min-h-full flex-col items-center overflow-y-auto px-4 pt-6 pb-24">
        <div className="mb-4 flex shrink-0 flex-col items-center text-center text-text-light">
          <p className="body-15-r mb-2 opacity-80">익명의 감상이에요</p>
          <h1 className="heading-26-b leading-snug">
            오늘은 어떤
            <br />
            카드를 읽어볼까요?
          </h1>

          <div className="mt-3 flex items-center justify-center">
            <img
              src={isCurrentSaved ? heartIconSrc : starIconSrc}
              alt=""
              className={`size-6 ${
                isCurrentSaved
                  ? "scale-110 opacity-100"
                  : "scale-100 opacity-90"
              }`}
            />
          </div>
        </div>

        <div className="my-auto flex w-full flex-col items-center justify-center py-2">
          {loadStatus === "loading" ? (
            <p className="body-15-r text-text-muted-warm">카드를 불러오는 중이에요.</p>
          ) : loadStatus === "error" ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="body-15-r text-text-muted-warm" role="alert">
                {errorMessage}
              </p>
              <button
                type="button"
                onClick={loadInitialCards}
                className="body-15-m rounded-md bg-bg-muted px-4 py-2"
              >
                다시 시도
              </button>
            </div>
          ) : cards.length === 0 ? (
            <p className="body-15-r text-text-muted-warm">
              지금 읽을 수 있는 카드가 없어요.
            </p>
          ) : (
            <Swiper
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              onReachEnd={loadMoreCards}
              slidesPerView="auto"
              centeredSlides
              spaceBetween={-140}
              touchRatio={0.65}
              speed={550}
              resistanceRatio={0.4}
              className="w-full overflow-visible [&_.swiper-slide-active]:z-20 [&_.swiper-slide]:z-0"
            >
              {cards.map((card) => (
                <SwiperSlide
                  key={card.guestbookId}
                  style={{ width: "320px" }}
                >
                  {({ isActive }) => (
                    <div
                      className={`flex justify-center transition-all duration-500 ${
                        isActive
                          ? "scale-100 opacity-100"
                          : "scale-[0.85] opacity-40"
                      }`}
                    >
                      <div className={isActive ? "" : "pointer-events-none"}>
                        <GuestbookCard
                          id={card.guestbookId}
                          initialDate={formatCreatedAt(card.createdAt)}
                          imageUrl={card.imageUrl}
                          imageAlt={`${card.authorNickname}님의 감상 카드`}
                          onOpen={openGuestbook}
                          onRefresh={loadInitialCards}
                          onFlip={handleFlip}
                        />
                      </div>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        <div className="z-30 mt-4 flex w-full shrink-0 justify-center">
          {!isCurrentFlipped ? (
            <div className="flex w-full max-w-[342px] justify-end">
              <FloatingButton
                onClick={() => navigate("/register")}
                label="방명록 작성하기"
              />
            </div>
          ) : (
            <div className="flex w-full max-w-[342px] justify-center gap-3">
              <Button
                variant="secondary-outline"
                size="half"
                onClick={handleSave}
              >
                {isCurrentSaved ? "저장 완료" : "내 리스트에 저장"}
              </Button>
              <Button
                variant="secondary-filled"
                size="half"
                onClick={handleOpenContent}
              >
                콘텐츠 카드 더 보기
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppHeaderLayout>
  );
}
