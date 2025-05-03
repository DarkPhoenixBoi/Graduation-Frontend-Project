export const splitTextIntoChunks = (text, chunkSize = 100) => {
  // Fix hyphenated line breaks: gener-\nated → generated
  text = text.replace(/(\w+)-\s*\n\s*(\w+)/g, "$1$2");

  // Optional: Remove stray line breaks within paragraphs
  text = text.replace(/([^\n])\n(?=[^\n])/g, "$1 ");

  // Remove standalone page numbers on their own line
  text = text.replace(/^\s*\d{1,4}\s*$/gm, ""); // e.g., "23" on a single line

  // Remove page numbers at the beginning or end of a line (like "Page 123")
  text = text.replace(/\bPage\s*\d{1,4}\b/gi, "");

  // Split into sentences
  const sentenceEndRegex = /(?<=[.?!])\s+/g;
  const sentences = text.split(sentenceEndRegex);

  const chunks = [];
  let currentChunk = "";

  sentences.forEach((sentence) => {
    if ((currentChunk + sentence).length <= chunkSize) {
      currentChunk += (currentChunk ? " " : "") + sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence.length > chunkSize ? sentence.trim() : sentence;
    }
  });

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};
