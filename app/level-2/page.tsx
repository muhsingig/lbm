import { chapters } from '@/content/exhibition';
import { Room } from '@/components/Room';

export const metadata = {
  title: 'Level 02, Heijdens and Murakami — Second Nature, Art House NMACC',
  description:
    'Weather, indoors. Lightweeds runs on the real weather over Mumbai; New Spring drops mist-filled blossoms that burst on contact with skin.',
};

const chapter = chapters.find((c) => c.id === 'level-2')!;

export default function Page() {
  return (
    <Room
      room="level-2"
      chapterId="level-2"
      extraPlates={[
        {
          id: 'field-note',
          kind: 'note',
          eyebrow: 'Field note — our own',
          title: 'Permission to behave like a child',
          body: chapter.fieldNote!,
        },
      ]}
    />
  );
}
