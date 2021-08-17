import React, { useEffect, useState } from 'react';
import './App.css';
import {Card, CardGroup , Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Columns from 'react-columns';

function App() {
  const[latest , setLatest] = useState([]);
  const[results , setResults] = useState([]);
  const[searchCountry , setSearchCountry] = useState("");

  useEffect(()=> {
    axios.all([
      axios.get("https://disease.sh/v3/covid-19/all"),
      axios.get("https://disease.sh/v3/covid-19/countries")
    ])
      
      .then(responseArr=> {
        setLatest(responseArr[0].data);
        setResults(responseArr[1].data);
      })
      .catch(err => {
        console.log(err);
      })
  },[]);

  const date = new Date (parseInt(latest.updated));
  const lastUpdated = date.toString();

  const filterCountry = results.filter(item => {
    return searchCountry !== "" ? item.country.includes(searchCountry) : item;
  });

 

  const countries = filterCountry.map( (data , i )=>{
    return(
      <Card 
        key={i} 
        border="primary" 
        style={{ width: '18rem' }}>

      <Card.Img variant="top" src={data.countryInfo.flag} />
          <Card.Body>
            <Card.Title>{data.country}</Card.Title>
            <Card.Text> Cases : {data.cases} </Card.Text>
            <Card.Text> Deaths : {data.deaths} </Card.Text>
            <Card.Text> Recovered : {data.recovered} </Card.Text>
            <Card.Text> Today's Cases : {data.todayCases} </Card.Text>
            <Card.Text> Today's Deaths : {data.todayDeaths} </Card.Text>
            <Card.Text> Today's Recovered : {data.todayRecovered} </Card.Text>
          </Card.Body>
      </Card>
      
    )

  })

 var queries = [{
    columns: 2,
    query: 'min-width: 500px; margin : 10px'
  }, {
    columns: 3,
    query: 'min-width: 1000px '
  }];

  return (
    <div>
    <h1> Covid-19 live Tracker </h1>
    <CardGroup>
  <Card bg="secondary"  className="card-item">
    
    <Card.Body>
      <Card.Title>Total Cases</Card.Title>
      <Card.Text>
        {latest.cases}
      </Card.Text>
    </Card.Body>
    <Card.Footer>
      <small>Last updated {lastUpdated}</small>
    </Card.Footer>
  </Card>
  <Card bg="success" className="card-item">
    <Card.Body>
      <Card.Title>Total Recovered</Card.Title>
      <Card.Text>
        {latest.recovered}
      </Card.Text>
    </Card.Body>
    <Card.Footer>
      <small>Last updated {lastUpdated}</small>
    </Card.Footer>
  </Card>
  <Card bg="danger" className="card-item">
    <Card.Body>
      <Card.Title>Total Deaths</Card.Title>
      <Card.Text>
       {latest.deaths}
      </Card.Text>
    </Card.Body>
    <Card.Footer>
      <small>Last updated {lastUpdated}</small>
    </Card.Footer>
  </Card>
</CardGroup>

<Form className="mt-5">
  <Form.Group className="mb-3">
    <Form.Control type="search" placeholder="Search for Country..." onChange={e => setSearchCountry(e.target.value)}/>
  </Form.Group>

</Form>

<Columns queries={queries}>
        {countries}
        </Columns>


  
</div>
  );
}

export default App;
