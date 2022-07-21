import { useState } from "react";

import { CardDrawTurnData } from "player/turnData";
import { ShadowState } from "utils/useShadowState";

import CardDisplay from "components/CardDisplay";

import styles from "player/selection.module.css";
import formStyles from "utils/forms.module.css";

function getPluralForm(
  number: number,
  forms: [string, string, string]
): string {
  if (number === 1) return forms[0];
  if (number >= 2 && number <= 4) return forms[1];
  return forms[2];
}

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
    savingDisabledReason = `Vyberte o ${selectionsRemaining} více`;
  } else if (selectionsRemaining < 0) {
    savingDisabledReason = `Vyberte o ${-selectionsRemaining} méně`;
  } else if (!isSelectionShadowed) {
    savingDisabledReason = `Uloženo`;
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

  var cardsPlural = getPluralForm(turnData.requiredSelections, [
    "kartu",
    "karty",
    "karet",
  ]);

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <p className={formStyles.label}>
        Vyberte <b>{turnData.requiredSelections}</b> {cardsPlural}:
      </p>
      <div className={styles.options}>
        {cards.map(({ card, id, selected }) => (
          <label
            className={styles.option}
            htmlFor={`card-${id}`}
            aria-label={`Karta číslo ${id + 1}`}
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
        {savingDisabledReason ?? "Uložit"}
      </button>
    </form>
  );
}
