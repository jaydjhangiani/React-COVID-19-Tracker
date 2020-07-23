import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { v4 as uuidv4 } from 'uuid';
import numeral from 'numeral'

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        }
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll"
                }
            }
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a")
                    }
                }
            }
        ]
    }
}

function LineGraph({ casesType = "cases", ...props }) {

    const [data, setData] = useState({});
    let clr = "rgba(204, 16, 52, 0.5)";
    let bcr = "#CC1034";

    const buildChartData = (data, casesType) => {
        const chartData = [];
        let lastDataPoint;
        for (let date in data.cases) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];

        }
        return chartData;
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
                .then((response) => response.json())
                .then(data => {
                    //clever stuff
                    const chartData = buildChartData(data, casesType);
                    setData(chartData)
                })
        }
        fetchData();
    }, [casesType])


    //console.log(casesType)
    if (casesType === 'recovered') {
        clr = "rgba(125,215,29,0.5)"
        bcr = "greenyellow"
    }
    else if (casesType === 'deaths') {
        clr = "rgba(251,68,67,0.5)"
        bcr = "pink"
    }



    return (
        <div className={props.className}>
            {data?.length > 0 && (
                <Line
                    key={uuidv4()}
                    options={options}
                    data={{
                        datasets: [
                            {
                                backgroundColor: clr,
                                data: data,
                                borderColor: bcr
                            }
                        ]
                    }}
                />
            )}

        </div>
    )
}

export default LineGraph
