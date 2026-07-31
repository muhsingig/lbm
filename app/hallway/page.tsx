import { chapters } from '@/content/exhibition';
import { Room } from '@/components/Room';

export const metadata = {
  title: 'Hallway — Second Nature, Art House NMACC',
  description:
    'Before the ticket: oud held evenly across an enormous volume of air, the floral elephant, and a working handloom on the Swadesh shop floor.',
};

const chapter = chapters.find((c) => c.id === 'hallway')!;

export default function Page() {
  return (
    <Room
      room="hallway"
      chapterId="hallway"
      extraPlates={[
        {
          id: 'field-note',
          kind: 'note',
          eyebrow: 'Field note — our own',
          title: 'Made small, then made welcome',
          body: chapter.fieldNote!,
        },
      ]}
    />
  );
}
