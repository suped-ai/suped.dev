/**
 * Docs sidebar groups, in display order. A doc's `section` frontmatter must
 * match one of these keys; pages inside a group sort by `order`.
 * Add a group here when the docs outgrow the existing ones.
 */
export const SECTIONS = [
  { key: 'start', title: 'Start' },
  { key: 'computer', title: 'The computer' },
  { key: 'reference', title: 'Reference' },
  { key: 'agents', title: 'Agents' },
  { key: 'why', title: 'Why' },
] as const;

export type SectionKey = (typeof SECTIONS)[number]['key'];
export const SECTION_KEYS = SECTIONS.map((s) => s.key) as [SectionKey, ...SectionKey[]];
