import React from 'react'
import numeral from 'numeral'
import './Table.css'
import { v4 as uuidv4 } from 'uuid';

function Table({ countries }) {
    return (
        <div className="table">
            {countries.map(({ country, cases }) => (
                <tr key={uuidv4()}>
                    <td>{country}</td>
                    <td><strong>{numeral(cases).format('0,0')}</strong></td>
                </tr>
            ))}
        </div>
    )
}

export default Table
