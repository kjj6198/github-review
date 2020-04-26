export function buildScale(min: number, max: number) {
  return function (range: { min: number; max: number }) {
    return function scale(value: number) {
      return (
        (((range.max - range.min) / (max - min)) * value) /
        (range.max - range.min)
      );
    };
  };
}

export function findMinMax(nums: number[]) {
  return {
    max: Math.max(...nums),
    min: Math.min(...nums),
  };
}

type AvailableLangs = "zh-TW" | "en" | "ja" | "jp";
export function getUserLanguage(
  language: string,
  languages: ReadonlyArray<string>
): AvailableLangs {
  const availableLang: Array<string> = ["zh-TW", "en", "ja", "jp"];
  if (availableLang.includes(language)) {
    return language as AvailableLangs;
  } else if (languages.length) {
    return (availableLang.includes(languages[0])
      ? languages[0]
      : "en") as AvailableLangs;
  }

  return "en";
}

export function createTranslation(lang: string, translation: any) {
  return function translationFn(
    key: string,
    ...interpolations: unknown[]
  ): string {
    // only happy path
    const parts = key.split(".");
    const string = parts.reduce((acc, key) => {
      return acc[key];
    }, translation);

    if (interpolations.length) {
      return string.replace(/\{(\d+)\}/g, function matchFn(
        match: string,
        group: string
      ) {
        const num = parseInt(group, 10);
        return interpolations[num];
      });
    }

    return string;
  };
}
