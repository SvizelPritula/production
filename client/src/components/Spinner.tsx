import style from "components/Spinner.module.css";

export default function Spinner() {
  return (
    <div className={style.wrapper} aria-label="Načítám...">
      <svg viewBox="0 0 100 100" className={style.image} aria-hidden={true}>
        <path
          d="M50 10A40 40 0 1 1 10 50"
          fill="none"
          stroke="white"
          strokeWidth={10}
          className={style.line}
        />
      </svg>
    </div>
  );
}
