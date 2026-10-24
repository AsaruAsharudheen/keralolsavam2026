// Date & Time formatting utility for Nellaya Keralolsavam 2026

export function formatMatchDate(dateStr) {
  if (!dateStr) return '';
  // dateStr like '2026-10-24'
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const day = parts[2];
    const month = parts[1];
    const year = parts[0].slice(2); // '26'
    const monthNames = {
      '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
      '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
      '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
    };
    return `${day} ${monthNames[month] || month} 20${year}`;
  }
  return dateStr;
}

export function formatMatchTime(timeStr) {
  if (!timeStr) return '';
  // timeStr like '06:30:00' or '18:30:00'
  const parts = timeStr.split(':');
  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // '0' becomes '12'
    return `${hours}:${minutes} ${ampm}`;
  }
  return timeStr;
}

export function formatMatchDateTime(dateStr, timeStr) {
  const d = formatMatchDate(dateStr);
  const t = formatMatchTime(timeStr);
  if (d && t) return `${d} · ${t}`;
  return d || t || '';
}
