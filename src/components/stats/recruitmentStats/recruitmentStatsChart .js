import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Box } from "@mui/material";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function RecruitmentStatsChart({ year }) {
    const [trainingCharts, setTrainingCharts] = useState(new Array(12).fill({
        newCVs: 0,
        interviewedCVs: 0,
        noShowCandidates: 0,
        passCandidates: 0,
        failCandidates: 0,
        hiredCandidates: 0,
        totalInterviews: 0,
    }));
    const [hiddenDatasets, setHiddenDatasets] = useState([]);
    console.log(year);
    console.log(trainingCharts);

    useEffect(() => {
        const fetchData = async () => {
            const user = JSON.parse(localStorage.getItem("currentUser"))
            if (user != null) {
                axios.defaults.headers.common["Authorization"] = "Bearer " + user.accessToken;
                try {
                    const response = await axios.get(`http://localhost:8080/api/stats/trainingCharts/year?year=${year}`);
                    setTrainingCharts(response.data);
                    console.log(response.data);
                    console.log(trainingCharts);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, [year]);

    const data = {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        datasets: [
            {
                label: 'Số CV mới',
                data: trainingCharts.map(item => item.newCVs),
                borderColor: 'blue',
                backgroundColor: 'blue',
                fill: false,
                tension: 0,
            },
            {
                label: 'Số CV phỏng vấn',
                data: trainingCharts.map(item => item.interviewedCVs),
                borderColor: 'green',
                backgroundColor: 'green',
                fill: false,
                tension: 0,
            },
            {
                label: 'Ứng viên không đến phỏng vấn',
                data: trainingCharts.map(item => item.noShowCandidates),
                borderColor: 'black',
                backgroundColor: 'black',
                fill: false,
                tension: 0,
            },
            {
                label: 'Ứng viên pass',
                data: trainingCharts.map(item => item.passCandidates),
                borderColor: 'orange',
                backgroundColor: 'orange',
                fill: false,
                tension: 0,
            },
            {
                label: 'Ứng viên fail',
                data: trainingCharts.map(item => item.failCandidates),
                borderColor: 'red',
                backgroundColor: 'red',
                fill: false,
                tension: 0,
            },
            {
                label: 'Ứng viên nhận việc',
                data: trainingCharts.map(item => item.hiredCandidates),
                borderColor: 'purple',
                backgroundColor: 'purple',
                fill: false,
                tension: 0,
            },
            {
                label: 'Ứng viên đã phỏng vấn',
                data: trainingCharts.map(item => item.totalInterviews),
                borderColor: 'brown',
                backgroundColor: 'brown',
                fill: false,
                tension: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'line',
                    font: {
                        size: 20,
                        weight: 700
                    },
                    onClick: (e, legendItem, legend) => {
                        const index = legendItem.datasetIndex;
                        const chart = legend.chart;
                        const meta = chart.getDatasetMeta(index);
                        meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;
                        setHiddenDatasets(chart.data.datasets.filter(dataset => meta.hidden === true).map(dataset => dataset.label));
                        chart.update();
                    }
                },
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                bodyFont: {
                    size: 20,
                },
                titleFont: {
                    size: 20,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Số lượng',
                    font: {
                        size: 20,
                    },
                },
                ticks: {
                    font: {
                        size: 20,
                    },
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Tháng',
                    font: {
                        size: 20,
                    },
                },
                ticks: {
                    font: {
                        size: 20,
                    },
                },
            },
        },
    };

    return (
        <Box sx={{ width: '80%', height: '490px', padding: 2 }}>
            <div style={{ width: '100%', height: '100%' }}>
                <Line data={data} options={options} />
            </div>
            <div>
                {hiddenDatasets.join(', ')}
            </div>
        </Box>
    );
}