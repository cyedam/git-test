const progressBar = document.getElementById("progressBar");
const heroBg = document.getElementById("heroBg");
const hero = document.querySelector(".hero");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== [효과 1] 스크롤 시 아래에서 위로 페이드인 ===== */
// 같은 섹션 안의 요소들(제목 → 문장 → 이미지)에 순차 딜레이 부여
document.querySelectorAll(".hero__content, .section__inner").forEach((group) => {
  group.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.setProperty("--delay", `${i * 0.15}s`);
  });
});

// IntersectionObserver: 요소가 화면에 15% 이상 보이면 is-visible 추가
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // 한 번만 실행
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ===== 스크롤 이벤트 (requestAnimationFrame으로 부드럽게 처리) ===== */
let ticking = false;

function onScroll() {
  const scrollY = window.scrollY;

  /* [효과 3] 프로그래스 바: 스크롤 위치 / 전체 스크롤 가능 높이 */
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
  progressBar.style.transform = `scaleX(${progress})`;

  /* [효과 2] 히어로 패럴랙스: 스크롤 양의 40%만큼만 이동 → 배경이 느리게 움직임 */
  if (!reduceMotion && scrollY <= hero.offsetHeight) {
    heroBg.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
  }

  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  },
  { passive: true }
);

window.addEventListener("resize", onScroll);
onScroll(); // 첫 로드 시 상태 반영
