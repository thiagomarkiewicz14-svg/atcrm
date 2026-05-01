export function renderTemplate(template: string, data: Record<string, string>): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key: string) => data[key] ?? match);
}
