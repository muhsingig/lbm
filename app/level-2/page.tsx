import { Room } from '@/components/Room';

export const metadata = {
  title: 'Level 02, Heijdens and Murakami — Second Nature, Art House NMACC',
  description:
    'Weather, indoors. Lightweeds runs on the real weather over Mumbai; New Spring drops mist-filled blossoms that burst on contact with skin.',
};


export default function Page() {
  return (
    <Room
      room="level-2"
      chapterId="level-2"
    />
  );
}
