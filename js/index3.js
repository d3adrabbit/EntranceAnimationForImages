import { preloadImages } from "./utils.js";

const init = () => {
  const debug = false;
  if (debug) {
    document.querySelector("[data-debug]").classList.add("debug");
  }

  const breakPoint = "53em";
  const mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop: `(min-width: ${breakPoint})`,
      isMobile: `(max-width: ${breakPoint})`,
    },
    (context) => {
      let { isDesktop } = context.conditions;

      const cardList = gsap.utils.toArray(".card");
      const count = cardList.length;

      const radius = isDesktop ? 250 : 180; // Distance from the image center to the screen center.
      const sliceAngle = (2 * Math.PI) / count;

      gsap.set(cardList, {
        x: (index) => {
          return Math.round(
            radius * Math.cos(sliceAngle * index - Math.PI / 4)
          );
        },
        y: (index) => {
          return Math.round(
            radius * Math.sin(sliceAngle * index - Math.PI / 4)
          );
        },
        rotation: (index) => {
          return (index + 1) * (360 / count);
        },
      });

      const timeline = gsap
        .timeline()
        .set(cardList, {
          opacity: 0,
          scale: 0,
          x: 0,
          y: 0,
          duration: 2,
        })
        .to(cardList, {
          stagger: 0.15,
          opacity: 1,
          scale: 1,
          duration: 1,
          x: (index) => {
            return Math.round(
              radius * Math.cos(sliceAngle * index - Math.PI / 4)
            );
          },
          y: (index) => {
            return Math.round(
              radius * Math.sin(sliceAngle * index - Math.PI / 4)
            );
          },
          rotation: (index) => {
            return (index + 1) * (360 / count);
          },
        })
        .to(
          ".group",
          {
            rotation: -360 - 90,
            duration: 3,
            ease: "power4.out",
          },
          0
        )
        .from(
          ".headings",
          {
            opacity: 0,
            filter: "blur(60px)",
            duration: 1,
          },
          1
        )
        .to(cardList, {
          repeat: -1,
          duration: 2,
          onRepeat: () => {
            gsap.to(cardList[Math.floor(Math.random() * count)], {
              rotateY: "+=180",
            });
          },
        })
        .to(
          ".container",
          {
            rotation: "-=360",
            duration: 20,
            ease: "none",
            repeat: -1,
          },
          0
        );

      return () => {};
    }
  );
};

preloadImages(".card__img").then(() => {
  document.body.classList.remove("loading");
  init();
});
