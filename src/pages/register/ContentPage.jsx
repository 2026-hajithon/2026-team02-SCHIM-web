import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import ContentSearchInput from "../../features/register/components/ContentSearchInput.jsx";
import ContentSearchResults from "../../features/register/components/ContentSearchResults.jsx";
import searchContents from "../../features/register/api/searchContents.js";
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
  const [searchStatus, setSearchStatus] = useState(
    draft.selectedContent ? "success" : "idle",
  );
  const [searchError, setSearchError] = useState("");
  const categoryLabel = getCategoryLabel(draft.category);
  const categoryClassName = getCategoryClassName(draft.category);
  const objectParticle = hasFinalConsonant(categoryLabel) ? "을" : "를";

  const handleQueryChange = (event) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: event.target.value });
  };

  const handleSearch = async (query) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
    setSubmittedQuery(query);
    setSelectedContent(null);
    setSearchResults([]);
    setSearchStatus("loading");
    setSearchError("");

    try {
      const { items } = await searchContents({
        keyword: query,
        category: draft.category,
        size: 4,
      });

      setSearchResults(items);
      setSearchStatus("success");
    } catch {
      setSearchStatus("error");
      setSearchError("검색이 원활하지 않아요. 잠시 후 다시 시도해주세요.");
    }
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
      <section className="flex h-full min-h-0 flex-col">
        <h1 className="heading-26-sb text-text-cream shrink-0 text-center leading-[1.5]">
          {submittedQuery}
        </h1>

        <div className="mt-3 min-h-0 overflow-y-auto">
          <ContentSearchResults
            results={searchResults}
            selectedContentId={selectedContent?.id}
            categoryClassName={categoryClassName}
            categoryLabel={categoryLabel}
            objectParticle={objectParticle}
            isLoading={searchStatus === "loading"}
            errorMessage={searchError}
            onSelect={handleSelectContent}
          />
        </div>

        <div className="mt-auto shrink-0 pt-3 [&_button]:text-[17px] [&_button]:font-medium">
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
