import { useState } from "react";

import { CardUsageTurnData } from "player/turnData";
import { blankCard, Card } from "types/card";
import { ShadowState } from "utils/useShadowState";

import CardDisplay from "components/CardDisplay";

import styles from "player/selection.module.css";
import formStyles from "utils/forms.module.css";

export default function CardUsageSelection({
  turnData,
  shadowState,
  saveSelection,
}: {
  turnData: CardUsageTurnData;
  shadowState: ShadowState<number | null>;
  saveSelection: () => Promise<void>;
}) {
  var [locked, setLocked] = useState(false);

  var {
    value: selection,
    setShadow: setSelection,
    isShadowed: isSelectionShadowed,
  } = shadowState;

  var cards = turnData.options
    .map((card, id): { card: Card; id: number | null; selected: boolean } => ({
      card: card,
      id: id,
      selected: selection === id,
    }))
    .concat([
      {
        card: blankCard,
        id: null,
        selected: selection === null,
      },
    ]);

  var savingDisabledReason: string | null = isSelectionShadowed
    ? null
    : "Saved";

  function setSelected(value: string) {
    if (value === "none") {
      setSelection(null);
    } else {
      setSelection(parseInt(value, 10));
    }
  }

  async function save() {
    setLocked(true);
    await saveSelection();
    setLocked(false);
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <p className={formStyles.label}>Select a card:</p>
      <div className={styles.options}>
        {cards.map(({ card, id, selected }) => (
          <label
            className={styles.option}
            htmlFor={`card-${id}`}
            aria-label={id === null ? "Blank card" : `Card number ${id + 1}`}
            key={id}
          >
            <div>
              <input
                className={formStyles.radio}
                id={`card-${id}`}
                type={"radio"}
                name="card"
                value={id == null ? "none" : id.toString()}
                disabled={locked}
                checked={selected}
                onChange={(event) => setSelected(event.target.value)}
              />
            </div>
            <div className={styles.card}>
              <CardDisplay card={card} muted={!selected} />
            </div>
          </label>
        ))}
      </div>

      <button
        type={"submit"}
        className={formStyles.button}
        disabled={savingDisabledReason != null || locked}
      >
        {savingDisabledReason ?? "Save"}
      </button>
    </form>
  );
}
