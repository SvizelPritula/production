import { Card } from "types/card";

import styles from "components/CardDisplay.module.css";

export default function CardDisplay({
  card,
  muted = false,
}: {
  card: Card;
  muted?: boolean;
}) {
  return (
    <div
      className={`${styles.card} ${muted ? styles.muted : ""}`}
      style={{ "--card-color": card.color } as any}
    >
      <img src={card.image} alt="A card" />
    </div>
  );
}
