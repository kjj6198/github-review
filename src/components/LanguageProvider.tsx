import React, { useContext, createContext, useMemo, useState } from "react";
import translation from "../config/translation";
import { getUserLanguage, createTranslation } from "../utils";

export const LanguageContext = createContext<any>(null);

const LanguageProvider: React.FC = ({ children }) => {
  // get default lang by navigator
  const defaultLang = getUserLanguage(navigator.language, navigator.languages);
  const [lang, setLanguage] = useState(defaultLang);
  const t = useMemo(() => createTranslation(lang, translation[lang]), [lang]);

  return (
    <LanguageContext.Provider
      value={{
        t,
        setLanguage,
      }}
    >
      {React.Children.only(children)}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  return useContext<{
    t: (key: string, ...interpolations: unknown[]) => string;
    setLanguage: React.Dispatch<
      React.SetStateAction<"zh-TW" | "ja" | "jp" | "en">
    >;
  }>(LanguageContext);
};

export default LanguageProvider;
