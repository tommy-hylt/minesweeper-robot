import { folderIcon, computerIcon, helpIcon } from "./assets/icons/xp";

interface Props {
  onReadMe: () => void;
  onOpenMyDocuments: () => void;
  onOpenMyComputer: () => void;
  onLogOff: () => void;
  onTurnOff: () => void;
}

export default function XpStartMenu({
  onReadMe,
  onOpenMyDocuments,
  onOpenMyComputer,
  onLogOff,
  onTurnOff,
}: Props) {
  return (
    <div className="xp-start-menu">
      <div className="xp-start-menu__header">
        <span className="xp-start-menu__avatar">🤖</span>
        <span className="xp-start-menu__user">Minesweeper Robot</span>
      </div>

      <div className="xp-start-menu__body">
        <div className="xp-start-menu__col xp-start-menu__col--programs">
          <div className="xp-start-menu__all-programs">
            <img src={folderIcon} className="xp-silk-icon" alt="" />
            All Programs
            <span className="xp-start-menu__all-programs-arrow">▶</span>
          </div>
        </div>

        <div className="xp-start-menu__col xp-start-menu__col--places">
          <button className="xp-start-menu__item xp-start-menu__place" onClick={onOpenMyDocuments}>
            <img src={folderIcon} className="xp-silk-icon" alt="" />
            My Documents
          </button>
          <button className="xp-start-menu__item xp-start-menu__place" onClick={onOpenMyComputer}>
            <img src={computerIcon} className="xp-silk-icon" alt="" />
            My Computer
          </button>
          <div className="xp-start-menu__divider" />
          <button className="xp-start-menu__item xp-start-menu__place" onClick={onReadMe}>
            <img src={helpIcon} className="xp-silk-icon" alt="" />
            Help and Support
          </button>
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
