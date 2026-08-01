import { useState } from "react";
import { useNavigate } from "react-router";
import Button from "../../components/Button.jsx";
import ContentSearchInput from "../../features/register/components/ContentSearchInput.jsx";
import ContentSearchResults from "../../features/register/components/ContentSearchResults.jsx";
import useRegisterDraft from "../../features/register/context/useRegisterDraft.js";

function getCategoryLabel(category) {
  switch (category) {
    case "PLACE":
      return "장소";
    case "MUSIC":
      return "음악";
    case "BOOK":
      return "도서";
    case "MOVIE":
      return "영화";
    case "SHOW":
      return "공연";
    case "ETC":
      return "기타";
    default:
      return "콘텐츠";
  }
}

function hasFinalConsonant(word) {
  const lastCharacterCode = word.charCodeAt(word.length - 1);
  const koreanSyllableIndex = lastCharacterCode - 0xac00;

  return koreanSyllableIndex >= 0 && koreanSyllableIndex % 28 !== 0;
}

function getCategoryClassName(category) {
  switch (category) {
    case "PLACE":
      return "cat-place";
    case "MUSIC":
      return "cat-music";
    case "BOOK":
      return "cat-book";
    case "MOVIE":
      return "cat-movie";
    case "SHOW":
      return "cat-show";
    default:
      return "";
  }
}

function ContentPage() {
  const navigate = useNavigate();
  const { draft, dispatch } = useRegisterDraft();
  const [submittedQuery, setSubmittedQuery] = useState(() =>
    draft.selectedContent ? draft.searchQuery : "",
  );
  const [searchResults, setSearchResults] = useState(() =>
    draft.selectedContent ? [draft.selectedContent] : [],
  );
  const [selectedContent, setSelectedContent] = useState(
    draft.selectedContent,
  );
  const categoryLabel = getCategoryLabel(draft.category);
  const categoryClassName = getCategoryClassName(draft.category);
  const objectParticle = hasFinalConsonant(categoryLabel) ? "을" : "를";

  const handleQueryChange = (event) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: event.target.value });
  };

  const handleSearch = (query) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
    setSubmittedQuery(query);

    // TODO: 검색 API 응답으로 searchResults를 갱신합니다.
    setSearchResults([]);
  };

  const handleSelectContent = (content) => {
    setSelectedContent(content);
  };

  const handleNext = () => {
    const content = selectedContent ?? {
      id: `temporary-${draft.category}-${submittedQuery}`,
      title: submittedQuery,
      description: "",
      isTemporary: true,
    };

    // TODO: 검색 API 연결 후에는 사용자가 선택한 결과만 저장합니다.
    dispatch({ type: "SET_CONTENT", payload: content });
    navigate("/register/editor");
  };

  if (submittedQuery) {
    return (
      <section className="flex h-full flex-col">
        <h1 className="heading-26-sb text-text-cream text-center">
          {submittedQuery}
        </h1>

        <div className="mt-8">
          <ContentSearchResults
            results={searchResults}
            selectedContentId={selectedContent?.id}
            categoryClassName={categoryClassName}
            onSelect={handleSelectContent}
          />
        </div>

        <p className="body-13-r text-text-muted-warm mt-8 text-center">
          원하는 {categoryLabel}
          {objectParticle} 찾을 수 없나요?
        </p>

        <div className="mt-auto pt-12">
          <Button onClick={handleNext}>다음</Button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1 className="heading-26-sb text-text-cream text-center">
        {categoryLabel}
        {objectParticle} 검색해주세요
      </h1>

      <ContentSearchInput
        value={draft.searchQuery}
        onChange={handleQueryChange}
        onSubmit={handleSearch}
      />
    </section>
  );
}

export default ContentPage;
