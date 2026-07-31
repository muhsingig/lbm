import { ogCard, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';

// Metadata routes must be statically generated under `output: 'export'`.
export const dynamic = 'force-static';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Level 2 — Second Nature, Art House NMACC';

export default function Image() {
  return ogCard('level-2');
}
