/** TiptapHelper to extract plain text from JSON content */

interface TiptapNode {
  type: string;
  content?: TiptapNode[];
  text?: string;
}

export function extractTextFromTiptapJson(jsonString: string): string {
  try {
    const doc = JSON.parse(jsonString) as TiptapNode;
    return extractText(doc);
  } catch {
    return jsonString || "";
  }
}

function extractText(node: TiptapNode): string {
  if (node.type === "text" && node.text) {
    return node.text;
  }

  if (node.content) {
    return node.content.map(extractText).join(" ");
  }

  return "";
}

export function getReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
