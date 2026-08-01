import { useNavigate } from "react-router-dom";
import useRegisterDraft from "../../features/register/context/useRegisterDraft.js";

function CompletePage() {
  const navigate = useNavigate();
  const { draft, dispatch } = useRegisterDraft();

  const handleComplete = () => {
    dispatch({ type: "RESET" });
    navigate("/", { replace: true });
  };

  return (
    <section className="text-text-light flex min-h-dvh flex-col px-6 py-10 text-center">
      <h1 className="heading-26-sb">감상카드 등록 완료</h1>
      <p className="body-15-r text-text-muted-warm mt-4">
        감상카드가 무사히 등록됐어요.
      </p>

      {draft.createdCard?.imageUrl && (
        <img
          src={draft.createdCard.imageUrl}
          alt="등록된 감상카드"
          className="mx-auto mt-8 aspect-[9/14] w-full max-w-[240px] rounded-2xl object-cover"
        />
      )}

      <button
        type="button"
        onClick={handleComplete}
        className="bg-paper-base text-ink-base body-15-sb mt-auto rounded-md px-4 py-3"
      >
        홈으로
      </button>
    </section>
  );
}

export default CompletePage;
