import styles from "./HeritageLocator.preview.module.css";

const states = [
  ["default", "Mặc định"],
  ["hover", "Di chuột"],
  ["focus", "Bàn phím"],
  ["active", "Đang nhấn"],
  ["disabled", "Chưa có tọa độ"],
  ["loading", "Đang tải vị trí"],
  ["error", "Lỗi tọa độ"],
  ["success", "Đang được chọn"]
] as const;

export function HeritageLocatorPreview() {
  return (
    <section className={styles.preview} aria-label="Heritage locator states">
      <h1>Heritage locator — 8 states</h1>
      {states.map(([state, label]) => (
        <div className={styles.row} key={state}>
          <code>{state}</code>
          <button
            type="button"
            className={styles.control}
            data-preview-state={state}
            data-error={state === "error"}
            disabled={state === "disabled"}
            aria-busy={state === "loading"}
          >
            <span>01</span>
            <strong>{label}</strong>
          </button>
        </div>
      ))}
    </section>
  );
}
