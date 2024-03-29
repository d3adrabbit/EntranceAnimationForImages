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

      const image = document.querySelector(".card__img");
      const cardList = gsap.utils.toArray(".card");

      const count = cardList.length;
      const radius = isDesktop ? 250 : 180; // Distance from the image center to the screen center.

      gsap
        .timeline()
        .from(cardList, {
          x: (index) => {
            return index % 2
              ? -window.innerWidth / 2 - image.clientWidth * 4
              : window.innerWidth / 2 + image.clientWidth * 4;
          },
          rotation: (index) => {
            return index % 2 ? -90 : 90;
          },
          delay: (index) => {
            return Math.floor(index / 2) * 0.1;
          },
          duration: 1,
          opacity: 0.8,
          scale: 5,
          ease: "power4.out",
        })
        .set(cardList, {
          // Flip the second half of the images.
          scale: (index) => {
            return index > count / 2 - 1 ? -1 : 1;
          },
        })
        .to(cardList, {
          y: (index) => {
            return (index >= Math.floor(count / 2) ? 1 : -1) * radius;
          },
          duration: 0.5,
          ease: "power2.out",
        })
        .set(cardList, {
          transformOrigin: `center ${radius + image.clientHeight / 2}px`,
          y: (index) => {
            if (index >= Math.floor(count / 2)) {
              return -radius;
            }
          },
        })
        .to(cardList, {
          rotation: (index) => {
            return index > count / 2 - 1
              ? ((count - index - 1) * 360) / count
              : (index * 360) / count;
          },
          opacity: 0.8,
          duration: 1,
          ease: "power2.out",
        })
        .from(
          ".headings",
          {
            opacity: 0,
            filter: "blur(60px)",
            duration: 1.5,
          },
          "<-=1"
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
          ".group",
          {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: "none",
          },
          "<-=1.5"
        );

      return () => {};
    }
  );
};

preloadImages(".card__img").then(() => {
  document.body.classList.remove("loading");
  init();
});
