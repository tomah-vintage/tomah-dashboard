/**
 * Transliteration utility for converting Mongolian Cyrillic to Latin characters
 */

const CYRILLIC_TO_LATIN_MAP: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'ө': 'o', 'ү': 'u',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
  'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
  'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
  'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
  'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
  'Ө': 'O', 'Ү': 'U'
};

/**
 * Transliterates Mongolian Cyrillic text to Latin characters
 * @param mongolianText - The Cyrillic text to transliterate
 * @returns The transliterated Latin text
 */
export function transliterateMongolian(mongolianText: string): string {
  if (!mongolianText) return '';
  
  return mongolianText
    .split('')
    .map(char => CYRILLIC_TO_LATIN_MAP[char] || char)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates an English name from Mongolian input
 * @param mongolianName - The Mongolian name
 * @returns The generated English name
 */
export function generateEnglishName(mongolianName: string): string {
  return transliterateMongolian(mongolianName);
}