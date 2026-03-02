import "server-only";

export type Locale = "en" | "az";

export interface Dictionary {
  products: {
    cart: string;
  };
  common: {
    locale: string;
  };
  "Sign Up": string;
  "Sign In": string;
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () =>
    import("../../dictionaries/en.json").then((module) => module.default as Dictionary),
  az: () =>
    import("../../dictionaries/az.json").then((module) => module.default as Dictionary),
};

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  if (!hasLocale(locale)) {
    throw new Error(`Locale ${locale} not found in dictionaries`);
  }

  return dictionaries[locale]();
};
