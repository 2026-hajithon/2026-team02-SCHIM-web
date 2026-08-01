function ContentSearchResults({
  results,
  selectedContentId,
  categoryClassName = "",
  onSelect,
}) {
  if (results.length === 0) {
    return (
      <div>
        <p className="body-13-r text-text-muted-warm text-right">
          검색 결과 0개
        </p>
        <p className="body-15-r text-text-muted-warm mt-8 text-center">
          검색 결과가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <div className={categoryClassName}>
      <p className="body-13-r text-text-muted-warm text-right">
        검색 결과 {results.length}개
      </p>
      <ul className="mt-4 grid gap-2" aria-label="콘텐츠 검색 결과">
        {results.map((content) => {
          const isSelected = selectedContentId === content.id;

          return (
            <li key={content.id}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(content)}
                className={`flex w-full items-center justify-between rounded-md px-4 py-4 text-left ${
                  isSelected
                    ? "bg-[var(--key,var(--color-paper-base))] text-ink-base"
                    : "bg-bg-elev-warm text-text-light"
                }`}
              >
                <span className="body-13-r opacity-70">
                  {content.description}
                </span>
                <strong className="body-15-sb">{content.title}</strong>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ContentSearchResults;
