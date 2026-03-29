// جرب هذا الرابط (غالباً هو الأفضل حالياً)
const LIBRE_URL = "https://translate.argosopentech.com/translate";

export const translateText = async (text: string) => {
  try {
    console.log("Translation in progress..."); // بيطلع لك في تيرمينال الفيدورا

    const response = await fetch(LIBRE_URL, {
      method: "POST",
      body: JSON.stringify({
        q: text,
        source: "en",
        target: "ar",
        format: "text",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    // اطبع الرد في التيرمينال عشان تشوف وش جالس يصير
    console.log("رد السيرفر:", data);

    // بعض السيرفرات ترجع النص داخل 'translatedText' وبعضها 'translation'
    return data.translatedText || data.translation || text;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
};
