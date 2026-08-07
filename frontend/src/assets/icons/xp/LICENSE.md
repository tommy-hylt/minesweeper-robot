# Real Windows XP icons

`drive.png`, `computer.png`, `help.png` — extracted from the real `shell32.dll`
on a Windows XP install, via
[Win XP Icons](https://archive.org/details/win-xp-icons) (Internet Archive).

`folder.png` — same real `shell32.dll` icon, via a different archival copy:
[Windows XP Icons (.ico, .png)](https://archive.org/details/WindowsXPExtractedIcons).
Used this one specifically because its render of the icon has a softer
gradient than the copy in `win-xp-icons` — same source icon, just a
better-preserved copy.

All these icons are used at 32×32 (their real hand-authored small-size
variant), not a downscale from a larger frame — shell32 icons embed several
distinct hand-tuned sizes (16/24/32/48/96...), and scaling a 96px frame down
to a 16-24px display size blurs out the border/tab detail no matter how good
the scaling algorithm is. Picking the 32px native frame keeps it crisp.

`shortcut.png` — the classic Internet Explorer "e" icon Windows XP used for
web shortcuts ("XP Webpage Icon.ico"), from
[Windows XP pack with all real icons](https://archive.org/details/theme_xp_pack_202005)
(Internet Archive). Used here for the GitHub repo links in My Documents.

These are all the genuine original Microsoft assets, archived for
preservation/nostalgia use — not a licensed redistributable icon set.

`nav-back.png`, `nav-forward.png`, `nav-up.png`, `toolbar-search.png`,
`toolbar-folders.png` — from the "Windows XP Explorer Toolbar Icons" pack by
forum user AllNight, shared on the
[Classic Shell forum](https://www.classicshell.net/forum/viewtopic.php?f=8&t=5070)
for exactly this kind of XP-recreation use.
