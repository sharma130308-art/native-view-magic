const PREFIX = "zyrafit-";

function localKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key?.startsWith(PREFIX)) keys.push(key);
  }
  return keys;
}

/** Everything ZyraFit keeps on this device (food log, goals, water, favorites). */
export function exportLocalData(): string {
  const data: Record<string, unknown> = {};
  for (const key of localKeys()) {
    const raw = localStorage.getItem(key);
    try {
      data[key] = raw ? JSON.parse(raw) : raw;
    } catch {
      data[key] = raw;
    }
  }
  return JSON.stringify({ exportedAt: new Date().toISOString(), data }, null, 2);
}

export function clearLocalData() {
  for (const key of localKeys()) localStorage.removeItem(key);
}
