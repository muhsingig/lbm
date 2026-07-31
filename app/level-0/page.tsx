import { chapters } from '@/content/exhibition';
import { Room } from '@/components/Room';

export const metadata = {
  title: 'Level 00, Random International — Second Nature, Art House NMACC',
  description:
    'The floor that watches back. Our Future Selves, Audience and Presence and Erasure — and a real security dome sharing the ceiling with a work about being watched.',
};

const chapter = chapters.find((c) => c.id === 'level-0')!;

export default function Page() {
  return (
    <Room
      room="level-0"
      chapterId="level-0"
      extraPlates={[
        {
          id: 'field-note',
          kind: 'note',
          eyebrow: 'Field note — our own',
          title: 'Both readings hold',
          body: chapter.fieldNote!,
        },
      ]}
    />
  );
}
