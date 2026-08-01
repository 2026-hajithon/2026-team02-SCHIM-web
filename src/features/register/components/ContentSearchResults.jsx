function getContentMeta(content) {
  const bookMeta = [
    content.details?.author,
    content.details?.publisher,
    content.details?.publicationYear,
  ].filter((value) => value !== null && value !== undefined && value !== "");

  if (bookMeta.length === 0) {
    return content.description;
  }

  const fullMeta = bookMeta.join(" · ");
  const isCrowded =
    fullMeta.length > 18 || fullMeta.length + (content.title?.length ?? 0) > 34;

  return isCrowded ? String(bookMeta[0]) : fullMeta;
}

function ContentSearchResults({
  results,
  selectedContentId,
  categoryClassName = "",
  categoryLabel,
  objectParticle,
  isLoading = false,
  errorMessage = "",
  onSelect,
}) {
  return (
    <div className={categoryClassName}>
      <p className="body-15-r text-right">
        <span className="text-text-cream/50">검색 결과 </span>
        <span className="text-text-light">{results.length}개</span>
      </p>

      {isLoading ? (
        <p className="body-15-r text-text-muted-warm mt-8 text-center">
          검색 중이에요.
        </p>
      ) : errorMessage ? (
        <p
          role="alert"
          className="body-15-r text-text-muted-warm mt-8 text-center"
        >
          {errorMessage}
        </p>
      ) : results.length === 0 ? (
        <p className="body-15-r text-text-muted-warm mt-8 text-center">
          검색 결과가 없습니다.
        </p>
      ) : (
        <ul className="mt-3 grid gap-3" aria-label="콘텐츠 검색 결과">
          {results.map((content) => {
            const isSelected = selectedContentId === content.id;

            return (
              <li key={content.id}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelect(content)}
                  className={`flex min-h-[62px] w-full items-center justify-between gap-3 overflow-hidden rounded-[6px] border border-border-dark px-5 py-4 text-left transition-colors ${
                    isSelected
                      ? "bg-[var(--key,var(--color-paper-base))] text-ink-base"
                      : "bg-bg-elev-warm text-text-light"
                  }`}
                >
                  <span
                    className={`caption-12-r max-w-[35%] shrink-0 truncate ${
                      isSelected ? "text-ink-base" : "text-text-muted-warm"
                    }`}
                  >
                    {getContentMeta(content)}
                  </span>
                  <strong className="body-15-m min-w-0 flex-1 truncate text-right">
                    {content.title || "제목 없음"}
                  </strong>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {!isLoading && (
        <p className="body-15-r flex min-h-[62px] items-center justify-center text-center text-white/60">
          원하는 {categoryLabel}
          {objectParticle} 찾을 수 없나요?
        </p>
      )}
    </div>
  );
}

export default ContentSearchResults;
