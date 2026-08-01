import { Link } from "react-router";

// 오버레이 안에서 주요 화면으로 이동하는 메뉴 목록입니다.
function MenuList({
  reflectionCardCount = 23,
  discoveryCount = 41,
  onNavigate,
}) {
  const menuItems = [
    { label: "홈", to: "/" },
    { label: "나의 감상카드", count: reflectionCardCount, to: "/my-cards" },
    {
      label: "발견한 콘텐츠",
      count: discoveryCount,
      to: "/discoveries",
    },
    { label: "설정", to: "/settings" },
    { label: "감상카드 남기기", to: "/register" },
  ];

  return (
    <nav className="w-full px-6" aria-label="주요 메뉴">
      <ul>
        {menuItems.map(({ label, count, to }, index) => (
          <li
            className={
              index < menuItems.length - 1 ? "border-border-dark border-b" : ""
            }
            key={to}
          >
            <Link
              className="flex h-18 w-full items-center gap-2.5"
              to={to}
              onClick={onNavigate}
            >
              <span className="heading-20-b text-text-light tracking-global leading-[normal] whitespace-nowrap">
                {label}
              </span>
              {count != null && (
                <span className="body-15-r text-text-muted-grey tracking-global leading-[normal] whitespace-nowrap">
                  {count}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default MenuList;
