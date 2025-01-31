import { useState, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import './App.css'

function App() {
 const svgRef = useRef();
 const [data, setData] = useState(null);

 useEffect(() => {
  async function fetchData() {
    try {
   const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json');
    if (!response.ok) {
      throw new Error('HTTP error, status = ' + response.status);
    }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data: ', error)
    }
  }
  fetchData();
  console.log(data); 
 }, [])
  
 useEffect(() => {
 if (!data) return;
  
 const margin = { top: 80, right: 50, bottom: 200, left: 80};
 const height = 650;
 const width = 1400;

 const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

 const minTemp = d3.min(data.monthlyVariance, d => data.baseTemperature + d.variance);
 const maxTemp = d3.max(data.monthlyVariance, d => data.baseTemperature + d.variance);

 const svg = d3.select(svgRef.current)
  .attr('height', height)
  .attr('width', width)
  .style('margin-top', '20px')
  
  const xScale = d3.scaleTime()
   .domain([
    d3.min(data.monthlyVariance, d => new Date(d.year, d.month - 1)),
    d3.max(data.monthlyVariance, d => new Date(d.year, d.month - 1))
 
   ])
   .range([margin.left, width - margin.right])

  const yScale = d3.scaleBand()
   .domain(months)
   .range([margin.top, height - margin.bottom])

   const colorScale = d3.scaleSequential()
   .domain([maxTemp, minTemp])
   .interpolator(d3.interpolateRdYlBu);
   
   const xAxis = d3.axisBottom(xScale)
    .ticks(d3.timeYear.every(10))

   const yAxis = d3.axisLeft(yScale)
  
   
   svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .attr('id', 'x-axis')
    .call(xAxis)

  svg.append('g')
   .call(yAxis)
   .attr('transform', `translate(${margin.left}, 0)`)
   .attr('id', 'y-axis')

   const yearRange = d3.max(data.monthlyVariance, d => d.year) - 
                     d3.min(data.monthlyVariance, d => d.year);

   const cellWidth = (width - margin.left - margin.right) / yearRange;

  const tooltip = d3.select('body')
   .append('div')
   .attr('id', 'tooltip')
   .style('opacity', 0)
   .style('position', 'absolute')
   .style('background-color', 'black')
    .style('color', 'white')
    .style('padding', '5px')
    .style('border-radius', '5px')
    .style('font-size', '12px')
    .style('pointer-events', 'none')

   svg.selectAll('rect')
   .data(data.monthlyVariance)
   .enter()
   .append('rect')
   .attr('x', d => xScale(new Date(d.year, 0)))
   .attr('y', d => yScale(months[d.month - 1]))
   .attr('width', cellWidth)
   .attr('height', yScale.bandwidth())
   .style('stroke', 'none')
   .attr('class', 'cell')
   .style('fill', d => colorScale(data.baseTemperature + d.variance))
   .attr('data-year', d => d.year)
   .attr('data-month', d => (d.month - 1).toString())
   .attr('data-temp', d => (data.baseTemperature + d.variance).toString())
   .on('mouseover', (event, d) => {
     tooltip.transition()
     .duration(200)
     .style('opacity', 0.9)
    
     tooltip
      .html(`${d.year} - ${months[d.month - 1]}<br>${(data.baseTemperature + d.variance).toFixed(2)}°C<br>${d.variance.toFixed(2)}°C`)
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY - 28 + 'px')
      .attr('data-year', d.year)
   })
  .on('mouseout', () => {
    tooltip.transition()
    .duration(200)
    .style('opacity', 0)
  })
 
  const legendWidth = 400;
const legendHeight = 20;

const legendScale = d3.scaleLinear()
  .domain([minTemp, maxTemp])
  .range([0, legendWidth]);

const legend = svg.append('g')
  .attr('id', 'legend')
  .attr('transform', `translate(${margin.left}, ${height - margin.bottom + 50})`);

const legendSteps = 40; 
const stepWidth = legendWidth / legendSteps;

for (let i = 0; i < legendSteps; i++) {
  const temp = legendScale.invert(i * stepWidth);
  legend.append('rect')
    .attr('x', i * stepWidth)
    .attr('y', 0)
    .attr('width', stepWidth)
    .attr('height', legendHeight * 2)
    .style('fill', colorScale(temp));
}

const legendAxis = d3.axisBottom(legendScale)
.tickFormat(d => `${d.toFixed(1)}°C`)
.ticks(7)
 
legend.append('g')
.attr('transform', `translate(0, ${legendHeight + 25})`)
.call(legendAxis)

svg.append('text')
 .attr('x', width / 2)
 .attr('y', margin.top - 40)
 .attr('id', 'title')
  .style('text-anchor', 'middle')
  .style('font-size', '24px')
  .style('font-family', 'Arial')
.style('font-weight', 'bold')
 .text('Monthly Global Land-Surface Temperature')
 
 svg.append('text')
 .attr('id', 'description')
 .attr('x', width / 2)
 .attr('y', margin.top - 10)
 .style('text-anchor', 'middle')
  .style('font-size', '17px')
  .style('font-family', 'verdana')
  .text('1753 - 2015: Base Temperature 8.66°C')

 }, [data])

  return (
    <>
    <svg ref={svgRef}></svg> 
    
    </>
  )
}

export default App
