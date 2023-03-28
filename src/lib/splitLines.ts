/** Splits a string of text at the line breaks in a platform-agnostic manner */
export function splitLines(input: string): string[] {
  return input.split(/\r?\n/);
}
