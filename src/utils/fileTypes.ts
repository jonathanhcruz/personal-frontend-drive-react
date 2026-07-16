const TEXT_MIME_EXACT = new Set([
  'application/json',
  'application/xml',
  'application/yaml',
  'application/toml',
  'application/sql',
]);

const TEXT_EXTENSIONS = new Set([
  // Config / env
  'env', 'ini', 'cfg', 'conf', 'toml', 'yaml', 'yml',
  'editorconfig', 'prettierrc', 'eslintrc', 'babelrc', 'nvmrc',
  // Markup / styles
  'md', 'markdown', 'html', 'htm', 'xml', 'svg', 'css', 'scss', 'sass', 'less',
  // Scripts / shells
  'sh', 'bash', 'zsh', 'fish', 'dockerfile', 'gitignore', 'gitattributes',
  // Web
  'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'vue', 'svelte', 'astro', 'graphql', 'gql',
  // Backend
  'dart', 'py', 'rb', 'go', 'rs', 'java', 'kt', 'swift',
  'c', 'cpp', 'h', 'hpp', 'cs', 'php', 'lua', 'r', 'scala', 'ex', 'exs', 'clj',
  // Data / query
  'sql', 'csv',
]);

export const isTextPreviewable = (mimeType: string, fileName: string): boolean => {
  if (mimeType.startsWith('text/')) return true;
  if (TEXT_MIME_EXACT.has(mimeType)) return true;
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  return TEXT_EXTENSIONS.has(ext);
};
