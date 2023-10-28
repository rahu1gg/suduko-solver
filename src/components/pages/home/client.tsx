'use client';

import { SUDUKO } from '@/constants/suduko';
import { ChangeEvent, FormEvent, Fragment, useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { toast } from '../../ui/use-toast';

type Suduko = { value: number; change: boolean }[][];

export default function SudukoGrid() {
	const [suduko, setSuduko] = useState<Suduko>(SUDUKO);
	const [loading, setLoading] = useState(false);
	const GRID_SIZE = 9;

	function isNumberInRow(board: Suduko, num: number, row: number): boolean {
		for (let i = 0; i < GRID_SIZE; i++) {
			if (board[row][i].value === num) {
				return true;
			}
		}
		return false;
	}

	function isNumberInCol(board: Suduko, num: number, col: number): boolean {
		for (let i = 0; i < GRID_SIZE; i++) {
			if (board[i][col].value === num) {
				return true;
			}
		}
		return false;
	}

	function isNumberInBox(board: Suduko, num: number, row: number, col: number): boolean {
		const localBoxRow = row - (row % 3);
		const localBoxCol = col - (col % 3);

		for (let i = localBoxRow; i < localBoxRow + 3; i++) {
			for (let j = localBoxCol; j < localBoxCol + 3; j++) {
				if (board[i][j].value === num) {
					return true;
				}
			}
		}
		return false;
	}

	function isValidPlacement(board: Suduko, num: number, row: number, col: number): boolean {
		return !isNumberInRow(board, num, row) && !isNumberInCol(board, num, col) && !isNumberInBox(board, num, row, col);
	}

	function solveBoard(board: Suduko) {
		for (let row = 0; row < GRID_SIZE; row++) {
			for (let col = 0; col < GRID_SIZE; col++) {
				if (suduko[row][col].value === 0) {
					for (let numberToTry = 1; numberToTry <= GRID_SIZE; numberToTry++) {
						if (isValidPlacement(board, numberToTry, row, col)) {
							board[row][col].value = numberToTry;

							if (solveBoard(board).success) {
								return { board, success: true };
							} else {
								board[row][col].value = 0;
							}
						}
					}
					return { board, success: false };
				}
			}
		}
		return { board, success: true };
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);

		// solve suduko by backtracking method
		const res = solveBoard(suduko);
		if (res.success) {
			setSuduko((curr) => {
				return curr.map((rows, rowIndex) => {
					return rows.map((_, colIndex) => {
						return res.board[rowIndex][colIndex];
					});
				});
			});
			toast({
				description: 'Suduko solved successfully',
			});
		} else {
			toast({
				description: 'Not a valid suduko',
				variant: 'destructive',
			});
		}
		setLoading(false);
	}

	function handleResetSuduko() {
		setSuduko((curr) => {
			return curr.map((cols) => {
				return cols.map((_) => {
					return { value: 0, change: false };
				});
			});
		});
	}

	function handleUnsolvedSuduko() {
		setSuduko((curr) => {
			return curr.map((cols) => {
				return cols.map((val) => {
					if (val.change) return val;

					return { ...val, value: 0 };
				});
			});
		});
	}

	return (
		<div className='w-max mx-auto mt-5'>
			<p className='pb-4 text-center font-medium'>Solve your suduko puzzle</p>
			<form onSubmit={handleSubmit}>
				<div className='shadow-spread border-[3px] border-card-foreground w-max'>
					{suduko.map((row, rowIndex) => {
						return (
							<Fragment key={`${rowIndex}`}>
								<div className='flex w-max'>
									{row.map((col, colIndex) => {
										function handleChange(e: ChangeEvent<HTMLInputElement>) {
											if ((Number(e.target.value) < 1 || Number(e.target.value) > 9) && Number(e.target.value) !== 0) {
												// call toast for invalid input
												toast({
													description: `Value ${e.target.value} is not a valid number in suduko`,
													variant: 'destructive',
												});
											}

											setSuduko((curr) => {
												return curr.map((val, valIndex) => {
													return val.map((val2, val2Index) => {
														if (valIndex === rowIndex && val2Index === colIndex) {
															if (e.target.value === '') return { value: 0, change: false };

															if (Number(e.target.value) < 1 || Number(e.target.value) > 9) return val2;

															return { value: Number(e.target.value), change: true };
														}
														return val2;
													});
												});
											});
										}

										return (
											<span key={`${colIndex}`} className='flex items-center justify-center'>
												<Input
													type='number'
													onChange={handleChange}
													className={`w-12 h-12 aspect-square font-aldrich border-0 rounded-none hover:bg-primary/10 focus:bg-primary/10 duration-200 transition-[background-color] inline-flex items-center justify-center text-center focus:outline-0 focus-visible:ring-0 shadow-none ${
														col.change && 'text-primary font-semibold font-aldrich text-lg bg-primary/10'
													}`}
													value={col.value === 0 ? '' : col.value}
													inputMode='numeric'
												/>
												{colIndex !== 8 && (
													<hr
														className={`border-0 ${
															colIndex === 2 || colIndex === 5
																? 'border-r-2 border-r-card-foreground/80 h-[calc(100%_+_1px)] relative z-30'
																: 'h-full border-r border-r-muted-foreground/50 '
														}`}
													/>
												)}
											</span>
										);
									})}
								</div>
								{rowIndex !== 8 && (
									<hr
										className={`w-full border-0 ${
											rowIndex === 2 || rowIndex === 5 ? 'border-t-card-foreground border-t-2' : 'border-t border-muted-foreground/50'
										}`}
									/>
								)}
							</Fragment>
						);
					})}
				</div>
				<Button type='submit' className='w-full mt-5 bg-card-foreground hover:bg-card-foreground/80 disabled:cursor-pointer' disabled={loading}>
					Solve suduko
				</Button>
				<Button type='button' variant='outline' className='w-full mt-5' onClick={handleResetSuduko} disabled={loading}>
					🛝 Reset suduko
				</Button>
				<Button type='button' variant='outline' className='w-full my-5' onClick={handleUnsolvedSuduko} disabled={loading}>
					Set to unsolved suduko
				</Button>
			</form>
		</div>
	);
}
