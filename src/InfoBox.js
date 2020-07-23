import React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import './InfoBox.css'

function InfoBox({ title, cases, isRed, active, total, ...props }) {
    return (
        <Card className={`infobox ${active && 'infobox-selected'} ${isRed && 'infobox-red'}`}
            onClick={props.onClick}>
            <CardContent>
                <Typography className="infobox_title" color="textSecondary">
                    {title}
                </Typography>

                <h2 className={`infobox_cases ${!isRed && "infobox_cases-green"}`}>{cases}</h2>

                <Typography className="infobox_total" color="textSecondary">{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
