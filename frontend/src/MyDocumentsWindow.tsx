import XpExplorerChrome from "./XpExplorerChrome";
import { folderIcon, computerIcon, shortcutIcon } from "./assets/icons/xp";

const SHORTCUTS = [
  { name: "Minesweeper Robot (this project).lnk", url: "https://github.com/tommy-hylt/minesweeper-robot" },
  { name: "MinesweeperRobot original C#.lnk", url: "https://github.com/tommyinb/MinesweeperRobot" },
  { name: "minesweeper game source.lnk", url: "https://github.com/ShizukuIchi/minesweeper" },
  { name: "tommy-style code style.lnk", url: "https://github.com/tommy-hylt/tommy-style" },
];

interface Props {
  onOpenMyComputer: () => void;
}

export default function MyDocumentsWindow({ onOpenMyComputer }: Props) {
  return (
    <XpExplorerChrome
      icon={<img src={folderIcon} className="xp-silk-icon" alt="" />}
      path={[{ label: "My Documents" }]}
      otherPlace={{ icon: <img src={computerIcon} className="xp-silk-icon" alt="" />, label: "My Computer", onClick: onOpenMyComputer }}
    >
      <div className="xp-explorer-chrome__category">GitHub Projects</div>
      <div className="xp-explorer-chrome__icons">
        {SHORTCUTS.map((shortcut) => (
          <a
            key={shortcut.url}
            className="xp-explorer-chrome__icon-item"
            href={shortcut.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={shortcutIcon} className="xp-silk-icon xp-silk-icon--large" alt="" />
            {shortcut.name}
          </a>
        ))}
      </div>
    </XpExplorerChrome>
  );
}
