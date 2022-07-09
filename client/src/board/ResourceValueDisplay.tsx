import { ResourceInfo } from "board/gameState";

import styles from "board/GameStateDisplay.module.css";

export type ResourceValueType = "amount" | "production" | "usage";

export default function ResourceValueDisplay({
  value,
  resource,
  valueType,
  row,
  column,
}: {
  value: number;
  resource: ResourceInfo;
  valueType: ResourceValueType;
  row: number;
  column: number;
}) {
  return (
    <div
      className={styles.resource}
      style={
        {
          gridRow: row + 1,
          gridColumn: column + 1,
          "--resource-color": resource.color,
        } as any
      }
    >
      {value !== 0 && (
        <>
          <b>{value}</b>
          <div>&times;</div>
          <ResourceIcon type={valueType} />
        </>
      )}
    </div>
  );
}

function ResourceIcon({ type }: { type: ResourceValueType }) {
  switch (type) {
    case "amount":
      return (
        <svg viewBox="0 0 100 100" className={styles.icon}>
          <g fill="currentColor">
            <circle cx="25" cy="60" r="10" />
            <circle cx="50" cy="60" r="10" />
            <circle cx="75" cy="60" r="10" />
            <circle cx="62.5" cy="40" r="10" />
            <circle cx="37.5" cy="40" r="10" />
            <circle cx="50" cy="20" r="10" />
            <rect x="10" y="75" width="80" height="15" />
          </g>
        </svg>
      );

    case "production":
      return (
        <svg viewBox="0 0 100 100" className={styles.icon}>
          <g fill="currentColor">
            <path d="m13.961 35.145 13.515 6.5082-2.4758 10.847h-15z" />
            <path d="m32.644 16.461 6.5084 13.514-8.6985 6.937-11.728-9.3523z" />
            <path d="m41.099 13.503 3.338 14.624 11.126-1.67e-4 3.3376-14.624z" />
            <path d="m81.273 27.56-11.727 9.3526-8.6988-6.9367 6.508-13.515z" />
            <path d="m86.038 35.144-13.514 6.5086 2.4761 10.848h15z" />
            <path d="m90 70h-15v-12.5h15z" />
            <path d="m25 70h-15v-12.5h15z" />
            <path d="m90 87.5h-15v-12.5h15z" />
            <path d="m25 87.5h-15v-12.5h15z" />
            <path d="m67.5 52.5v35h-35v-35c0-9.665 7.835-17.5 17.5-17.5s17.5 7.835 17.5 17.5z" />
          </g>
        </svg>
      );

    case "usage":
      return (
        <svg viewBox="0 0 100 100" className={styles.icon}>
          <g fill="currentColor">
            <path d="m20.693 12.5a150 150 0 0 1 1.0664 17.5 150 150 0 0 1-11.76 57.5h63.307a150 150 0 0 1-11.547-57.5 150 150 0 0 1 1.1289-17.5z" />
            <path d="m66.814 27.5c-0.019539 0.83772-0.047672 1.6755-0.052734 2.5137 0.029909 19.074 3.8212 37.956 11.16 55.562l0.80273 1.9238h11.275a120 120 0 0 1-9.2383-46 120 120 0 0 1 0.9043-14h-14.852z" />
          </g>
        </svg>
      );
  }
}
