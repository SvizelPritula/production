import { GameState } from "board/gameState";

import PlayerStateDisplay from "board/PlayerStateDisplay";

import styles from "board/GameStateDisplay.module.css";

export default function GameStateDisplay({
  gameState,
}: {
  gameState: GameState;
}) {
  var { players, resources } = gameState;

  return (
    <div className={styles.players}>
      {players.map((player) => (
        <PlayerStateDisplay
          key={player.id}
          player={player}
          resources={resources}
        />
      ))}
    </div>
  );
}
