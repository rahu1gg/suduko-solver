'use client';

import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

export function ResetSuduko({
	children,
}: {
	children: ReactNode;
}) {
	function handleClick() {
		console.log('reset suduko');
	}

	return (
		<Button type='button' variant='outline' className='font-semibold text-sm' onClick={handleClick}>
			{children}
		</Button>
	);
}
