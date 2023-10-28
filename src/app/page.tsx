import Header from '@/components/pages/header';
import SudukoGrid from '@/components/pages/home/client';
import { Fragment } from 'react';

export default function Home() {
	return (
		<Fragment>
			<Header />
			<main>
				<section className='w-maxi mx-auto'>
					<SudukoGrid />
				</section>
			</main>
		</Fragment>
	);
}
