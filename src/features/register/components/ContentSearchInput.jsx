function ContentSearchInput({ value, onChange, onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();

    const query = value.trim();

    if (query) {
      onSubmit(query);
    }
  };

  return (
    <form className="mt-14" role="search" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="content-search">
        콘텐츠 검색
      </label>
      <input
        autoFocus
        id="content-search"
        type="text"
        value={value}
        onChange={onChange}
        enterKeyHint="search"
        autoComplete="off"
        className="text-text-light caret-overlay-ghost w-full border-0 bg-transparent p-0 text-center text-[30px] leading-[1.5] font-semibold tracking-[-0.03em] outline-none"
      />
    </form>
  );
}

export default ContentSearchInput;
