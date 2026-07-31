import { Room } from '@/components/Room';

export const metadata = {
  title: 'Level 00, Random International — Second Nature, Art House NMACC',
  description:
    'The floor that watches back. Our Future Selves, Audience and Presence and Erasure — and a real security dome sharing the ceiling with a work about being watched.',
};


export default function Page() {
  return (
    <Room
      room="level-0"
      chapterId="level-0"
    />
  );
}
