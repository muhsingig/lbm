import { Room } from '@/components/Room';

export const metadata = {
  title: 'Hallway — Second Nature, Art House NMACC',
  description:
    'Before the ticket: a mosaic of Indian culture and heritage — the floral elephant, the marquetry wall, and a working handloom on the Swadesh shop floor.',
};


export default function Page() {
  return (
    <Room
      room="hallway"
      chapterId="hallway"
    />
  );
}
