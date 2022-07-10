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

    var observer = new ResizeObserver(() => {
      if (image.current === null) return;
      if (wrapper.current === null) return;

      var style = window.getComputedStyle(image.current);

      wrapper.current!.style.width = `calc(${style.width} + ${style.borderRadius})`;
    });

    observer.observe(image.current);
  }, [image, wrapper]);

  return (
    <div
      className={`${styles.card} ${muted ? styles.muted : ""}`}
      style={{ "--card-color": card.color } as any}
      ref={wrapper}
    >
      <img src={card.image} alt="A card" ref={image} />
    </div>
  );
}
