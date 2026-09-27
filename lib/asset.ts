// Путь к файлу из public/. На GitHub Pages сайт живёт в подпапке
// (/SiteforMedina), поэтому к путям добавляется этот префикс.
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`
}
