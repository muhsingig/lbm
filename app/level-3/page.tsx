'use client';

import { useState } from 'react';
import { chapters, inversion } from '@/content/exhibition';
import { Room } from '@/components/Room';

const chapter = chapters.find((c) => c.id === 'level-3')!;

/**
 * The payoff of the climb, and now it is something you do rather than
 * something that happens as you scroll past.
 *
 * You arrive on this floor still in the dark, because the sketchbook wall is a
 * lit object in a black room and that is exactly what our photograph shows.
 * Take the page off the wall and the whole building turns to paper — the white
 * you end on is the page in your hand.
 */
export default function Page() {
  const [taken, setTaken] = useState(false);

  return (
    <Room
      room="level-3"
      chapterId="level-3"
      theme={taken ? 'level-3' : 'level-2'}
      onOpenPlate={(id) => {
        if (id === 'take-home') setTaken(true);
      }}
      extraPlates={[
        {
          id: 'take-home',
          kind: 'page',
          eyebrow: 'Take one',
          title: inversion.after.heading,
          body: `${inversion.line} ${inversion.after.body}`,
          todo: inversion.after.todo,
        },
        {
          id: 'field-note',
          kind: 'note',
          eyebrow: 'Field note — our own',
          title: 'Nobody said much on the way down',
          body: chapter.fieldNote!,
        },
      ]}
    />
  );
}
