import type { ReactNode } from "react";
import { navBackIcon, navForwardIcon, navUpIcon, toolbarSearchIcon, toolbarFoldersIcon } from "./assets/icons/xp";

interface PathSegment {
  label: string;
  onClick?: () => void;
}

interface OtherPlace {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

interface Props {
  icon: ReactNode;
  path: PathSegment[];
  onBack?: () => void;
  otherPlace?: OtherPlace;
  children: ReactNode;
}

export default function XpExplorerChrome({ icon, path, onBack, otherPlace, children }: Props) {
  return (
    <div className="xp-explorer-chrome">
      <div className="xp-explorer-chrome__menubar">
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Favorites</span>
        <span>Tools</span>
        <span>Help</span>
      </div>

      <div className="xp-explorer-chrome__toolbar">
        <button
          className="xp-explorer-chrome__nav-btn"
          onClick={onBack}
          disabled={!onBack}
        >
          <img src={navBackIcon} className="xp-silk-icon" alt="" />
          Back
          <span className="xp-explorer-chrome__nav-dropdown">▾</span>
        </button>
        <button className="xp-explorer-chrome__nav-btn" disabled>
          <img src={navForwardIcon} className="xp-silk-icon" alt="" />
          <span className="xp-explorer-chrome__nav-dropdown">▾</span>
        </button>
        <button
          className="xp-explorer-chrome__tool-btn"
          onClick={onBack}
          disabled={!onBack}
          aria-label="Up one level"
        >
          <img src={navUpIcon} className="xp-silk-icon" alt="" />
        </button>
        <span className="xp-explorer-chrome__tool-sep" />
        <button className="xp-explorer-chrome__tool-btn" disabled>
          <img src={toolbarSearchIcon} className="xp-silk-icon" alt="" />
          Search
        </button>
        <button className="xp-explorer-chrome__tool-btn" disabled>
          <img src={toolbarFoldersIcon} className="xp-silk-icon" alt="" />
          Folders
        </button>
      </div>

      <div className="xp-explorer-chrome__addressbar">
        <span className="xp-explorer-chrome__address-label">Address</span>
        <span className="xp-explorer-chrome__address-box">
          <span className="xp-explorer-chrome__address-icon">{icon}</span>
          {path.map((segment, i) => (
            <span key={segment.label} className="xp-explorer-chrome__address-segment">
              {i > 0 && <span className="xp-explorer-chrome__address-sep">›</span>}
              {segment.onClick ? (
                <button
                  className="xp-explorer-chrome__address-crumb"
                  onClick={segment.onClick}
                >
                  {segment.label}
                </button>
              ) : (
                <span className="xp-explorer-chrome__address-crumb xp-explorer-chrome__address-crumb--current">
                  {segment.label}
                </span>
              )}
            </span>
          ))}
        </span>
      </div>

      <div className="xp-explorer-chrome__body">
        <div className="xp-explorer-chrome__taskpane">
          <div className="xp-explorer-chrome__taskcard">
            <div className="xp-explorer-chrome__taskcard-title">Other Places</div>
            {otherPlace && (
              <button className="xp-explorer-chrome__taskcard-link" onClick={otherPlace.onClick}>
                <span className="xp-explorer-chrome__taskcard-link-icon">{otherPlace.icon}</span>
                {otherPlace.label}
              </button>
            )}
          </div>
        </div>
        <div className="xp-explorer-chrome__filespane">{children}</div>
      </div>
    </div>
  );
}
