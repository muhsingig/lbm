/** The room itself is a client component, so its title lives here. */
export const metadata = {
  title: 'The Way Out — Second Nature, Art House NMACC',
  description:
    'Credits, curators, visitor information and sources for an academic field study of Second Nature at the Art House, NMACC, Mumbai.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
