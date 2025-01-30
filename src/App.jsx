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
  
 const margin = { top: 20, right: 20, bottom: 20, left: 20};
 const height = 650;
 const width = 1400;

 const formatMonth = (month) => {
  const date = new Date(0);
  date.setUTCMonth(month);
  return d3.timeFormat('%B');
 }

 const formatYear = (year) => {
  const date = new Date(0);
  date.setUTCFullYear(year);
  return d3.timeFormat('%Y')(date);
 }

 const svg = d3.select(svgRef.current)
  .attr('height', height)
  .attr('width', width)
  .style('background-color', 'lightblue')
  .style('margin-top', '20px')
  
  const xScale = d3.scaleLinear()
   .domain([d3.min(data.monthlyVariance , d => formatYear(d.year)), d3.max(data.monthlyVariance, d => formatYear(d.year))])
   .range([margin.left, width - margin.right])

  const yScale = d3.scaleBand()
   .domain(data.monthlyVariance.map(d => formatMonth(d.month)))
   .range([margin.top, height - margin.bottom])
   
   const xAxis = d3.axisBottom(xScale)
   const yAxis = d3.axisLeft(yScale)
   
   svg.append('g')
    .call(xAxis)
    .attr('transform', `translate(0, ${height - margin.bottom})`)

 }, [data])




  return (
    <>
    <svg ref={svgRef}></svg> 
    
    </>
  )
}

export default App
