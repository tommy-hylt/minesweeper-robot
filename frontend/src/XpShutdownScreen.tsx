import { useEffect, useState } from "react";

interface Props {
  kind: "logoff" | "shutdown";
  onDismiss: () => void;
}

export default function XpShutdownScreen({ kind, onDismiss }: Props) {
  const [phase, setPhase] = useState<"in" | "hold" | "black">("in");

  useEffect(() => {
    const toHold = setTimeout(() => setPhase("hold"), 50);
    const toBlack = setTimeout(() => setPhase("black"), 2200);
    return () => {
      clearTimeout(toHold);
      clearTimeout(toBlack);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = () => onDismiss();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onDismiss]);

  const message = kind === "logoff" ? "Logging off..." : "Windows is shutting down...";

  return (
    <div className={`xp-shutdown xp-shutdown--${phase}`} onClick={onDismiss}>
      <span className="xp-shutdown__message">{message}</span>
    </div>
  );
}
