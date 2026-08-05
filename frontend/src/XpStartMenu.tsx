interface Props {
  onReadMe: () => void;
  onLogOff: () => void;
  onTurnOff: () => void;
}

export default function XpStartMenu({ onReadMe, onLogOff, onTurnOff }: Props) {
  return (
    <div className="xp-start-menu">
      <div className="xp-start-menu__header">
        <span className="xp-start-menu__avatar">🤖</span>
        <span className="xp-start-menu__user">Minesweeper Robot</span>
      </div>

      <div className="xp-start-menu__body">
        <div className="xp-start-menu__col xp-start-menu__col--programs">
          <button className="xp-start-menu__item" onClick={onReadMe}>
            <span className="xp-start-menu__item-icon">📄</span>
            Read Me
          </button>
          <div className="xp-start-menu__all-programs">
            <span className="xp-start-menu__item-icon">📁</span>
            All Programs
            <span className="xp-start-menu__all-programs-arrow">▶</span>
          </div>
        </div>

        <div className="xp-start-menu__col xp-start-menu__col--places">
          <div className="xp-start-menu__place">
            <span className="xp-start-menu__item-icon">🗂️</span>
            My Documents
          </div>
          <div className="xp-start-menu__place">
            <span className="xp-start-menu__item-icon">🖥️</span>
            My Computer
          </div>
          <div className="xp-start-menu__divider" />
          <div className="xp-start-menu__place">
            <span className="xp-start-menu__item-icon">⚙️</span>
            Control Panel
          </div>
          <div className="xp-start-menu__place">
            <span className="xp-start-menu__item-icon">❓</span>
            Help and Support
          </div>
        </div>
      </div>

      <div className="xp-start-menu__footer">
        <button className="xp-start-menu__power-btn" onClick={onLogOff}>
          <span className="xp-start-menu__power-icon xp-start-menu__power-icon--logoff" />
          Log Off
        </button>
        <button className="xp-start-menu__power-btn" onClick={onTurnOff}>
          <span className="xp-start-menu__power-icon xp-start-menu__power-icon--shutdown" />
          Turn Off Computer
        </button>
      </div>
    </div>
  );
}
