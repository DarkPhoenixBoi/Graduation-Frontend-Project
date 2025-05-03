import axios from "axios";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export const convertTextToAudio = async (
  textChunk,
  retries = 0,
  block_cheat = true //delete after testing
) => {
  try {
    const response = await axios.post(
      "http://localhost:8001/synthesize/",
      { text: textChunk, block_cheat: block_cheat },
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.warn(`Retrying chunk (${retries + 1}/${MAX_RETRIES})...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return convertTextToAudio(textChunk, retries + 1);
    } else {
      console.error("Skipping chunk after 3 failed attempts:", error);
      return null; // Skips failed chunk
    }
  }
};
