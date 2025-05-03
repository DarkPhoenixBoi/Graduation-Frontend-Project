import * as pdfjsLib from "pdfjs-dist";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import ePub from "epubjs";

import workerSrc from "pdfjs-dist/build/pdf.worker.mjs?url";
GlobalWorkerOptions.workerSrc = workerSrc;

export const extractTextFromFile = (file, startPage) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async () => {
      const fileType = file.type;
      const fileContent = reader.result;

      try {
        if (fileType === "application/pdf") {
          const text = await extractTextFromPDF(fileContent, startPage);
          resolve(text);
        } else if (file.name.endsWith(".epub")) {
          const text = await extractTextFromEPUB(file);
          resolve(text);
        } else {
          reject("Unsupported file type");
        }
      } catch (error) {
        reject("Error extracting text from file");
      }
    };

    reader.onerror = () => reject("Error reading file");
    reader.readAsArrayBuffer(file);
  });
};

// Improved PDF text extraction with position-based page number filtering
const extractTextFromPDF = async (pdfData, startPage = 1) => {
  const pdf = await getDocument({ data: pdfData }).promise;
  let extractedText = "";

  for (let i = startPage; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();

    const strings = content.items
      .filter((item) => {
        const str = item.str.trim();
        const [, , , , , y] = item.transform;

        const isNumeric = /^\d{1,4}$/.test(str);
        const isTopOrBottom = y < 100 || y > viewport.height - 100;

        return !(isNumeric && isTopOrBottom); // Remove likely page numbers
      })
      .map((item) => item.str);

    let pageText = strings.join(" ").trim();

    // Cleanup logic
    pageText = pageText.replace(/(\w+)-\s+(\w+)/g, "$1$2"); // Dehyphenate
    // pageText = pageText.replace(/\b([A-Z])\s+([a-z]+)/g, "$1$2"); // Fix split caps but removes space between "I" and any word after it
    pageText = pageText.replace(/\b([A-Z])\s+r\s*\./g, "$1r."); // Fix "M r ." → "Mr."

    // Other optional cleanup
    pageText = pageText.replace(/\bPage\s*\d+\b/gi, "");
    pageText = pageText.replace(/\bChapter\s*\d+\b/gi, "");

    extractedText += pageText + "\n\n";
  }

  return extractedText.trim();
};

const extractTextFromEPUB = async (file) => {
  return new Promise((resolve, reject) => {
    const book = ePub(file);
    let fullText = "";

    book.loaded.navigation.then(() => {
      const spineItems = book.spine.spineItems;
      const promises = spineItems.map((item) =>
        item.load(book.load.bind(book)).then(() =>
          item.render().then((output) => {
            const doc = new DOMParser().parseFromString(output, "text/html");
            fullText += doc.body.textContent + "\n";
            item.unload();
          })
        )
      );

      Promise.all(promises)
        .then(() => resolve(fullText))
        .catch((err) => reject("Error extracting EPUB"));
    });
  });
};
