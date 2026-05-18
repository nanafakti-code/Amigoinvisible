export function makeDerangement<T>(items: T[]): T[] {
  if (items.length < 2) {
    throw new Error("Need at least 2 participants");
  }

  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  for (let i = 0; i < items.length; i += 1) {
    if (copy[i] === items[i]) {
      return makeDerangement(items);
    }
  }

  return copy;
}
