import { Room } from '@/components/Room';

export const metadata = {
  title: 'Level 01, teamLab — Second Nature, Art House NMACC',
  description:
    'The digital garden. Resonating Microcosms, Flowers and People, and Nirvana — rendered live, so the image you stand in has never existed before.',
};


export default function Page() {
  return (
    <Room
      room="level-1"
      chapterId="level-1"
    />
  );
}
