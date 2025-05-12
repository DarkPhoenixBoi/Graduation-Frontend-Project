import axios from "axios";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

export const convertTextToAudio = async (
  textChunk,
  language = "en",
  retries = 0
) => {
  try {
    const response = await axios.post(
      "http://localhost:8001/synthesize/",
      { text: textChunk, language }, // Send language here
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.warn(`Retrying chunk (${retries + 1}/${MAX_RETRIES})...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return convertTextToAudio(textChunk, language, retries + 1);
    } else {
      console.error("Skipping chunk after 3 failed attempts:", error);
      return null;
    }
  }
};
