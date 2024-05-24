import { Box, Button, ButtonGroup, Dialog, DialogContent, IconButton, Link, Typography } from "@mui/material";
import Header from "../../fragment/header/header";
import Navbar from "../../fragment/navbar/navbar";
import { useEffect, useState } from "react";
// import Footer from "../../fragment/footer/footer";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RecruitmentStatsChart from './recruitmentStatsChart ';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import axios from "axios";
import CVChart from "./recruitmentStatsColumnChart";


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

export default function RecruitmentStats() {
    const [trainingStats, setTrainingStats] = useState([]);

    // const []

    const [activeStat, setActiveStat] = useState("stats1");
    const [title, setTitle] = useState("Kết quả đào tạo tháng 5");
    const [active1, setActive1] = useState(true);
    const [active2, setActive2] = useState(false);
    const [active3, setActive3] = useState(false);
    const [active4, setActive4] = useState(false);

    const handleClickStat = (event) => {
        const theValue = event.currentTarget.value;

        setActiveStat(theValue);
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("currentUser"))
        console.log("handled")
        if (user != null) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + user.accessToken;
            axios.get("http://localhost:8080/api/stats/trainingStats/month?month=5&year=2024")
                .then(res => {
                    setTrainingStats(res.data)
                })
        }

    }, [])

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
                    <p style={{ marginLeft: '10px', marginBottom: '0px', fontFamily: 'sans-serif', fontWeight: '550', color: 'rgba(0, 0, 0, 0.60)' }}>Thống kê {'>'} Kết quả tuyển dụng</p>
                </Box>

                <div style={{ minHeight: '660px', borderRadius: '10px' }} className="content-recruiment">
                    <div style={{ width: '100%' }} className="btn-group" role="group" aria-label="Basic outlined example">
                        {activeStat === "stats1" ? (
                            <button type="button" value="stats1" onClick={handleClickStat} className="btn btn-outline-warning active">Chỉ số</button>
                        ) :
                            <button type="button" value="stats1" onClick={handleClickStat} className="btn btn-outline-warning">Chỉ số</button>
                        }
                        {activeStat === "stats2" ? (
                            <button type="button" value="stats2" onClick={handleClickStat} className="btn btn-outline-warning active">Biểu đồ</button>
                        ) :
                            <button type="button" value="stats2" onClick={handleClickStat} className="btn btn-outline-warning">Biểu đồ</button>
                        }
                        {activeStat === "stats3" ? (
                            <button type="button" value="stats3" onClick={handleClickStat} className="btn btn-outline-warning active">Thống kê tăng trưởng</button>
                        ) :
                            <button type="button" value="stats3" onClick={handleClickStat} className="btn btn-outline-warning">Thống kê tăng trưởng</button>
                        }
                    </div>
                    <div className="main-content">
                        {activeStat === "stats1" && (
                            <div className="content-stat-1">
                                <h4 style={{ marginLeft: '10px', fontFamily: 'sans-serif', fontWeight: '550', color: 'rgba(0, 0, 0, 0.60)', marginTop: '25px', marginBottom: '25px' }}>{title}</h4>
                                <div style={{ width: '50%', marginBottom: '25px' }} className="btn-group" role="group" aria-label="Basic outlined example">
                                    {active1 ? (
                                        <button type="button" value="1" onClick={handleClick} className="btn btn-outline-warning active">Theo tháng</button>
                                    ) :
                                        <button type="button" value="1" onClick={handleClick} className="btn btn-outline-warning">Theo tháng</button>
                                    }
                                    {active2 ? (
                                        <button type="button" value="2" onClick={handleClick} className="btn btn-outline-warning active">Theo quý</button>
                                    ) :
                                        <button type="button" value="2" onClick={handleClick} className="btn btn-outline-warning">Theo quý</button>
                                    }
                                    {active3 ? (
                                        <button type="button" value="3" onClick={handleClick} className="btn btn-outline-warning active">Theo năm</button>
                                    ) :
                                        <button type="button" value="3" onClick={handleClick} className="btn btn-outline-warning">Theo năm</button>
                                    }
                                    {active4 ? (
                                        <button type="button" value="4" onClick={handleClick} className="btn btn-outline-warning active">Tất cả</button>
                                    ) :
                                        <button type="button" value="4" onClick={handleClick} className="btn btn-outline-warning">Tất cả</button>
                                    }
                                </div>
                                <div style={{ marginLeft: '10px', marginBottom: '0px', fontSize: '20px', fontFamily: 'sans-serif', fontWeight: '550', color: 'rgba(0, 0, 0, 0.60)' }}>
                                    <label>Số CV mới:</label>
                                    <label style={{ marginLeft: '260px' }}>{trainingStats.internsEnrolled} </label>
                                    <br></br>
                                    <br></br>
                                    <label>Số CV phỏng vấn:</label>
                                    <label style={{ marginLeft: '195px' }}>{trainingStats.graduatingInterns} </label>
                                    <br></br>
                                    <br></br>
                                    <label>Số ứng viên đã phỏng vấn:</label>
                                    <label style={{ marginLeft: '108px' }}>{trainingStats.internsFailed} </label>
                                    <br></br>
                                    <br></br>
                                    <label>Số ứng viên không đến phỏng vấn:</label>
                                    <label style={{ marginLeft: '29px' }}>{trainingStats.rate}</label>
                                    <br></br>
                                    <br></br>
                                    <label>Số PASS:</label>
                                    <label style={{ marginLeft: '276px' }}>{trainingStats.internsCurrentlyPracticing}</label>
                                    <br></br>
                                    <br></br>
                                    <label>Số FAIL:</label>
                                    <label style={{ marginLeft: '287px' }}>{trainingStats.internsQuitInternship}</label>
                                    <br></br>
                                    <br></br>
                                    <label>Số ứng viên nhận việc:</label>
                                    <label style={{ marginLeft: '145px' }}>{trainingStats.averageGraduationScore}</label>
                                    <br></br>
                                    <br></br>
                                    <label>Số ứng viên không nhận việc:</label>
                                    <label style={{ marginLeft: '79px' }}>{trainingStats.averageGraduationScore}</label>
                                    <br></br>
                                    <br></br>
                                    <label>Số ứng viên chưa nhận việc:</label>
                                    <label style={{ marginLeft: '89px' }}>{trainingStats.averageGraduationScore}</label>
                                </div>
                            </div>
                        )}
                        {activeStat === "stats2" && (
                            <div className="content-stat-2">
                                {/* line */}
                                <h4 style={{ marginLeft: '10px', fontFamily: 'sans-serif', fontWeight: '550', color: 'rgba(0, 0, 0, 0.60)', marginTop: '25px', marginBottom: '0px' }}>Biểu đồ</h4>
                                <div style={{ width: '100%', height: '60%', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                                        <Typography style={{ fontSize: '20px', paddingRight: '5px' }}>Biểu đồ tuyển dụng thực tập sinh trong năm</Typography>
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
                                        <RecruitmentStatsChart year={selectedYear} />
                                    </div>
                                </div>

                                {/* column */}
                                <h4 style={{ marginLeft: '10px', fontFamily: 'sans-serif', fontWeight: '550', color: 'rgba(0, 0, 0, 0.60)', marginTop: '35px', marginBottom: '30px' }}>Biểu đồ cột số lượng CV đã xử lý</h4>
                                <div style={{ width: '100%', height: '490px', display: 'flex', justifyContent: 'center' }}>
                                    <CVChart />
                                </div>
                            </div>
                        )}
                        {activeStat === "stats3" && (
                            <div className="content-stat-3">
                                <h4 style={{ marginLeft: '10px', fontFamily: 'sans-serif', fontWeight: '550', color: 'rgba(0, 0, 0, 0.60)', marginTop: '25px', marginBottom: '25px' }}>Thống kê tăng trưởng</h4>
                                <div style={{ width: '50%', marginBottom: '25px' }} className="btn-group" role="group" aria-label="Basic outlined example">
                                    {active1 ? (
                                        <button type="button" value="1" onClick={handleClick} className="btn btn-outline-warning active">Theo tháng</button>
                                    ) :
                                        <button type="button" value="1" onClick={handleClick} className="btn btn-outline-warning">Theo tháng</button>
                                    }
                                    {active2 ? (
                                        <button type="button" value="2" onClick={handleClick} className="btn btn-outline-warning active">Theo quý</button>
                                    ) :
                                        <button type="button" value="2" onClick={handleClick} className="btn btn-outline-warning">Theo quý</button>
                                    }
                                    {active3 ? (
                                        <button type="button" value="3" onClick={handleClick} className="btn btn-outline-warning active">Theo năm</button>
                                    ) :
                                        <button type="button" value="3" onClick={handleClick} className="btn btn-outline-warning">Theo năm</button>
                                    }
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                                    <TableContainer component={Paper} sx={{ width: '98%' }}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: '700', minHeight: '50px', fontSize: '16px', width: '600px' }} align="left">
                                                        Chi tiêu
                                                        <IconButton
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
                                                        <IconButton
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
                                                    <TableCell sx={{ fontWeight: '700', fontSize: '16px' }} align="center">Năm 2021</TableCell>
                                                    <TableCell sx={{ fontWeight: '700', fontSize: '16px' }} align="center">Tăng trưởng</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows.map((row) => (
                                                    <TableRow
                                                        key={row.name}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell align="left" component="th" scope="row">
                                                            {row.name}
                                                        </TableCell>
                                                        <TableCell align="center">{row.quantity}</TableCell>
                                                        <TableCell align="center">
                                                            {/* {row.growth / maxGrowth} */}
                                                            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', justifyContent: 'center' }}>
                                                                <Box
                                                                    sx={{
                                                                        width: 10,
                                                                        height: `${(row.growth / maxGrowth) * 40}px`,
                                                                        bgcolor: 'primary.main',
                                                                    }}
                                                                />
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
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
                                                {subjects.map((subject) => (
                                                    <TableRow
                                                        key={subject.name}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell sx={{ fontWeight: '700' }} align="center" component="th" scope="row">
                                                            {subject.name}
                                                        </TableCell>
                                                        <TableCell align="center">{subject.points}</TableCell>
                                                        <TableCell align="center">
                                                            {/* {subject.growth} */}
                                                            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '100%', justifyContent: 'center' }}>
                                                                <Box
                                                                    sx={{
                                                                        width: 10,
                                                                        height: `${(subject.growth / maxGrowthOfSubjects) * 40}px`,
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