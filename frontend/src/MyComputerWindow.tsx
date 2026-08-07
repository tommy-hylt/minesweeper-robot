import { useState } from "react";
import XpExplorerChrome from "./XpExplorerChrome";
import { computerIcon, driveIcon, folderIcon } from "./assets/icons/xp";

interface Props {
  onOpenMyDocuments: () => void;
}

export default function MyComputerWindow({ onOpenMyDocuments }: Props) {
  const [inDrive, setInDrive] = useState(false);

  if (!inDrive) {
    return (
      <XpExplorerChrome
        icon={<img src={computerIcon} className="xp-silk-icon" alt="" />}
        path={[{ label: "My Computer" }]}
        otherPlace={{ icon: <img src={folderIcon} className="xp-silk-icon" alt="" />, label: "My Documents", onClick: onOpenMyDocuments }}
      >
        <div className="xp-explorer-chrome__category">Hard Disk Drives</div>
        <div className="xp-explorer-chrome__icons">
          <button className="xp-explorer-chrome__icon-item" onClick={() => setInDrive(true)}>
            <img src={driveIcon} className="xp-silk-icon xp-silk-icon--large" alt="" />
            Local Disk (C:)
          </button>
        </div>
      </XpExplorerChrome>
    );
  }

  return (
    <XpExplorerChrome
      icon={<img src={driveIcon} className="xp-silk-icon" alt="" />}
      path={[
        { label: "My Computer", onClick: () => setInDrive(false) },
        { label: "Local Disk (C:)" },
      ]}
      onBack={() => setInDrive(false)}
      otherPlace={{ icon: <img src={folderIcon} className="xp-silk-icon" alt="" />, label: "My Documents", onClick: onOpenMyDocuments }}
    >
      <div className="xp-explorer-chrome__category">Files Stored on This Computer</div>
      <div className="xp-explorer-chrome__icons">
        <button className="xp-explorer-chrome__icon-item" onClick={onOpenMyDocuments}>
          <img src={folderIcon} className="xp-silk-icon xp-silk-icon--large" alt="" />
          My Documents
        </button>
      </div>
    </XpExplorerChrome>
  );
}
