import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core'
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table'
import { sortData, prettyPrintStat } from './utils';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 })
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountires] = useState([]);
  const [casesType, setcasesType] = useState("cases");

  //useEffect for countries
  useEffect(() => {
    //send request
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }));

          //console.log(data);
          //console.log(tableData);
          const sortedData = sortData(data);
          setCountries(countries);
          setTableData(sortedData);
          setMapCountires(data);
        });
    };
    getCountriesData();
  }, [])

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      });
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all?yesterday=true' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode)
        setCountryInfo(data)

        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4);
      })

  }

  return (
    <div className="app">

      <div className="app_left">

        <div className="app_header">
          <h1>COVID 19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem key={uuidv4()} value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox isRed active={casesType === "cases"} onClick={e => setcasesType('cases')} key="cases" title="Covid Cases" total={prettyPrintStat(countryInfo.cases)} cases={prettyPrintStat(countryInfo.todayCases)} />
          <InfoBox active={casesType === "recovered"} onClick={e => setcasesType('recovered')} key="recovered" title="Recovered" total={prettyPrintStat(countryInfo.recovered)} cases={prettyPrintStat(countryInfo.todayRecovered)} />
          <InfoBox isRed active={casesType === "deaths"} onClick={e => setcasesType('deaths')} key="death" title="Deaths" total={prettyPrintStat(countryInfo.deaths)} cases={prettyPrintStat(countryInfo.todayDeaths)} />
        </div>

        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>

      <Card className="app_right">
        <CardContent>
          <h3 className="app_cardCaseType">Worldwide new {casesType}</h3>
          <LineGraph className="app_graph" casesType={casesType} />
          <h3 className="app_cardCaseCountry">Live Cases by Country</h3>
          <Table countries={tableData} />

        </CardContent>
      </Card>

    </div>

  );
}

export default App;
