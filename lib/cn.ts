export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;
