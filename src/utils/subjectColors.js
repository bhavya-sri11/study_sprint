// Deterministic color palette generator for course subjects
const PALETTES = [
  { bg: '#ede9fe', text: '#5b21b6', border: '#ddd6fe', dot: '#7c3aed' }, // Indigo / Violet
  { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0', dot: '#10b981' }, // Emerald
  { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe', dot: '#3b82f6' }, // Blue
  { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa', dot: '#f97316' }, // Orange
  { bg: '#fdf4ff', text: '#86198f', border: '#f5d0fe', dot: '#d946ef' }, // Fuchsia
  { bg: '#ecfeff', text: '#155e75', border: '#a5f3fc', dot: '#06b6d4' }, // Cyan
  { bg: '#fff1f2', text: '#9f1239', border: '#fecdd3', dot: '#f43f5e' }, // Rose
  { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', dot: '#22c55e' }, // Green
  { bg: '#fefce8', text: '#854d0e', border: '#fef08a', dot: '#eab308' }, // Yellow/Amber
];

export function getSubjectColor(subject = '') {
  if (!subject) return PALETTES[0];
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTES.length;
  return PALETTES[index];
}
