import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";


export const casesTypeColors = {
    cases: {
        hex: "rgb(218, 28, 28 )",
        fill: "rgba(218, 28, 28, 0.4)",
        multiplier: 800,
    },
    recovered: {
        hex: "rgb(51, 189, 13)",
        fill: "rgba(51, 189, 13, 0.4)",
        multiplier: 1200,
    },
    deaths: {
        hex: "rgb(102, 102, 102)",
        fill: "rgba(102, 102, 102, 0.4)",
        multiplier: 2000,
    },
};

export const sortData = (data) => {
    const sortedData = [...data];
    
    sortedData.sort((a, b) => {
        if (a.cases > b.cases){
            return -1;
        } else {
            return 1;
        }
    });
    return sortedData;
};

export const prettyPrintStat = (stat) => stat ? `+${numeral(stat).format("0,0")}` : "+0";
export const prettyPrintStatTotal = (stat) => stat ? `${numeral(stat).format("0,0")}` : "N/A";

//Draw circles on the map with interactive tooltip
export const showDataOnMap = (data, casesType='cases') => (
    
    data.map(country => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity = {0.4}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
        >
            <Popup>                
                <div className="info-container">
                    <div
                        className="info-flag"
                        style={{ backgroundImage: `url(${country.countryInfo.flag})`}}
                    />
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))
);