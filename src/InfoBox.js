import React from 'react';
import "./InfoBox.scss";
import {Card, CardContent, Typography} from "@material-ui/core";

function InfoBox({title, cases, active, total, ...props}) {
    return (
        <Card 
            onClick={props.onClick} 
            className={`infoBox ${active && "infoBox--selected"}`}>
            <CardContent className="infoBox__container">
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>

                <h2>{cases}</h2>
                
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    );
}

export default InfoBox
