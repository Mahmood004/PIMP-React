import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';

const HorizontalBarStackedChart = ({ data }) => {

    const _fun = data => {

        const result = [];

        if (data) {
            
            const keys = Object.keys(data);
            for (let key in keys) {

                const { sub_categories } = data[keys[key]];

                for (let y in sub_categories) {

                    const obj = {};
                    const color = '#' + Math.floor(Math.random() * 16777215).toString(16);

                    obj.label = y;
                    obj.data = new Array(+key + 1).join('0').split('').map(parseFloat);
                    obj.data.push(sub_categories[y]); 
                    obj.backgroundColor = new Array(+key + 1).fill(color);
                    
                    result.push(obj);
                }
            }
        }
        return result;
    }

    return (
        <HorizontalBar 
            data={
                {
                    labels: data ? Object.keys(data) : [],
                    datasets: _fun(data)
                }   
            }
            options={{
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }}
            
        />
    )
}

export default React.memo(HorizontalBarStackedChart);