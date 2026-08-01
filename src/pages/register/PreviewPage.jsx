import { useState } from "react";
import { useNavigate } from "react-router";
import createGuestbook from "../../features/register/api/createGuestbook.js";
import useRegisterDraft from "../../features/register/context/useRegisterDraft.js";

function PreviewPage() {
  const navigate = useNavigate();
  const { draft, dispatch } = useRegisterDraft();
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const isUploading = submitStatus === "uploading";

  const handleSubmit = async () => {
    if (isUploading) {
      return;
    }

    setSubmitStatus("uploading");
    setErrorMessage("");

    try {
      const createdCard = await createGuestbook({
        imageBlob: draft.pngBlob,
        content: {
          category: draft.category,
          ...draft.selectedContent,
        },
      });

      dispatch({ type: "SET_CREATED_CARD", payload: createdCard });
      setSubmitStatus("success");
      navigate("/register/complete", { replace: true });
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "감상카드 등록에 실패했어요. 다시 시도해주세요.",
      );
    }
  };

  return (
    <section className="text-text-light flex min-h-dvh flex-col px-6 py-6">
      <h1 className="heading-26-sb text-center">감상카드 미리보기</h1>

      <img
        src={draft.previewUrl}
        alt="작성한 감상카드 미리보기"
        className="border-border-dark mx-auto mt-6 aspect-[9/14] w-full max-w-[342px] rounded-[20px] border object-cover"
      />

      {errorMessage && (
        <p className="body-13-r mt-4 text-center text-red-400" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="mt-auto grid grid-cols-2 gap-3 pt-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={isUploading}
          className="border-overlay-ghost body-15-sb rounded-md border px-4 py-3 disabled:opacity-50"
        >
          다시 편집
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isUploading}
          className="bg-paper-base text-ink-base body-15-sb rounded-md px-4 py-3 disabled:opacity-50"
        >
          {isUploading ? "보내는 중" : "보내기"}
        </button>
      </div>
    </section>
  );
}

export default PreviewPage;
