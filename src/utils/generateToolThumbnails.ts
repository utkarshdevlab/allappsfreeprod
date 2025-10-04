// Utility to generate modern gradient SVG thumbnails for tools
export function generateToolThumbnail(toolId: string, emoji: string, gradient: string[]): string {
  const [color1, color2] = gradient;
  
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad-${toolId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#grad-${toolId})" rx="16"/>
      <text x="200" y="180" font-size="120" text-anchor="middle" fill="white" opacity="0.9">${emoji}</text>
    </svg>
  `)}`;
}

export const toolThumbnails: Record<string, { emoji: string; gradient: string[] }> = {
  'password-generator': { emoji: '🔐', gradient: ['#667eea', '#764ba2'] },
  'qr-code-generator': { emoji: '📱', gradient: ['#f093fb', '#f5576c'] },
  'color-picker': { emoji: '🎨', gradient: ['#4facfe', '#00f2fe'] },
  'text-to-speech': { emoji: '🔊', gradient: ['#43e97b', '#38f9d7'] },
  'word-counter': { emoji: '📝', gradient: ['#fa709a', '#fee140'] },
  'snake-game': { emoji: '🐍', gradient: ['#30cfd0', '#330867'] },
  'tetris': { emoji: '🎮', gradient: ['#a8edea', '#fed6e3'] },
  'memory-game': { emoji: '🧠', gradient: ['#ff9a9e', '#fecfef'] },
  'tic-tac-toe': { emoji: '⭕', gradient: ['#ffecd2', '#fcb69f'] },
  'sudoku': { emoji: '🔢', gradient: ['#ff6e7f', '#bfe9ff'] },
  'resume-checker': { emoji: '📄', gradient: ['#667eea', '#f093fb'] },
  'image-converter': { emoji: '🖼️', gradient: ['#a18cd1', '#fbc2eb'] },
  'image-compressor': { emoji: '🗜️', gradient: ['#fad0c4', '#ffd1ff'] },
  'base64-encoder': { emoji: '💻', gradient: ['#6a11cb', '#2575fc'] },
  'ai-paraphrase': { emoji: '✨', gradient: ['#f857a6', '#ff5858'] }
};

export function getToolThumbnail(toolId: string): string {
  const config = toolThumbnails[toolId];
  if (!config) {
    return generateToolThumbnail(toolId, '⚙️', ['#667eea', '#764ba2']);
  }
  return generateToolThumbnail(toolId, config.emoji, config.gradient);
}
