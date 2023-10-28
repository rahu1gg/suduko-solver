import Link from 'next/link';

export default function Header() {
	return (
		<header className='border-b h-14 flex items-center justify-start'>
			<div className='w-maxi mx-auto'>
				<Link href={'/'} className='p-2 relative -left-2 font-medium'>
					Suduko Solver
				</Link>
			</div>
		</header>
	);
}
