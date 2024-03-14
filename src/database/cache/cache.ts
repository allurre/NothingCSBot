export class LRUCache<K, V> {
  private readonly maxSize: number;

  private readonly map: Map<K, V>;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.map = new Map<K, V>();
  }

  get(key: K): V | undefined {
    const item = this.map.get(key);
    if (item) {
      this.map.delete(key);
      this.map.set(key, item);
    }
    return item;
  }

  add(key: K, value: V): void {
    if (this.map.size >= this.maxSize) {
      const firstKey = this.map.keys().next().value;
      this.map.delete(firstKey);
    }
    this.map.set(key, value);
  }
}
