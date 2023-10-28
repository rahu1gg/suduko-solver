import { Toaster } from '@/components/ui/toaster';
import '@/styles/main.scss';
import type { Metadata } from 'next';
import { Aldrich, Nunito } from 'next/font/google';

const inter = Nunito({ subsets: ['latin'], variable: '--font-inter' });
const aldrich = Aldrich({ weight: ['400'], variable: '--font-aldrich', subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Suduko Solver',
	description: 'A Next.js app used to solve a suduko puzzle',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={`${inter.variable} ${aldrich.variable} ${inter.className}`}>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
