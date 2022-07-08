import { useState } from "react";

import { CardDrawTurnData } from "player/turnData";
import { ShadowState } from "utils/useShadowState";

import Overlay from "components/Overlay";
import CardDisplay from "components/CardDisplay";

export default function CardDrawSelection({
  turnData,
  shadowState,
}: {
  turnData: CardDrawTurnData;
  shadowState: ShadowState<number[]>;
}) {
  var cards = turnData.options;

  return (
    <form>
      <Overlay>
        <div>
          {cards.map((c, i) => (
            <label
              htmlFor={`card-${i}`}
              aria-label={`Card number ${i + 1}`}
              key={i}
            >
              <div>
                <input id={`card-${i}`} type={"checkbox"} />
              </div>
              <div>
                <CardDisplay card={c} />
              </div>
            </label>
          ))}
        </div>
      </Overlay>
    </form>
  );
}
