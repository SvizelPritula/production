import { Fragment } from "react";

import { PlayerState, ResourceInfo } from "board/gameState";
import { blankCard } from "types/card";

import CardDisplay from "components/CardDisplay";
import ResourceValueDisplay from "board/ResourceValueDisplay";

import styles from "board/GameStateDisplay.module.css";

export default function PlayerStateDisplay({
  player,
  resources,
}: {
  player: PlayerState;
  resources: ResourceInfo[];
}) {
  var resourceMap = new Map<string, ResourceInfo>(
    resources.map((resource) => [resource.id, resource])
  );

  return (
    <div className={styles.player}>
      <div className={styles.heading}>
        <h2 className={styles.name}>{player.name}</h2>
        <div className={styles.points}>{player.points}</div>
      </div>
      <div className={styles.info}>
        <div className={styles.resources}>
          {player.resources.map((resource, row) => (
            <Fragment key={resource.id}>
              <ResourceValueDisplay
                value={resource.amount}
                valueType="amount"
                resource={resourceMap.get(resource.id)!}
                row={row}
                column={0}
              />
              <ResourceValueDisplay
                value={resource.production}
                valueType="production"
                resource={resourceMap.get(resource.id)!}
                row={row}
                column={1}
              />
              <ResourceValueDisplay
                value={resource.usage}
                valueType="usage"
                resource={resourceMap.get(resource.id)!}
                row={row}
                column={2}
              />
            </Fragment>
          ))}
        </div>
        <div className={styles.card}>
          <CardDisplay card={player.lastUsedCard ?? blankCard} />
        </div>
      </div>
    </div>
  );
}
