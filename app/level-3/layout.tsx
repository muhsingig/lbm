/** The room itself is a client component — taking the page changes the whole
 *  building's palette — so its title lives here. */
export const metadata = {
  title: 'Level 03, Es Devlin — Second Nature, Art House NMACC',
  description:
    'Screenshare: a wall built from 365 sketchbooks, a film of Dam Van Huynh dancing beside himself eighteen years younger, and a page you are invited to take home.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
