import React, {useState, useEffect} from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat, prettyPrintStatTotal } from "./util";
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import './App.scss';
import dark from './svgs/dark.svg';
import light from './svgs/light.svg';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -10.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [darkMode, setDarkMode] = useState(getInitialMode());

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then(response => response.json())
      .then(data => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          // console.log(sortedData);
          // console.log(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = (countryCode === "worldwide") ?
     "https://disease.sh/v3/covid-19/all" : 
     `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    // console.log(url);

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);
      if(countryCode !== "worldwide"){        
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        console.log(mapCenter);
        setMapZoom(4);
      }
      else{
        console.log(mapCenter);
        setMapCenter({lat: 34.80746, lng: -10.4796});
        setMapZoom(3);
      }
    });   

  };

  const theme = darkMode ? dark : light;
  useEffect(() => {
    localStorage.setItem('dark', JSON.stringify(darkMode));
  }, [darkMode])

  
  function getInitialMode() {
    const isReturningUser = "dark" in localStorage;
    const savedMode = JSON.parse(localStorage.getItem('dark'));
    const userPrefersDark = getPrefColorScheme();
    
    if (isReturningUser) {
      return savedMode;
    } else if(userPrefersDark){
      return true;
    } else{
      return false;
    }

  } 

  function getPrefColorScheme() {
    if (!window.matchMedia) return;

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

   return (
     <div className={`body ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="app">
        <div className ="app__left">
          <div className="app__header">
            <h1>COVID-19 TRACKER</h1>
            <FormControl className="app__dropdown">
                <img src={theme} alt="theme" onClick={() => setDarkMode(!darkMode)}/>
              <Select className="app__select" variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
                {countries.map((country) => (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <div className="app__stats">

            <InfoBox 
            active={casesType === "cases"}
            onClick={(e)=> setCasesType('cases')}
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStatTotal(countryInfo.cases)}/>

            <InfoBox 
            active={casesType === "recovered"}
            onClick={(e) => setCasesType('recovered')}
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStatTotal(countryInfo.recovered)}/>

            <InfoBox 
            isRed
            active={casesType === "deaths"}
            onClick={(e)=> setCasesType('deaths')}
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStatTotal(countryInfo.deaths)}/>

          </div>
          <Map 
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>

        <Card className="app__right">
          <CardContent>
            <h3>Live cases by Country</h3>
            <Table countries={tableData}/>

            <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
            <LineGraph className="app__graph" casesType={casesType}/>
          </CardContent>
        </Card>      
      </div>
      <div className="footer">
        <h1>RUIN</h1>
      </div>
    </div>
  );
}

export default App;
