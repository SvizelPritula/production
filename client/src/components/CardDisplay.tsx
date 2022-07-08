import { Card } from "types/card";

export default function CardDisplay({ card }: { card: Card }) {
  return (
    <div>
      <img src={card.image} style={{ height: "2cm" }} />
    </div>
  );
}
