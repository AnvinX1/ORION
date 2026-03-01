import { TerminalClientWrapper } from './terminal-client';

export const metadata = {
  title: 'Orion — CUDA→HIP Migration Monitor',
  description: 'Open source terminal UI for CUDA to HIP migration monitoring. Welcome, contributors!',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <TerminalClientWrapper />
    </main>
  );
}
