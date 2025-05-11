import './globals.css';
import { Web3Provider } from './providers';

export const metadata = {
  title: 'SoulChain',
  description: 'Crypto Afterlife Smart Will DApp',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
