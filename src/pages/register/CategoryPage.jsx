import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../components/Button";
import useRegisterDraft from "../../features/register/context/useRegisterDraft.js";

const categories = [
  { value: "PLACE", label: "장소" },
  { value: "MUSIC", label: "음악" },
  { value: "BOOK", label: "도서" },
  { value: "MOVIE", label: "영화" },
  { value: "SHOW", label: "공연" },
  { value: "ETC", label: "기타" },
];

function CategoryPage() {
  const navigate = useNavigate();
  const { draft, dispatch } = useRegisterDraft();
  const [selectedCategory, setSelectedCategory] = useState(draft.category);

  const handleNext = () => {
    if (!selectedCategory) {
      return;
    }

    if (selectedCategory !== draft.category) {
      dispatch({ type: "SET_CATEGORY", payload: selectedCategory });
    }

    navigate("/register/content");
  };

  return (
    <section>
      <h1 className="heading-26-sb h-10 mb-4 text-text-cream text-center">
        무엇에 대한 감상인가요?
      </h1>
      <p className="body-15-r text-text-muted-warm text-center whitespace-nowrap">
        카테고리는 나중에 열어본 사람에게만 공개돼요
      </p>

      <div role="group" aria-label="카테고리 선택">
        {categories.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={selectedCategory === value}
            onClick={() => setSelectedCategory(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <Button onClick={handleNext}>다음</Button>
    </section>
  );
}

export default CategoryPage;
