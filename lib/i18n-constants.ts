// Client-safe constants for i18n
// This file can be imported by both client and server components

export type Language = 'en' | 'ms' | 'zh-CN'

export const SUPPORTED_LANGUAGES: Language[] = ['en', 'ms', 'zh-CN']

export const LANGUAGE_NAMES: Record<Language, string> = {
  'en': 'English',
  'ms': 'Bahasa Malaysia',
  'zh-CN': '简体中文',
}




