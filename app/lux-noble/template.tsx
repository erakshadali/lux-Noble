// A template remounts on every navigation, so each page fades in.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="ln-page">{children}</div>;
}
