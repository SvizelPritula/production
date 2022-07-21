import { Card } from "types/card";

import styles from "components/CardDisplay.module.css";
import { useEffect, useRef } from "react";

export default function CardDisplay({
  card,
  muted = false,
}: {
  card: Card;
  muted?: boolean;
}) {
  var image = useRef<HTMLImageElement | null>(null);
  var wrapper = useRef<HTMLImageElement | null>(null);

  // This ridiculous script emulates Chrome behaviour in Firefox
  useEffect(() => {
    if (image.current === null) return;
    if (wrapper.current === null) return;

    function update() {
      if (image.current === null) return;
      if (wrapper.current === null) return;

      var style = window.getComputedStyle(image.current);

      var width = `calc(${style.width} + var(--padding) * 2)`;
      wrapper.current.style.width = width;
      console.log(width);
    }

    var observer = new ResizeObserver(update);
    update();

    var imageCurrent = image.current;
    observer.observe(imageCurrent);
    return () => observer.unobserve(imageCurrent);
  }, [image, wrapper]);

  return (
    <div
      className={`${styles.card} ${muted ? styles.muted : ""}`}
      style={{ "--card-color": card.color } as any}
      ref={wrapper}
    >
      <img src={card.image} alt="Karta" ref={image} />
    </div>
  );
}
