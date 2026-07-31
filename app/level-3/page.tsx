import { Room } from '@/components/Room';

/**
 * The payoff of the climb.
 *
 * The floor used to arrive dark and turn to paper only once you opened the
 * take-home plate. That plate is gone, and with it the trigger — so the room
 * now arrives as paper, which is what the palette was always for.
 */
export default function Page() {
  return <Room room="level-3" chapterId="level-3" />;
}
