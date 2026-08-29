// Small stroke-based icon set, rendered as inline SVG strings.
export const ICONS = {
  home:'<path d="M3 11l9-8 9 8M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10"/>',
  doctor:'<circle cx="12" cy="8" r="3.2"/><path d="M5 21v-2a5 5 0 015-5h4a5 5 0 015 5v2"/>',
  calendar:'<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M8 2v4M16 2v4M3 10h18"/>',
  chat:'<path d="M20 12a8 8 0 10-3.94 6.9L20 20l-1.1-3.06A7.96 7.96 0 0020 12z"/>',
  record:'<path d="M9 12h.01M12 12h3M9 16h6M6 4h9l3 3v13a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z"/>',
  pill:'<rect x="3" y="9" width="14" height="10" rx="2"/><path d="M8 9V6a3 3 0 016 0v3"/><circle cx="10" cy="14" r="1.4"/>',
  billing:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  star:'<path d="M12 3l2.6 5.5 6 .7-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.2l6-.7z"/>',
  video:'<path d="M15 10l5-3v10l-5-3M3 7h10a2 2 0 012 2v6a2 2 0 01-2 2H3z"/>',
  send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
  paperclip:'<path d="M21 11.5l-9 9a4.5 4.5 0 01-6.4-6.4l9-9a3 3 0 014.2 4.2l-9 9a1.5 1.5 0 01-2.1-2.1l8.3-8.3"/>',
  close:'<path d="M18 6L6 18M6 6l12 12"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  file:'<path d="M6 4h9l3 3v13a1 1 0 01-1 1H6a1 1 0 01-1-1V5a1 1 0 011-1z"/><path d="M14 4v4h4"/>',
  mic:'<path d="M12 1a3 3 0 00-3 3v7a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v1a7 7 0 01-14 0v-1M12 18v4"/>',
  micOff:'<path d="M3 3l18 18M12 1a3 3 0 00-3 3v6M19 10v1a7 7 0 01-9.6 6.5M5 10v1a7 7 0 003 5.7M12 18v4"/>',
  camOff:'<path d="M3 3l18 18M15 10l5-3v10l-5-3M3 7h9a2 2 0 012 2v6"/>',
  phoneOff:'<path d="M3 3l18 18M10.5 10.5c-1.5-.5-2.5-1.5-3-3M15 10l5-3v10l-5-3"/>',
};

export function icon(name, size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
}
