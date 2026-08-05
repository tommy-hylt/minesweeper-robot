import readmeText from "../README.md?raw";

export default function ReadMe() {
  return (
    <div className="xp-notepad">
      <div className="xp-notepad__menubar">
        <span>File</span>
        <span>Edit</span>
        <span>Format</span>
        <span>View</span>
        <span>Help</span>
      </div>
      <pre className="xp-notepad__body">{readmeText}</pre>
    </div>
  );
}
