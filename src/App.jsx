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



  return (
    <>
    <svg></svg> 
    </>
  )
}

export default App
