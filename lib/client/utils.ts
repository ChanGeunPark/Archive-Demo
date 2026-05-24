export function cls(...classNames: (string | undefined | null | false)[]) {
  return classNames.filter(Boolean).join(" ");
}
