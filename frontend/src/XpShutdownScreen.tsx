import { useEffect, useState } from "react";

interface Props {
  kind: "logoff" | "shutdown";
  onDismiss: () => void;
}

export default function XpShutdownScreen({ kind, onDismiss }: Props) {
  const [black, setBlack] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBlack(true), 1600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKeyDown = () => onDismiss();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onDismiss]);

  const message = kind === "logoff" ? "Logging off..." : "Windows is shutting down...";

  return (
    <div
      className={`xp-shutdown${black ? " xp-shutdown--black" : ""}`}
      onClick={onDismiss}
    >
      <span className="xp-shutdown__message">{message}</span>
    </div>
  );
}
