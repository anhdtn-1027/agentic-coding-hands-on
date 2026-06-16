// mm:hUyaaugye2 (Dropdown-ngôn ngữ) — VN/EN per design
export interface LanguageOption {
  code: "vi" | "en";
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
] as const;
