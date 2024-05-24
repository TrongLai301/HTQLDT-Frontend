import { Box, Button, ButtonGroup, Dialog, DialogContent, IconButton, Link, Typography } from "@mui/material";
import Header from "../../fragment/header/header";
import Navbar from "../../fragment/navbar/navbar";
import './trainingStats.css';
import { useEffect, useState } from "react";
// import Footer from "../../fragment/footer/footer";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TrainingStatsChart from './TrainingStatsChart ';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Avatar from '@mui/material/Avatar';
import { PaddingRounded } from "@mui/icons-material";
import axios from "axios";
import { set } from "lodash";


function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="/public">
                Quản lý đào tạo
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function TrainingStats() {
    const [trainingStats, setTrainingStats] = useState([]);
    const [growthStatistics, setGrowthStatistics] = useState();
    const [maxGrowthStatistics, setMaxGrowthStatistics] = useState();

    const [activeStat, setActiveStat] = useState("stats1");
    const [title, setTitle] = useState("Kết quả đào tạo tháng 5");
    const [titleStatistics, setTitleStatistics] = useState("Năm")
    const [active1, setActive1] = useState(true);
    const [active2, setActive2] = useState(false);
    const [active3, setActive3] = useState(false);
    const [active4, setActive4] = useState(false);
    const [active5, setActive5] = useState(false);
    const [active6, setActive6] = useState(false);
    const [active7, setActive7] = useState(true);

    const [year, setYear] = useState(2024);
    const [month, setMonth] = useState(0);
    const [quarter, setQuarter] = useState(0)
    const handleClickStat = (event) => {
        const theValue = event.currentTarget.value;
        if (theValue === "stats3") {
            axios.get("http://localhost:8080/api/stats/getGrowthStatisticsWithYear?year=2024")
                .then(res => {
                    setGrowthStatistics(res.data)
                })
        }
        setActiveStat(theValue);
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"))
        if (user != null) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + user.accessToken;
            axios.get("http://localhost:8080/api/stats/trainingStats/month?month=5&year=2024")
                .then(res => {
                    setTrainingStats(res.data)
                })
            if(year > 12){
                axios.get("http://localhost:8080/api/stats/getGrowthStatisticsWithYear?year=" + year)
                .then(res1 => {
                    setGrowthStatistics(res1.data)
                })
            }if(quarter != 0){
                axios.get("http://localhost:8080/api/stats/getGrowthStatisticsWithQuarter?quarter=" + quarter)
                    .then(res4 => {
                        setGrowthStatistics(res4.data)
                    })
            }
            if(month != 0){
                axios.get("http://localhost:8080/api/stats/getGrowthStatisticsWithMonth?month=" + month)
                    .then(res3 => {
                        setGrowthStatistics(res3.data)
                    })
            }
            
            axios.get("http://localhost:8080/api/stats/getMaxGrowthStatisticsWithYear")
                .then(res2 => {
                    setMaxGrowthStatistics(res2.data)
                })
            
        }

    }, [year, month, quarter])



    const handleClick = (event) => {
        const theValue = event.currentTarget.value;

        if (theValue == 1) {
            setTitle("Kết quả đào tạo tháng 5 năm 2024")
            setActive1(true)
            setActive2(false)
            setActive3(false)
            setActive4(false)
            axios.get("http://localhost:8080/api/stats/trainingStats/month?month=5&year=2024")
                .then(res => {
                    setTrainingStats(res.data)
                })
        }

        if (theValue == 2) {
            setTitle("Kết quả đào tạo quý 2 năm 2024")
            setActive1(false)
            setActive2(true)
            setActive3(false)
            setActive4(false)
            axios.get("http://localhost:8080/api/stats/trainingStats/quarter?quarter=2&year=2024")
                .then(res => {
                    setTrainingStats(res.data)
                })
        }

        if (theValue == 3) {
            setTitle("Kết quả đào tạo năm 2024")
            setActive1(false)
            setActive2(false)
            setActive3(true)
            setActive4(false)
            axios.get("http://localhost:8080/api/stats/trainingStats/year?year=2024")
                .then(res => {
                    setTrainingStats(res.data)
                })
        }

        if (theValue == 4) {
            setTitle("Kết quả đào tạo tất cả")
            setActive1(false)
            setActive2(false)
            setActive3(false)
            setActive4(true)


            axios.get("http://localhost:8080/api/stats/trainingStats/all")
                .then(res => {
                    setTrainingStats(res.data)
                })
        }

        if (theValue == 5) {
            setQuarter(0)
            setMonth(1)
            setTitleStatistics("Tháng")
            setYear(1)
            setActive5(true)
            setActive6(false)
            setActive7(false)
        }

        if (theValue == 6) {
            setQuarter(1)
            console.log(quarter);
            setMonth(0)
            setTitleStatistics("Quý")
            setYear(1)
            setActive5(false)
            setActive6(true)
            setActive7(false)
        }

        if (theValue == 7) {
            setTitleStatistics("Năm")
            setQuarter(0)
            setYear(2024)
            setActive5(false)
            setActive6(false)
            setActive7(true)
            axios.get("http://localhost:8080/api/stats/getGrowthStatisticsWithYear?year=2024")
            .then(res => {
                setGrowthStatistics(res.data)
            })
        }

        if (theValue == -1) {
            setYear(year - 1)
            setMonth(month -1)
            setQuarter(quarter -1)
        }

        if (theValue == -2) {
            setQuarter(quarter + 1)
            setYear(year + 1)
            setMonth(month + 1)
        }

    };

    function createData(name, quantity, growth) {
        return { name, quantity, growth };
    }

    function createSubjects(name, points, growth) {
        return { name, points, growth }
    }

    const subjects = [
        createSubjects('Linux', 7.28, 6),
        createSubjects('Git', 7.31, 9),
        createSubjects('Docker', 7.34, 10),
        createSubjects('Resful API', 7.08, 15),
        createSubjects('Lavarel', 7.08, 16),
    ]

    const rows = [
        createData('Thực tập sinh nhập học', 159, 6.0),
        createData('Thực tập sinh tốt nghiệp', 237, 9.0),
        createData('Thực tập sinh fail', 262, 16.0),
        createData('Tỷ lệ pass/fail', 305, 3.7),
        createData('Điểm tốt nghiệp trung bình', 356, 16.0),
    ];

    const maxGrowth = Math.max(...rows.map(row => row.growth));
    const maxGrowthOfSubjects = Math.max(...subjects.map(subject => subject.growth));
    // console.log('row 0:', rows[0].growth);
    // console.log('max', maxGrowth);
    // console.log((6/16));

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    return (
        <>
            <Header></Header>
            <Navbar></Navbar>
            <Box component="main" sx={{ flexGrow: 1, p: 2, marginTop: '57px', marginLeft: '64px', bgcolor: 'rgb(231, 227, 227)', height: '700px' }}>
                <Box m={2} style={{ display: 'flex' }}>
                    <svg style={{ width: 25, height: 25, color: 'rgba(0, 0, 0, 0.60)' }} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 20v-6h3v6zm6 0V9h3v11zm6 0V4h3v16z" /></svg>
                    <p style={{ marginLeft: '10px', marginBottom: '0px', fontFamily: 'sans-serif', fontWeight: '550', color: 'rgba(0, 0, 0, 0.60)' }}>Thống kê {'>'} Kết quả đào tạo</p>
                </Box>

                <div style={{ minHeight: '660px', borderRadius: '10px' }} className="content-recruiment">
                    <div style={{ width: '100%' }} className="btn-group" role="group" aria-label="Basic outlined example">
                        {activeStat === "stats1" ? (
                            <button type="button" value="stats1" onClick={handleClickStat} className="btn btn-warning active">Chỉ số</button>
                        ) :
                            <button type="button" value="stats1" onClick={handleClickStat} className="btn btn-warning">Chỉ số</button>
                        }
                        {activeStat === "stats2" ? (
                            <button type="button" value="stats2" onClick={handleClickStat} className="btn btn-warning active">Biểu đồ</button>
                        ) :
                            <button type="button" value="stats2" onClick={handleClickStat} className="btn btn-warning">Biểu đồ</button>
                        }
                        {activeStat === "stats3" ? (
                            <button type="button" value="stats3" onClick={handleClickStat} className="btn btn-warning active">Thống kê tăng trưởng</button>
                        ) :
                            <button type="button" value="stats3" onClick={handleClickStat} className="btn btn-warning">Thống kê tăng trưởng</button>
                        }
                    </div>
                    <div className="main-content">
                        {activeStat === "stats1" && (
                            <div className="content-stat-1">
                                <h3 style={{ marginLeft: '10px', fontFamily: 'sans-serif', color: 'rgba(0, 0, 0, 0.60)', marginTop: '25px', marginBottom: '25px' }}>{title}</h3>
                                <div style={{ width: '50%', marginBottom: '25px', fontSize: '18px' }} className="btn-group" role="group" aria-label="Basic outlined example">
                                    {active1 ? (
                                        <button type="button" value="1" onClick={handleClick} className="btn btn-warning active">Theo tháng</button>
                                    ) :
                                        <button type="button" value="1" onClick={handleClick} className="btn btn-warning">Theo tháng</button>
                                    }
                                    {active2 ? (
                                        <button type="button" value="2" onClick={handleClick} className="btn btn-warning active">Theo quý</button>
                                    ) :
                                        <button type="button" value="2" onClick={handleClick} className="btn btn-warning">Theo quý</button>
                                    }
                                    {active3 ? (
                                        <button type="button" value="3" onClick={handleClick} className="btn btn-warning active">Theo năm</button>
                                    ) :
                                        <button type="button" value="3" onClick={handleClick} className="btn btn-warning">Theo năm</button>
                                    }
                                    {active4 ? (
                                        <button type="button" value="4" onClick={handleClick} className="btn btn-warning active">Tất cả</button>
                                    ) :
                                        <button type="button" value="4" onClick={handleClick} className="btn btn-warning">Tất cả</button>
                                    }
                                </div>
                                <div style={{ marginLeft: '10px', marginBottom: '0px', fontSize: '16px', fontFamily: 'sans-serif', color: 'rgba(0, 0, 0, 0.60)' }}>
                                    <label>Số thực tập sinh nhập học:</label>
                                    <label style={{ marginLeft: '200px' }}>{trainingStats.internsEnrolled} TTS</label>
                                    <br></br>
                                    <br></br>
                                    <label>Số thực tập sinh tốt nghiệp:</label>
                                    <label style={{ marginLeft: '197px' }}>{trainingStats.graduatingInterns} TTS</label>
                                    <br></br>
                                    <br></br>
                                    <label>Số thực tập sinh fail:</label>
                                    <label style={{ marginLeft: '248px' }}>{trainingStats.internsFailed} TTS</label>
                                    <br></br>
                                    <br></br>
                                    <label>Tỷ lệ Pass/fail:</label>
                                    <label style={{ marginLeft: '291px' }}>{trainingStats.rate}</label>
                                    <br></br>
                                    <br></br>
                                    <label>Số thực tập sinh đang thực tập:</label>
                                    <label style={{ marginLeft: '169px' }}>{trainingStats.internsCurrentlyPracticing} TTS</label>
                                    <br></br>
                                    <br></br>
                                    <label>Số thực tập sinh nghỉ thực tập:</label>
                                    <label style={{ marginLeft: '175px' }}>{trainingStats.internsQuitInternship} TTS</label>
                                    <br></br>
                                    <br></br>
                                    <label>Điểm tốt nghiệp trung bình:</label>
                                    <label style={{ marginLeft: '203px' }}>{trainingStats.averageGraduationScore}</label>
                                </div>
                            </div>
                        )}
                        {activeStat === "stats2" && (
                            <div className="content-stat-2">
                                <h3 style={{ marginLeft: '10px', fontFamily: 'sans-serif', color: 'rgba(0, 0, 0, 0.60)', marginTop: '25px', marginBottom: '0px' }}>Biểu đồ</h3>
                                <div style={{ width: '100%', height: '60%', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                                        <Typography style={{ fontSize: '20px', paddingRight: '5px' }}>Biểu đồ đào tạo thực tập sinh trong năm</Typography>
                                        <select name="years" id="years" style={{ fontWeight: '600', fontSize: '20px' }} value={selectedYear} onChange={handleYearChange}>
                                            {[...Array(5)].map((_, index) => {
                                                const year = new Date().getFullYear() - index;
                                                return (
                                                    <option key={index} value={year}>{year}</option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <TrainingStatsChart year={selectedYear} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeStat === "stats3" && (
                            <div className="content-stat-3">
                                <h3 style={{ marginLeft: '10px', fontFamily: 'sans-serif', color: 'rgba(0, 0, 0, 0.60)', marginTop: '25px', marginBottom: '25px' }}>Thống kê tăng trưởng</h3>
                                <div style={{ width: '50%', marginBottom: '25px' }} className="btn-group" role="group" aria-label="Basic outlined example">
                                    {active5 ? (
                                        <button type="button" value="5" onClick={handleClick} className="btn btn-warning active">Theo tháng</button>
                                    ) :
                                        <button type="button" value="5" onClick={handleClick} className="btn btn-warning">Theo tháng</button>
                                    }
                                    {active6 ? (
                                        <button type="button" value="6" onClick={handleClick} className="btn btn-warning active">Theo quý</button>
                                    ) :
                                        <button type="button" value="6" onClick={handleClick} className="btn btn-warning">Theo quý</button>
                                    }
                                    {active7 ? (
                                        <button type="button" value="7" onClick={handleClick} className="btn btn-warning active">Theo năm</button>
                                    ) :
                                        <button type="button" value="7" onClick={handleClick} className="btn btn-warning">Theo năm</button>
                                    }
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                                    <TableContainer component={Paper} sx={{ width: '98%' }}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: '700', minHeight: '50px', fontSize: '16px', width: '600px' }} align="left">
                                                        Chi tiêu
                                                        <IconButton onClick={handleClick} value={-1}
                                                            aria-label="previous"
                                                            size="small"
                                                            sx={{
                                                                width: '17px',
                                                                height: '17px',
                                                                backgroundColor: '#00000099',
                                                                borderRadius: '50%',
                                                                marginLeft: 5,
                                                                marginRight: 1,
                                                                marginBottom: '3px',
                                                                '&:hover': {
                                                                    backgroundColor: 'darkgray',
                                                                },
                                                            }}
                                                        >
                                                            <ArrowBackIosNewIcon fontSize="inherit" sx={{ color: 'white', width: '15px', height: '15px' }} />
                                                        </IconButton>
                                                        <Typography sx={{ fontWeight: '700', display: 'inline', marginRight: '30px' }}>Trước</Typography>
                                                        <Typography sx={{ fontWeight: '700', display: 'inline' }}>Sau</Typography>
                                                        <IconButton onClick={handleClick} value={-2}
                                                            aria-label="previous"
                                                            size="small"
                                                            sx={{
                                                                width: '17px',
                                                                height: '17px',
                                                                backgroundColor: '#00000099',
                                                                borderRadius: '50%',
                                                                marginLeft: 1,
                                                                marginRight: 1,
                                                                marginBottom: '3px',
                                                                '&:hover': {
                                                                    backgroundColor: 'darkgray',
                                                                },
                                                            }}
                                                        >
                                                            <ArrowForwardIosIcon fontSize="inherit" sx={{ color: 'white', width: '15px', height: '15px' }} />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: '700', fontSize: '16px' }} align="center">{titleStatistics}  {year} </TableCell>
                                                    <TableCell sx={{ fontWeight: '700', fontSize: '16px' }} align="center">Tăng trưởng</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                <TableRow
                                                    key={'Thực tập sinh nhập học'}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="left" component="th" >
                                                        {"Thực tập sinh nhập học"}
                                                    </TableCell>
                                                    <TableCell align="center">{growthStatistics.internsEnrolled}</TableCell>
                                                    <TableCell align="center">
                                                        {/* {row.growth / maxGrowth} */}
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', justifyContent: 'center' }}>
                                                            <Box
                                                                sx={{
                                                                    width: 10,
                                                                    height: `${(growthStatistics.internsEnrolled / maxGrowthStatistics.internsEnrolled) * 40}px`,
                                                                    bgcolor: 'primary.main',
                                                                }}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow
                                                    key={'Thực tập sinh tốt nghiệp'}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="left" component="th" >
                                                        {"Thực tập sinh tốt nghiệp"}
                                                    </TableCell>
                                                    <TableCell align="center">{growthStatistics.graduatingInterns}</TableCell>
                                                    <TableCell align="center">
                                                        {/* {row.growth / maxGrowth} */}
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', justifyContent: 'center' }}>
                                                            <Box
                                                                sx={{
                                                                    width: 10,
                                                                    height: `${(growthStatistics.graduatingInterns / maxGrowthStatistics.graduatingInterns) * 40}px`,
                                                                    bgcolor: 'primary.main',
                                                                }}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow
                                                    key={'Thực tập sinh fail'}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="left" component="th" >
                                                        {"Thực tập sinh fail"}
                                                    </TableCell>
                                                    <TableCell align="center">{growthStatistics.internsFailed}</TableCell>
                                                    <TableCell align="center">
                                                        {/* {row.growth / maxGrowth} */}
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', justifyContent: 'center' }}>
                                                            <Box
                                                                sx={{
                                                                    width: 10,
                                                                    height: `${(growthStatistics.internsFailed / maxGrowthStatistics.internsFailed) * 40}px`,
                                                                    bgcolor: 'primary.main',
                                                                }}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow
                                                    key={'Tỷ lệ Pass/Fail'}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="left" component="th" >
                                                        {"Tỷ lệ Pass/Fail"}
                                                    </TableCell>
                                                    <TableCell align="center">{growthStatistics.rate}</TableCell>
                                                    <TableCell align="center">
                                                        {/* {row.growth / maxGrowth} */}
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', justifyContent: 'center' }}>
                                                            <Box
                                                                sx={{
                                                                    width: 10,
                                                                    height: `${(growthStatistics.rate / maxGrowthStatistics.rate) * 40}px`,
                                                                    bgcolor: 'primary.main',
                                                                }}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow
                                                    key={'Điểm tốt nghiệp trung bình'}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="left" component="th" >
                                                        {"Điểm tốt nghiệp trung bình"}
                                                    </TableCell>
                                                    <TableCell align="center">{growthStatistics.averageGraduationScore}</TableCell>
                                                    <TableCell align="center">
                                                        {/* {row.growth / maxGrowth} */}
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', justifyContent: 'center' }}>
                                                            <Box
                                                                sx={{
                                                                    width: 10,
                                                                    height: `${(growthStatistics.averageGraduationScore / maxGrowthStatistics.averageGraduationScore) * 40}px`,
                                                                    bgcolor: 'primary.main',
                                                                }}
                                                            />
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="left" component="th" scope="row">
                                                        Điểm trung bình môn
                                                    </TableCell>
                                                    <TableCell align="center"></TableCell>
                                                    <TableCell align="center"></TableCell>
                                                </TableRow>
                                            </TableBody>
                                            <TableBody>
                                                {growthStatistics.averageOfSubject.map((item, index) => (
                                                    <TableRow
                                                        key={item.subjectName}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell sx={{ fontWeight: '700' }} align="center" component="th" scope="row">
                                                            {item.subjectName}
                                                        </TableCell>
                                                        <TableCell align="center">{item.average}</TableCell>
                                                        <TableCell align="center">
                                                            {/* {subject.growth} */}
                                                            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', justifyContent: 'center' }}>
                                                                <Box
                                                                    sx={{
                                                                        width: 10,
                                                                        height: `${(item.average / maxGrowthStatistics.averageOfSubject[index].average) * 40}px`,
                                                                        bgcolor: 'primary.main',
                                                                    }}
                                                                />
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ paddingTop: '28px', paddingBottom: '10px', width: '100%', height: '30px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <Copyright sx={{ maxWidth: '100%' }} />
                </div>
                {/* <Footer /> */}
            </Box>
        </>
    )
}