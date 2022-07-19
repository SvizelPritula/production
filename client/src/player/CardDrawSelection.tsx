import { useState } from "react";

import { CardDrawTurnData } from "player/turnData";
import { ShadowState } from "utils/useShadowState";

import CardDisplay from "components/CardDisplay";

import styles from "player/selection.module.css";
import formStyles from "utils/forms.module.css";

export default function CardDrawSelection({
  turnData,
  shadowState,
  saveSelection,
}: {
  turnData: CardDrawTurnData;
  shadowState: ShadowState<number[]>;
  saveSelection: () => Promise<void>;
}) {
  var [locked, setLocked] = useState(false);

  var {
    value: selection,
    setShadow: setSelection,
    isShadowed: isSelectionShadowed,
  } = shadowState;

  if (!Array.isArray(selection)) selection = [];

  var selected = new Set(selection);

  var cards = turnData.options.map((card, id) => ({
    card: card,
    id: id,
    selected: selected.has(id),
  }));

  var savingDisabledReason: string | null = null;
  var selectionsRemaining = turnData.requiredSelections - selection.length;

  if (selectionsRemaining > 0) {
    savingDisabledReason = `Select ${selectionsRemaining} more`;
  } else if (selectionsRemaining < 0) {
    savingDisabledReason = `Select ${-selectionsRemaining} less`;
  } else if (!isSelectionShadowed) {
    savingDisabledReason = `Saved`;
  }

  function setSelected(id: number, selected: boolean) {
    setSelection((old) => {
      if (old == null) return null!;

      var selection = old.filter((n) => n !== id);
      if (selected) selection.push(id);
      return selection;
    });
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
      <p className={formStyles.label}>
        Select <b>{turnData.requiredSelections}</b> cards:
      </p>
      <div className={styles.options}>
        {cards.map(({ card, id, selected }) => (
          <label
            className={styles.option}
            htmlFor={`card-${id}`}
            aria-label={`Card number ${id + 1}`}
            key={id}
          >
            <div>
              <input
                className={formStyles.checkbox}
                id={`card-${id}`}
                type={"checkbox"}
                disabled={locked}
                checked={selected}
                onChange={(event) => setSelected(id, event.target.checked)}
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
