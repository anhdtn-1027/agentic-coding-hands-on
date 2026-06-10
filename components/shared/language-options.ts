// mm:hUyaaugye2 (Dropdown-ngôn ngữ) — VN/EN from design, JA added per clarifications
export interface LanguageOption {
  code: "vi" | "en" | "ja";
  label: string;
  flagSrc: string;
  flagAlt: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: "vi",
    label: "VN",
    flagSrc: "/shared/flag-vn.svg",
    flagAlt: "Tiếng Việt",
  },
  {
    code: "en",
    label: "EN",
    flagSrc: "/shared/flag-gb.svg",
    flagAlt: "English",
  },
  {
    code: "ja",
    label: "JP",
    flagSrc: "/shared/flag-jp.svg",
    flagAlt: "日本語",
  },
] as const;
