export const translateText = async (text: string): Promise<string | null> => {
  if (!text) return null;

  try {
    // هذا الرابط "سري" وممتاز لأنه ما يحتاج API Key
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);
    const data = await response.json();

    // جوجل يرجع مصفوفة (Array) داخل مصفوفة، نجمع النصوص منها
    if (data && data[0]) {
      let fullTranslation = "";
      data[0].forEach((item: any) => {
        if (item[0]) fullTranslation += item[0];
      });
      return fullTranslation;
    }
    
    return null;
  } catch (error) {
    console.error("خطأ في ترجمة جوجل:", error);
    return null;
  }
};