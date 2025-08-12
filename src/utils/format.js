/**
 * 조회수 숫자를 사람이 읽기 쉬운 형태로 변환합니다 (예: 1234567 → 1.2M)
 * @param {string|number} count
 * @returns {string}
 */
export function formatViewCount(count) {
  const num = Number(count);
  if (isNaN(num)) return "";
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B views`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M views`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K views`;
  return `${num} views`;
}

/**
 * ISO 날짜를 상대 시간 문자열로 변환합니다 (예: 2024-01-01 → "3 days ago")
 * @param {string} iso
 * @returns {string}
 */
export function formatRelativeDate(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  const week = Math.floor(day / 7);
  const month = Math.floor(day / 30);
  const year = Math.floor(day / 365);
  if (year > 0) return `${year} year${year > 1 ? "s" : ""} ago`;
  if (month > 0) return `${month} month${month > 1 ? "s" : ""} ago`;
  if (week > 0) return `${week} week${week > 1 ? "s" : ""} ago`;
  if (day > 0) return `${day} day${day > 1 ? "s" : ""} ago`;
  if (hour > 0) return `${hour} hour${hour > 1 ? "s" : ""} ago`;
  if (min > 0) return `${min} minute${min > 1 ? "s" : ""} ago`;
  return "just now";
} 