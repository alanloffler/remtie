// App
import { useEffect } from 'react';
import * as d3 from 'd3';
// Interface Pie Chart
interface IProps {
	data: IData[];
	outerRadius: number;
	innerRadius: number;
	margins: number;
}

interface IData {
	category: string;
	total: number;
	percentage: number;
	color: string;
}
// React component
function PieChart({ data, innerRadius, outerRadius, margins }: IProps) {
	const margin = {
		top: margins,
		right: margins,
		bottom: margins,
		left: margins
	};

	const width: number = 2 * outerRadius + margin.left + margin.right;
	const height: number = 2 * outerRadius + margin.top + margin.bottom;

	useEffect(() => {
		drawChart();

		function drawChart() {
			d3.select('#pie-container').select('svg').remove();

			const svg = d3
				.select('#pie-container')
				.append('svg')
				.attr('width', width)
				.attr('height', height)
				.append('g')
				.attr('transform', `translate(${width / 2}, ${height / 2})`);

			const arcGenerator = d3.arc<unknown>().innerRadius(innerRadius).outerRadius(outerRadius);

			const pieGenerator = d3
				.pie<IData>()
				.padAngle(0)
				.value((d) => d.total);

			const arc = svg.selectAll().data(pieGenerator(data)).enter();

			arc.append('path')
				.attr('d', arcGenerator)
				.style('fill', (e) => e.data.color)
				.style('stroke', '#ffffff')
				.style('stroke-width', 0);

			arc.append('text')
				.attr('text-anchor', 'middle')
				.attr('alignment-baseline', 'middle')
				.text((d) => `${d.data.percentage.toFixed(1)}%`)
				.style('fill', 'black')
				.style('font-size', 12)
				.attr('transform', (d) => {
					const [x, y] = arcGenerator.centroid(d);
					return `translate(${x}, ${y})`;
				});
		}
	}, [data, height, innerRadius, outerRadius, width]);

	return <div id='pie-container' />;
}
// Export React component
export default PieChart;
