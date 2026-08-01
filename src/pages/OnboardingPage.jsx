function OnboardingPage({ nickname = false }) {
  return (
    <section className="py-10">
      <h1 className="heading-26-sb text-text-cream">
        {nickname ? "닉네임을 정해주세요" : "스침에 오신 것을 환영해요"}
      </h1>
    </section>
  );
}

export default OnboardingPage;
