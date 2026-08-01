import { motion } from "framer-motion";
import completeStar from "../../../assets/icon/complete-star.svg";

function RegisterCompleteView({ reducedMotion, onExplore, onHome }) {
  const fadeUp = (delay) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: reducedMotion
      ? { duration: 0.01 }
      : { duration: 0.2, delay, ease: "easeOut" },
  });

  return (
    <motion.div
      key="complete"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.15 }}
      className="bg-bg-base text-text-light flex min-h-dvh flex-col items-center gap-[22px] overflow-hidden rounded-[28px] px-7 pt-9 pb-10"
    >
      <div className="min-h-px flex-1" />

      <div className="grid size-[120px] shrink-0 place-items-center overflow-hidden">
        <motion.img
          src={completeStar}
          alt=""
          className="h-[35px] w-[30px]"
          initial={reducedMotion ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={
            reducedMotion
              ? { duration: 0.01 }
              : { type: "spring", bounce: 0.5, delay: 0.2 }
          }
        />
      </div>

      <motion.h1
        {...fadeUp(0.4)}
        className="text-text-cream text-center text-[26px] leading-none font-bold tracking-[-0.03em]"
      >
        감상 카드가 어딘가에
        <br />
        놓였어요
      </motion.h1>

      <motion.p
        {...fadeUp(0.5)}
        className="text-text-muted-warm text-center text-[14px] leading-[1.55] tracking-[-0.03em]"
      >
        이제 누군가 당신의 감상만 보고
        <br />이 콘텐츠를 열어볼 거예요
      </motion.p>

      <div className="min-h-px flex-1" />

      <motion.button
        {...fadeUp(0.65)}
        type="button"
        onClick={onExplore}
        className="bg-paper-base text-border-dark body-17-m w-[342px] rounded-md py-3"
      >
        다른 방명록 읽으러 가기
      </motion.button>

      <motion.button
        {...fadeUp(0.75)}
        type="button"
        onClick={onHome}
        className="text-text-muted-warm body-13-r"
      >
        홈으로 돌아가기
      </motion.button>
    </motion.div>
  );
}

export default RegisterCompleteView;
