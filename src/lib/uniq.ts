export function uniq<T>(elements: T[]): T[] {
  const uniqueElements: T[] = [];
  const seenElements: Set<T> = new Set<T>();
  for (const el of elements) {
    if (!seenElements.has(el)) {
      seenElements.add(el);
      uniqueElements.push(el);
    }
  }
  return uniqueElements;
}
