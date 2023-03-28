export function chunk<T>(array: T[], chunkSize: number): T[][] {
  const chunked: T[][] = [];

  let index: number = 0;
  while (index < array.length) {
    // N.B. slicing beyond the array is ok and returns just the trailing elements
    chunked.push(array.slice(index, index + chunkSize));
    index += chunkSize;
  }

  return chunked;
}
