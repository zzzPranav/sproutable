type MessageTree = { [key: string]: string | MessageTree };

/** Spanish fills in over English, so a missing phrase still shows the English one. */
export function withEnglishFallback(english: MessageTree, locale: MessageTree): MessageTree {
  const out: MessageTree = {};
  const keys = new Set([...Object.keys(english), ...Object.keys(locale)]);
  for (const key of keys) {
    const base = english[key];
    const extra = locale[key];
    if (isTree(base) && isTree(extra)) {
      out[key] = withEnglishFallback(base, extra);
    } else if (typeof extra === "string" && extra.trim()) {
      out[key] = extra;
    } else if (base !== undefined) {
      out[key] = base;
    } else if (extra !== undefined) {
      out[key] = extra;
    }
  }
  return out;
}

export function messageAt(tree: MessageTree, path: string): string | undefined {
  const value = path.split(".").reduce<string | MessageTree | undefined>((node, key) => {
    if (!node || typeof node === "string") return undefined;
    return node[key];
  }, tree);
  return typeof value === "string" ? value : undefined;
}

function isTree(value: string | MessageTree | undefined): value is MessageTree {
  return Boolean(value) && typeof value === "object";
}
