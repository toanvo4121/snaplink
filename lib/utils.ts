import { customAlphabet } from 'nanoid';

// Bỏ ký tự dễ nhầm lẫn (0/O, 1/l/I) để slug dễ đọc/gõ tay khi share
const nanoid = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 7);

export function generateSlug() {
  return nanoid();
}
