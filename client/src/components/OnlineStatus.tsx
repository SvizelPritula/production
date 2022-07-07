import headerStyles from "components/Layout.module.css";

export default function OnlineStatus({ online }: { online: boolean }) {
  return (
    <div aria-label={online ? "Online" : "Offline"}>
      <svg
        viewBox="0 0 100 100"
        className={headerStyles.icon}
        aria-hidden={true}
      >
        <g
          strokeWidth={5}
          stroke={online ? "#165016" : "#D40000"}
          strokeLinecap="round"
          fill="none"
          transform="rotate(-45,50,50)"
        >
          {online ? (
            <>
              <path d="M 62.5,34.5 V 47 h -25 V 34.5 C 37.5,27.596441 43.096441,22 50,22 c 6.903559,0 12.5,5.596441 12.5,12.5 z" />
              <path d="m 32.5,47 c 11.667666,0 23.334333,0 35,0" />
              <path d="M 37.5,65.5 V 53 h 25 V 65.5 C 62.5,72.403559 56.903559,78 50,78 43.096441,78 37.5,72.403559 37.5,65.5 Z" />
              <path d="m 67.5,53 c -11.667666,0 -23.334333,0 -35,0" />
              <path d="m 50,7 c 0,5.001857 0,10.001857 0,15" />
              <path d="m 50,78 c 0,5.001857 0,10.001857 0,15" />
            </>
          ) : (
            <>
              <path d="M 62.5,27.5 V 40 h -25 V 27.5 C 37.5,20.596441 43.096441,15 50,15 c 6.903559,0 12.5,5.596441 12.5,12.5 z" />
              <path d="m 32.5,40 c 11.667666,0 23.334333,0 35,0" />
              <path d="M 37.5,72.5 V 60 h 25 V 72.5 C 62.5,79.403559 56.903559,85 50,85 43.096441,85 37.5,79.403559 37.5,72.5 Z" />
              <path d="m 67.5,60 c -11.667666,0 -23.334333,0 -35,0" />
              <path d="M 50,-4.0157479e-7 C 50,5.0018566 50,10.001857 50,15" />
              <path d="m 57.5,40 c 0,4.168381 0,8.335047 0,12.5" />
              <path d="m 42.5,40 c 0,4.168381 0,8.335047 0,12.5" />
              <path d="m 50,85 c 0,5.001857 0,10.001857 0,15" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
