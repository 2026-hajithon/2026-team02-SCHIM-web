export default function Button({
  children,
  variant = "primary-light",
  size = "full",
  onClick,
  disabled = false,
}) {
  // 공통 클래스: flex, 중앙 정렬, border-radius 6px
  const baseClasses =
    "flex justify-center items-center rounded-[6px] cursor-pointer transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:opacity-50";

  // 사이즈별 클래스 (피그마 width/height/padding 스펙)
  const sizeClasses = {
    full: "w-[342px] py-[12px]", // 전체 너비 (다음 버튼 등)
    half: "w-[165px] h-[50px] flex-[1_0_0] self-stretch", // 반절 너비 (내 리스트에 저장 등)
  };

  // 디자인(variant)별 클래스 (피그마 background/border 스펙)
  const variantClasses = {
    "primary-light": "bg-[var(--paper-base,#FFFAF0)] text-[#211F1A] body-15-sb",
    "primary-dark": "bg-[var(--bg-muted,#3A3A3A)] text-[#F5F5F5] body-15-sb",
    "secondary-outline":
      "border border-[rgba(211,211,211,0.20)] bg-transparent text-[#F5F5F5] body-15-sb",
    "secondary-filled":
      "bg-[var(--bg-muted,#3A3A3A)] text-[#F5F5F5] body-15-sb",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}
