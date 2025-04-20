'use client'
import React from "react";

interface OddsCellProps {
	fixedP?: number;
	fixedW?: number;
	prevFixedP?: number;
	prevFixedW?: number;
}

const getColor = (current?: number, previous?: number): string => {
	if (current === undefined || previous === undefined) return "text-gray-600";
	if (current > previous) return "text-green-600";
	if (current < previous) return "text-red-600";
	return "text-gray-600";
};

const OddsCell: React.FC<OddsCellProps> = ({ fixedP, fixedW, prevFixedP, prevFixedW }) => {
	const colorP = getColor(fixedP, prevFixedP);
	const colorW = getColor(fixedW, prevFixedW);
	
	return (
		<div className="text-sm leading-tight">
			<div className={colorP}>P: {fixedP ?? "-"}</div>
			<div className={colorW}>W: {fixedW ?? "-"}</div>
		</div>
	);
};

export default OddsCell;