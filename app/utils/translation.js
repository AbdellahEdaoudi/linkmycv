"use client";

// Cache translations in memory to minimize external network requests
const memoryTranslationCache = new Map();

/**
 * Supported Target Languages
 */
export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", flagClass: "fi fi-gb", dir: "ltr" },
  { code: "es", label: "Español", flagClass: "fi fi-es", dir: "ltr" },
  { code: "fr", label: "Français", flagClass: "fi fi-fr", dir: "ltr" },
  { code: "ar", label: "العربية", flagClass: "fi fi-sa", dir: "rtl" },
  { code: "de", label: "Deutsch", flagClass: "fi fi-de", dir: "ltr" },
  { code: "nl", label: "Nederlands", flagClass: "fi fi-nl", dir: "ltr" },
  { code: "it", label: "Italiano", flagClass: "fi fi-it", dir: "ltr" },
  { code: "pt", label: "Português", flagClass: "fi fi-pt", dir: "ltr" },
  { code: "ru", label: "Русский", flagClass: "fi fi-ru", dir: "ltr" },
  { code: "tr", label: "Türkçe", flagClass: "fi fi-tr", dir: "ltr" },
  { code: "zh", label: "中文", flagClass: "fi fi-cn", dir: "ltr" },
  { code: "ja", label: "日本語", flagClass: "fi fi-jp", dir: "ltr" },
];

/**
 * UI Static Section & Label Translations
 */
export const CV_UI_TRANSLATIONS = {
  en: {
    professionalSummary: "Professional Summary",
    workExperience: "Work Experience",
    Skills: "Skills",
    education: "Education",
    languages: "Languages",
    present: "Present",
    translateCv: "Translate CV",
    profileCopied: "Profile link copied!",
    failedToCopy: "Failed to copy link",
    copyLink: "Copy Link",
    copied: "Copied!",
    sendEmail: "Send Email",
    clickToViewImage: "Click to view image",
    downloadPdf: "Download PDF",
    downloading: "Generating PDF...",
    downloadSuccess: "CV downloaded successfully!",
  },
  ar: {
    professionalSummary: "الملخص المهني",
    workExperience: "الخبرات المهنية",
    Skills: "المهارات",
    education: "التعليم والشهادات",
    languages: "اللغات",
    present: "الحاضر",
    translateCv: "ترجمة السيرة الذاتية",
    profileCopied: "تم نسخ رابط الملف الشخصي!",
    failedToCopy: "فشل في نسخ الرابط",
    copyLink: "نسخ الرابط",
    copied: "تم النسخ!",
    sendEmail: "إرسال بريد إلكتروني",
    clickToViewImage: "انقر لعرض الصورة",
    downloadPdf: "تحميل السيرة الذاتية (PDF)",
    downloading: "جاري تجهيز وتحميل PDF...",
    downloadSuccess: "تم تحميل السيرة الذاتية بنجاح!",
  },
  fr: {
    professionalSummary: "Profil Professionnel",
    workExperience: "Expériences Professionnelles",
    Skills: "Compétences",
    education: "Formation et Diplômes",
    languages: "Langues",
    present: "Présent",
    translateCv: "Traduire le CV",
    profileCopied: "Lien du profil copié !",
    failedToCopy: "Échec de la copie du lien",
    copyLink: "Copier le lien",
    copied: "Copié !",
    sendEmail: "Envoyer un e-mail",
    clickToViewImage: "Cliquer pour voir l'image",
    downloadPdf: "Télécharger le CV (PDF)",
    downloading: "Génération du PDF...",
    downloadSuccess: "CV téléchargé avec succès !",
  },
  es: {
    professionalSummary: "Resumen Profesional",
    workExperience: "Experiencia Laboral",
    Skills: "Habilidades",
    education: "Educación y Formación",
    languages: "Idiomas",
    present: "Presente",
    translateCv: "Traducir CV",
    profileCopied: "¡Enlace del perfil copiado!",
    failedToCopy: "Error al copiar el enlace",
    copyLink: "Copiar enlace",
    copied: "¡Copiado!",
    sendEmail: "Enviar correo",
    clickToViewImage: "Haga clic para ver la imagen",
    downloadPdf: "Descargar CV (PDF)",
    downloading: "Generando PDF...",
    downloadSuccess: "¡CV descargado con éxito!",
  },
  de: {
    professionalSummary: "Beruflicher Werdegang",
    workExperience: "Berufserfahrung",
    Skills: "Fachkenntnisse",
    education: "Ausbildung",
    languages: "Sprachen",
    present: "Heute",
    translateCv: "Lebenslauf übersetzen",
    profileCopied: "Profillink kopiert!",
    failedToCopy: "Kopieren fehlgeschlagen",
    copyLink: "Link kopieren",
    copied: "Kopiert!",
    sendEmail: "E-Mail senden",
    clickToViewImage: "Klicken zum Vergrößern",
    downloadPdf: "Lebenslauf herunterladen (PDF)",
    downloading: "PDF wird erstellt...",
    downloadSuccess: "Lebenslauf erfolgreich heruntergeladen!",
  },
  nl: {
    professionalSummary: "Professioneel Profiel",
    workExperience: "Werkervaring",
    Skills: "Vaardigheden",
    education: "Opleiding",
    languages: "Talen",
    present: "Heden",
    translateCv: "CV Vertalen",
    profileCopied: "Profiellink gekopieerd!",
    failedToCopy: "Kopiëren mislukt",
    copyLink: "Link kopiëren",
    copied: "Gekopieerd!",
    sendEmail: "E-mail verzenden",
    clickToViewImage: "Klik om afbeelding te bekijken",
    downloadPdf: "CV downloaden (PDF)",
    downloading: "PDF genereren...",
    downloadSuccess: "CV succesvol gedownload!",
  },
  it: {
    professionalSummary: "Profilo Professionale",
    workExperience: "Esperienza Lavorativa",
    Skills: "Competenze",
    education: "Istruzione e Formazione",
    languages: "Lingue",
    present: "Presente",
    translateCv: "Traduci CV",
    profileCopied: "Link al profilo copiato!",
    failedToCopy: "Impossibile copiare il link",
    copyLink: "Copia link",
    copied: "Copiato!",
    sendEmail: "Invia e-mail",
    clickToViewImage: "Clicca per ingrandire l'immagine",
    downloadPdf: "Scarica CV (PDF)",
    downloading: "Generazione PDF in corso...",
    downloadSuccess: "CV scaricato con successo!",
  },
  pt: {
    professionalSummary: "Resumo Profissional",
    workExperience: "Experiência Profissional",
    Skills: "Competências",
    education: "Educação e Formação",
    languages: "Idiomas",
    present: "Presente",
    translateCv: "Traduzir Currículo",
    profileCopied: "Link do perfil copiado!",
    failedToCopy: "Falha ao copiar link",
    copyLink: "Copiar link",
    copied: "Copiado!",
    sendEmail: "Enviar e-mail",
    clickToViewImage: "Clique para ver a imagem",
    downloadPdf: "Baixar Currículo (PDF)",
    downloading: "Gerando PDF...",
    downloadSuccess: "Currículo baixado com sucesso!",
  },
  ru: {
    professionalSummary: "О себе",
    workExperience: "Опыт работы",
    Skills: "Навыки",
    education: "Образование",
    languages: "Языки",
    present: "По настоящее время",
    translateCv: "Перевести резюме",
    profileCopied: "Ссылка на профиль скопирована!",
    failedToCopy: "Не удалось скопировать ссылку",
    copyLink: "Копировать ссылку",
    copied: "Скопировано!",
    sendEmail: "Отправить письмо",
    clickToViewImage: "Нажмите, чтобы просмотреть фото",
    downloadPdf: "Скачать резюме (PDF)",
    downloading: "Создание PDF...",
    downloadSuccess: "Резюме успешно загружено!",
  },
  tr: {
    professionalSummary: "Profesyonel Özet",
    workExperience: "İş Deneyimi",
    Skills: "Yetenekler",
    education: "Eğitim",
    languages: "Diller",
    present: "Günümüz",
    translateCv: "Özgeçmişi Çevir",
    profileCopied: "Profil bağlantısı kopyalandı!",
    failedToCopy: "Bağlantı kopyalanamadı",
    copyLink: "Bağlantıyı kopyala",
    copied: "Kopyalandı!",
    sendEmail: "E-posta gönder",
    clickToViewImage: "Resmi görüntülemek için tıklayın",
    downloadPdf: "CV'yi İndir (PDF)",
    downloading: "PDF oluşturuluyor...",
    downloadSuccess: "CV başarıyla indirildi!",
  },
  zh: {
    professionalSummary: "个人总结",
    workExperience: "工作经历",
    Skills: "专业技能",
    education: "教育背景",
    languages: "语言能力",
    present: "至今",
    translateCv: "翻译简历",
    profileCopied: "个人主页链接已复制！",
    failedToCopy: "复制链接失败",
    copyLink: "复制链接",
    copied: "已复制！",
    sendEmail: "发送邮件",
    clickToViewImage: "点击查看图片",
    downloadPdf: "下载简历 (PDF)",
    downloading: "正在生成 PDF...",
    downloadSuccess: "简历下载成功！",
  },
  ja: {
    professionalSummary: "職務要約",
    workExperience: "職歴",
    Skills: "スキル",
    education: "学歴",
    languages: "言語",
    present: "現在",
    translateCv: "履歴書を翻訳",
    profileCopied: "プロフィールリンクをコピーしました！",
    failedToCopy: "リンクのコピーに失敗しました",
    copyLink: "リンクをコピー",
    copied: "コピー完了！",
    sendEmail: "メールを送信",
    clickToViewImage: "画像を表示",
    downloadPdf: "履歴書をダウンロード (PDF)",
    downloading: "PDFを作成中...",
    downloadSuccess: "履歴書をダウンロードしました！",
  },
};

export function getUiTexts(lang) {
  return CV_UI_TRANSLATIONS[lang] || CV_UI_TRANSLATIONS.en;
}


/**
 * Free Google Translate fallback API helper
 * Highly reliable, fast, and does not require third-party paid keys
 */
export async function translateText(text, targetLang, sourceLang = "auto") {
  if (!text || typeof text !== "string" || !text.trim()) return text;
  if (targetLang === "en" && sourceLang === "en") return text;

  const trimmed = text.trim();
  const cacheKey = `${trimmed}_to_${targetLang}`;

  if (memoryTranslationCache.has(cacheKey)) {
    return memoryTranslationCache.get(cacheKey);
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      trimmed
    )}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Translation request failed");
    const data = await res.json();

    if (Array.isArray(data) && Array.isArray(data[0])) {
      const translated = data[0].map((item) => item[0]).join("");
      memoryTranslationCache.set(cacheKey, translated);
      return translated || text;
    }
  } catch (error) {
    console.warn("Translation fallback warning:", error);
  }
  return text;
}

/**
 * Translates an entire user CV data object and caches it in localStorage
 * LocalStorage key format: `user_${username}_${lang}`
 * Also checks `updatedAt` to ensure freshness when profile is modified.
 */
export async function getOrTranslateUserData(baseUser, targetLang) {
  if (!baseUser || !baseUser.username) return baseUser;
  if (targetLang === "en") return baseUser; // Default base language

  const username = baseUser.username.toLowerCase();
  const storageKey = `user_${username}_${targetLang}`;

  // 1. Check LocalStorage cache
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        // If data hasn't been updated on the server, use local cache immediately!
        if (
          parsed &&
          parsed.translatedFor === targetLang &&
          (!baseUser.updatedAt || parsed.sourceUpdatedAt === baseUser.updatedAt)
        ) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error reading translated cache:", e);
    }
  }

  // 2. Perform Batch Translation on Profile Fields
  const translated = { ...baseUser };

  // Translate basic text fields
  if (baseUser.specialization) {
    translated.specialization = await translateText(baseUser.specialization, targetLang);
  }
  if (baseUser.summary) {
    translated.summary = await translateText(baseUser.summary, targetLang);
  }
  if (baseUser.country) {
    translated.country = await translateText(baseUser.country, targetLang);
  }

  // Translate Work Experiences
  if (Array.isArray(baseUser.experiences) && baseUser.experiences.length > 0) {
    translated.experiences = await Promise.all(
      baseUser.experiences.map(async (exp) => ({
        ...exp,
        position: await translateText(exp.position, targetLang),
        company: exp.company, // Company names usually stay original
        location: exp.location ? await translateText(exp.location, targetLang) : "",
        description: exp.description ? await translateText(exp.description, targetLang) : "",
      }))
    );
  }

  // Translate Educations
  if (Array.isArray(baseUser.educations) && baseUser.educations.length > 0) {
    translated.educations = await Promise.all(
      baseUser.educations.map(async (edu) => ({
        ...edu,
        degree: await translateText(edu.degree, targetLang),
        institution: edu.institution,
        fieldOfStudy: edu.fieldOfStudy ? await translateText(edu.fieldOfStudy, targetLang) : "",
        description: edu.description ? await translateText(edu.description, targetLang) : "",
      }))
    );
  }

  // Translate Skills
  if (Array.isArray(baseUser.skillsList) && baseUser.skillsList.length > 0) {
    translated.skillsList = await Promise.all(
      baseUser.skillsList.map(async (sk) => ({
        ...sk,
        name: await translateText(sk.name, targetLang),
      }))
    );
  }

  // Translate Languages
  if (Array.isArray(baseUser.languagesList) && baseUser.languagesList.length > 0) {
    translated.languagesList = await Promise.all(
      baseUser.languagesList.map(async (lang) => ({
        ...lang,
        language: await translateText(lang.language, targetLang),
      }))
    );
  }

  // Save metadata to validate updates later
  translated.translatedFor = targetLang;
  translated.sourceUpdatedAt = baseUser.updatedAt || new Date().toISOString();

  // 3. Cache in LocalStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(storageKey, JSON.stringify(translated));
    } catch (e) {
      console.warn("Error saving translated cache to localStorage:", e);
    }
  }

  return translated;
}
