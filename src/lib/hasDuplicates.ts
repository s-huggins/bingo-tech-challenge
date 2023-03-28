import { uniq } from './uniq';

export function hasDuplicates<T>(elements: T[]): boolean {
  return elements.length !== uniq(elements).length;
}
