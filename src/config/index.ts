export const appConfig = {
  appName: import.meta.env.VITE_APP_NAME ?? "MOI DOCCTARR",
  openAiApiKey: import.meta.env.VITE_OPENAI_API_KEY ?? "",
  openAiModel: import.meta.env.VITE_OPENAI_MODEL ?? "gpt-5.4-mini",
} as const;
