import { LangType } from "./translations";

export type VoiceAction = 
  | { type: 'url'; value: string }
  | { type: 'generate' }
  | { type: 'clear' }
  | { type: 'copy' }
  | { type: 'theme' }
  | { type: 'lang'; value: LangType }
  | { type: 'unknown'; text: string };

export function parseVoiceCommand(text: string): VoiceAction {
  const cleanText = text.trim().toLowerCase();

  // 1. Language Commands
  if (cleanText.includes("o'zbek") || cleanText.includes("uzbek") || cleanText.includes("узбекский")) {
    return { type: 'lang', value: 'uz' };
  }
  if (cleanText.includes("rus") || cleanText.includes("russian") || cleanText.includes("русский")) {
    return { type: 'lang', value: 'ru' };
  }
  if (cleanText.includes("english") || cleanText.includes("английский")) {
    return { type: 'lang', value: 'en' };
  }

  // 2. Clear Command
  if (cleanText === "tozala" || cleanText === "clear" || cleanText === "очистить") {
    return { type: 'clear' };
  }

  // 3. Expose / Generate Command
  if (cleanText === "yarat" || cleanText === "generate" || cleanText === "создать" || cleanText === "expose") {
    return { type: 'generate' };
  }

  // 4. Copy Command
  if (cleanText === "nusxa" || cleanText === "copy" || cleanText === "копировать") {
    return { type: 'copy' };
  }

  // 5. Theme Command
  if (cleanText === "mavzu" || cleanText === "theme" || cleanText === "тема") {
    return { type: 'theme' };
  }

  // 6. Expose URL Command ("yoz https://...", "paste...", "вставить...")
  const prefixes = ["yoz", "paste", "вставить", "вставь", "write"];
  for (const prefix of prefixes) {
    if (cleanText.startsWith(prefix + " ") || cleanText.startsWith(prefix)) {
      let rawUrl = cleanText.substring(prefix.length).trim();
      
      // Clean up common speech-to-text formatting issues for URLs
      // e.g. "youtube com" -> "youtube.com", "t me" -> "t.me"
      rawUrl = rawUrl
        .replace(/\s+com/g, ".com")
        .replace(/\s+me/g, ".me")
        .replace(/\s+be/g, ".be")
        .replace(/\s+co/g, ".co")
        .replace(/\s+net/g, ".net")
        .replace(/\s+org/g, ".org")
        .replace(/\s+/g, ""); // remove other spaces

      if (rawUrl) {
        // Add default protocol if missing
        if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
          rawUrl = "https://" + rawUrl;
        }
        return { type: 'url', value: rawUrl };
      }
    }
  }

  // Fallback check if they just say a URL (e.g. "https youtube com")
  if (cleanText.includes("http") || cleanText.includes("www") || cleanText.includes(".com") || cleanText.includes(".me")) {
    let rawUrl = cleanText.replace(/\s+/g, "."); // replace spaces with dots
    rawUrl = rawUrl.replace("https.://", "https://").replace("http.://", "http://");
    if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
      rawUrl = "https://" + rawUrl;
    }
    return { type: 'url', value: rawUrl };
  }

  return { type: 'unknown', text };
}
