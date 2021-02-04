import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data }) => {

    return (
        <Pie 
            data={{
                labels: data ? Object.keys(data) : [],
                datasets: [
                    {
                        label: 'Interest Level',
                        backgroundColor: ['#1CB7A9', '#3A4849', '#FB6160'],
                        data: data ? Object.values(data) : []
                    }
                ]
            }}
            options={{
                animation: {
                    animateScale: true
                }
            }}
        />
    )
}

export default PieChart;