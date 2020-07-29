import React from 'react';
import numeral from 'numeral';
import "./Table.scss";

function Table({countries}) {
    return (
        
        <div className="table">            
            {countries.map(({country, cases}) => (
                <tr>
                    <td>{country}</td>
                    <td>
                        <strong>{numeral(cases).format("0.0a")}</strong>
                    </td>              
                </tr>
            ))}   
                    
        </div>
    );
}

export default Table;
