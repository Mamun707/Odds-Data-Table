"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
	ColumnDef,
	getCoreRowModel,
	useReactTable,
	flexRender,Row
} from "@tanstack/react-table";
import { OddsEntry } from "@/types/odds";
import OddsCell from "./OddsCell";
import { fetchOdds } from "@/lib/fetchOdds";
import {twMerge} from "tailwind-merge";
import clsx from "clsx";

interface OddsTableProps {
	initialOdds: OddsEntry[];
}

interface RunnerData {
	runner: string;
	[bookkeeper: string]: {
		fixedP: number;
		fixedW: number;
	} | string;
}

const OddsTable: React.FC<OddsTableProps> = ({ initialOdds }) => {
	const [data, setData] = useState<RunnerData[]>([]);
	const prevDataRef = useRef(new Map<string, { fixedP: number; fixedW: number }>());
	const currentDataRef = useRef<Map<string, { fixedP: number; fixedW: number }>>(new Map());

	const transformData = (odds: OddsEntry[]): RunnerData[] => {
		const map = new Map<string, RunnerData>();
		
		odds.forEach((entry) => {
			if (!map.has(entry.runner)) {
				map.set(entry.runner, { runner: entry.runner });
			}
			const obj = map.get(entry.runner)!;
			obj[entry.bookkeeper] = {
				fixedP: entry.fixedP,
				fixedW: entry.fixedW,
			};
		});
		
		return Array.from(map.values());
	};
	
	useEffect(() => {
		setData(transformData(initialOdds));
		const initialMap = new Map<string, { fixedP: number; fixedW: number }>();
		initialOdds.forEach((entry) => {
			initialMap.set(`${entry.runner}-${entry.bookkeeper}`, {
				fixedP: entry.fixedP,
				fixedW: entry.fixedW,
			});
		});
		currentDataRef.current = new Map(initialMap);
    	prevDataRef.current = new Map();
	}, [initialOdds]);
	
	useEffect(() => {
		const interval = setInterval(async () => {
			try {
				const newOdds = await fetchOdds();
				const newData = transformData(newOdds);

				const newMap = new Map<string, { fixedP: number; fixedW: number }>();
				newOdds.forEach((entry) => {
					newMap.set(`${entry.runner}-${entry.bookkeeper}`, {
						fixedP: entry.fixedP,
						fixedW: entry.fixedW,
					});
				});
				prevDataRef.current = new Map(currentDataRef.current);
				currentDataRef.current = newMap;
				
				setData(newData);
			} catch (err) {
				console.error("Error updating odds:", err);
			}
		}, 5000);
		
		return () => clearInterval(interval);
	}, []);
	
	
	
	const columns = useMemo<ColumnDef<RunnerData>[]>(() => {
		const dynamicColumns = Array.from({ length: 200 }, (_, i) => {
			const bookie = `Bookkeeper ${i + 1}`;
			return {
				accessorKey: bookie,
				header: bookie,
				cell: ({ row }: { row: Row<RunnerData> }) => {
					const runner = row.original.runner;
					const current = row.original[bookie] as { fixedP: number; fixedW: number };
					const prev = prevDataRef.current.get(`${runner}-${bookie}`);
					
					return (
						<OddsCell
							fixedP={current?.fixedP}
							fixedW={current?.fixedW}
							prevFixedP={prev?.fixedP}
							prevFixedW={prev?.fixedW}
						/>
					);
				},
			};
		});
		
		return [...dynamicColumns];

	}, []);
	
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	
	return (
		<div className="overflow-x-auto max-w-full">
			<table className="min-w-full border border-gray-300 text-sm">
				<thead className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white sticky top-0 z-10">
				{table.getHeaderGroups().map((headerGroup, i) => (
					<React.Fragment key={headerGroup.id}>
						<tr>
							{i === 0 && (
								<th
									rowSpan={2}
									className="px-4 py-2 text-center border border-gray-300 bg-purple-600 text-white sticky left-0 z-20"
								>
									Runner
								</th>
							)}
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									colSpan={2}
									className="px-4 py-2 text-center border border-gray-300 text-[14px]"
								>
									{!header.isPlaceholder &&
										flexRender(header.column.columnDef.header, header.getContext())}
								</th>
							))}
						</tr>
						{i === 0 && (
							<tr>
								{headerGroup.headers.map((header) => (
									<React.Fragment key={`${header.id}-sub`}>
										<th className="text-center border border-gray-300 font-semibold">P</th>
										<th className="text-center border border-gray-300 font-semibold">W</th>
									</React.Fragment>
								))}
							</tr>
						)}
					</React.Fragment>
				))}
				</thead>
				
				<tbody>
				{table.getRowModel().rows.map((row) => (
					<tr
						key={row.id}
						className="even:bg-gradient-to-r from-blue-100 via-blue-300 to-blue-400 odd:bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-300 hover:bg-gray-200 transition-colors"
					>
						<td className="sticky left-0 bg-purple-600 border border-gray-300 text-[12px] font-bold px-2 z-10">
							{row.original.runner}
						</td>
						
						{row.getVisibleCells().map((cell) => {
							const runner = row.original.runner;
							const bookie = cell.column.id;
							const current = row.original[bookie] as { fixedP: number; fixedW: number };
							const prev = prevDataRef.current.get(`${runner}-${bookie}`);
							
							const getColor = (curr?: number, prev?: number) => {
								if (curr == null || prev == null) return "text-gray-800";
								if (curr > prev) return "bg-green-500 text-white ";
								if (curr < prev) return "bg-red-500 text-white ";
								if(curr === prev) return "bg-gray-500 text-white ";
								return "bg-white text-gray-800";
							};
							
							const getAnimationClass = (curr?: number, prev?: number) => {
								if (curr == null || prev == null) return "";
								if (curr !== prev) return "animate-blink";
								return "";
							};
							
							return (
								<React.Fragment key={cell.id}>
									<td
										className={twMerge(
											clsx(
												'p-2 text-[10px] text-center border border-gray-300 font-semibold',
												getColor(current?.fixedP, prev?.fixedP),
												getAnimationClass(current?.fixedP, prev?.fixedP)
											)
										)}
									>
										{current?.fixedP}
									</td>
									<td
										className={twMerge(
											clsx(
												'p-2 text-[10px] text-center border border-gray-300 font-semibold',
												getColor(current?.fixedW, prev?.fixedW),
												getAnimationClass(current?.fixedW, prev?.fixedW)
											)
										)}
									>
										{current?.fixedW}
									</td>
								</React.Fragment>
							);
						})}
					</tr>
				))}
				</tbody>
			
			</table>
		</div>
	
	
	);
};

export default OddsTable;