export const translateText = async (text: string): Promise<string | null> => {
  try {
    // استخدمنا encodeURIComponent عشان المسافات والرموز ما تخرب الرابط
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ar`
    );

    const data = await response.json();

    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
    return null;
  } catch (error) {
    console.error("MyMemory Translation Error:", error);
    return null;
  }
};