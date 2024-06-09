import {
    Box,
    Dialog,
    DialogContent,
    IconButton,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Link,
    ModalRoot,
    Tooltip
} from "@mui/material";
import Footer from "../fragment/footer/footer";
import Header from "../fragment/header/header";
import Navbar from "../fragment/navbar/navbar";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css"
import ClearIcon from '@mui/icons-material/Clear';
import imagePractice from '../../assets/image/logoCodeGym.png'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from '@iconify/react';
// import {faEnvelop} from ''
import './training.css';
import axios from "axios";
import { MarkInternModal } from "../pages/InternPage/markInternModal";
import { text } from "@fortawesome/fontawesome-svg-core";
import { format } from 'date-fns';
import { South } from "@mui/icons-material";

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

export default function Training() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const planName = queryParams.get('planName') || '';

    const [open, setOpen] = useState(false);

    const handleClickPracticeOpen = () => {
        setOpen(true);
    }
    const handleClickPracticeClose = () => {
        setOpen(false);
    }

    const [status, setStatus] = useState('');
    const [listSubjectSelect, setListSubjectSelect] = useState([]);
    const [listInter, setListIntern] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTrainingState, setSelectedTrainingState] = useState('');
    const [listRecruitmentPlan, setListRecruitmentPlan] = useState([]);
    const [selectedRecruitmentPlan, setSelectedRecruitmentPlan] = useState(planName);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalElements: 0,
    });
    let update = () => {
        fetchListSubjectSelect();
        fetchListRecruitmentPlan();
        fetchListInternSelect(pagination);
    }
    useEffect(() => {
        fetchListSubjectSelect();
        fetchListRecruitmentPlan();
        fetchListInternSelect(pagination);
    }, [selectedTrainingState, selectedRecruitmentPlan]);


    // Dữ liệu 
    const listTestSelect = [
        { id: 1, text: "Đang thực tập", name: "training" },
        { id: 2, text: "Đã hoàn thành", name: "trained" },
        { id: 3, text: "Đã dừng thực tập", name: "stop_training" }
    ]

    const handleChangeSearch = (event) => {
        setSearchTerm(event.target.value);
        if (selectedTrainingState != "") {
            setPagination.page = 0;
        }
    };

    const handleTrainingStateChange = (event) => {
        setSelectedTrainingState(event.target.value);
        pagination.page = 0;
        fetchListInternSelect(pagination);
    };

    const handleRecruitmentPlan = (event) => {
        setSelectedRecruitmentPlan(event.target.value);
        pagination.page = 0;
        fetchListInternSelect(pagination);
    };

    const handlePageChange = (event, value) => {
        setPagination(prev => {
            const newPagination = { ...prev, page: value - 1 };
            fetchListInternSelect(newPagination);
            return newPagination;
        })
    };


    //API danh sách môn học
    const fetchListSubjectSelect = async () => {
        const user = JSON.parse(localStorage.getItem("currentUser"))
        console.log("handled")
        if (user != null) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + user.accessToken;
            axios.get("http://localhost:8080/api/interns/subject").then((res) => {
                setListSubjectSelect(res.data);
            });
        }
    };

    //API danh sách thực tập sinh
    const fetchListInternSelect = async (newPagination = pagination) => {
        const user = JSON.parse(localStorage.getItem("currentUser"))
        if (user != null) {
            try {
                console.log("ID: " + selectedRecruitmentPlan);
                axios.defaults.headers.common["Authorization"] = "Bearer " + user.accessToken;
                axios.get(`http://localhost:8080/api/interns/searchValue?page=${newPagination.page}&size=${newPagination.size}&keyword=${searchTerm}&trainingState=${selectedTrainingState}&recruitmentPlan=${selectedRecruitmentPlan}`).then((res) => {
                    setListIntern(res.data.content);
                    console.log(res.data.content);
                    setPagination({
                        ...newPagination,
                        totalElements: res.data.totalElements,
                    });
                    setSelectedRecruitmentPlan(planName);
                });
            } catch (error) {
                console.log(error);
            }
        }
    };

    //API danh sách kế hoạch
    const fetchListRecruitmentPlan = async () => {
        const user = JSON.parse(localStorage.getItem("currentUser"))
        if (user != null) {
            try {
                axios.defaults.headers.common["Authorization"] = "Bearer " + user.accessToken;
                axios.get("http://localhost:8080/api/interns/recruitment_plan").then((res) => {
                    setListRecruitmentPlan(res.data);
                    
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
   
    return (
        <>
            <Header />
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 2, marginTop: '57px', marginLeft: '64px', bgcolor: 'rgb(231, 227, 227)' }}>
                <Box m={2} style={{ display: 'flex', marginBottom: '8px', marginTop: '14px' }}>
                    <Icon style={{ width: 23, height: 23, color: 'rgba(0, 0, 0, 0.60)' }} icon="ion:book-sharp" />
                    <p style={{ marginLeft: '10px', marginBottom: '0px', fontFamily: 'sans-serif', fontWeight: '550', color: 'rgba(0, 0, 0, 0.60)' }}>Đào tạo</p>
                </Box>
                <div style={{ marginTop: '-9px' }} className=" d-flex align-items-centent justify-content-between pl-15">
                    <p className="title text-center mb-0">
                        Quản lý đào tạo
                    </p>
                </div>
                <Dialog
                    open={open}
                    onClose={handleClickPracticeClose}
                >
                    <DialogContent sx={{
                        p: 0,
                        position: 'relative'
                    }}>
                        <IconButton
                            sx={{
                                position: 'absolute',
                                right: 0,
                                top: 0
                            }}
                            onClick={handleClickPracticeClose}
                        >
                            <ClearIcon />
                        </IconButton>
                        <img src={imagePractice} alt="image" style={{ width: '100%' }} />
                    </DialogContent>
                </Dialog>
                <div className=" mt-3">
                    <div className="d-flex justify-content-between">
                        <div style={{ marginTop: '-14px' }} className="d-flex pl-15">
                            <div className="search-input position-relative ">
                                <input
                                    type="text"
                                    className="w-px position-relative input-intern"
                                    placeholder="Tìm kiếm theo tên..."
                                    value={searchTerm}
                                    onChange={handleChangeSearch}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            fetchListInternSelect(); // Gọi hàm ngay lập tức
                                        }
                                    }}
                                />
                                <svg className="search-icon position-absolute" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="rgb(131 125 125 / 87%)" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" /></svg>
                            </div>
                            {/* Select status training */}
                            <FormControl className="select-form ml-10 status" sx={{ minWidth: '300px' }}>
                                <InputLabel className="top-left" id="demo-simple-small-label">Trạng thái thực tập...</InputLabel>
                                <Select
                                    sx={{
                                        // height: '30px',
                                        // paddingTop: '0px',
                                        // paddingBottom: '0px',
                                        backgroundColor: 'white'
                                    }}
                                    labelId="demo-simple-small-label"
                                    className="select-edit "
                                    id="demo-simple-select"
                                    label="Trạng thái thực tập..."
                                    value={selectedTrainingState}
                                    onChange={handleTrainingStateChange}
                                >

                                    <MenuItem value={""} >Tất cả</MenuItem>
                                    {listTestSelect.map(item => (
                                        <MenuItem value={item.name} key={item.id}>{item.text}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {/* Select recruitment plan */}
                            <FormControl className="select-form ml-10 status" sx={{ minWidth: 300 }}>
                                <InputLabel className="top-left" id="demo-simple-small-label">Kế hoạch tuyển dụng</InputLabel>
                                <Select 
                                    sx={{ backgroundColor: 'white'}}
                                    labelId="demo-simple-small-label"
                                    className="select-edit "
                                    id="demo-simple-select"
                                    label="Kế hoạch tuyển dụng..."
                                    value={selectedRecruitmentPlan}
                                    onChange={handleRecruitmentPlan}
                                // onClick={handleFilterRole}
                                >
                                    <MenuItem value={""} >Tất cả</MenuItem>
                                    {listRecruitmentPlan.map(item => (
                                        <MenuItem value={item.name} key={item.id}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <div className="content-recruiment position-relative" style={{ borderRadius: '10px', minHeight: '650px', width: '99.7%', minWidth: '1745px' }}>
                    <div className="table-container">
                        <table className="table_training" style={{}}>
                            <div className="no-scrolling">
                                <tr style={{ alignItems: 'center' }} className="header-tr grey-text ">
                                    <th className="training-id position-relative" style={{ padding: '8px' }}><p className=" position-p w-84">STT</p></th>
                                    <th className="training-name position-relative" style={{ padding: '8px' }}><p className=" position-p w-124">Tên</p></th>
                                    <th style={{ width: '200px' }} className="position-relative"><p className="mt-short-th position-p w-184">Bắt đầu</p></th>

                                    <th className="training-total-days">Số ngày thực tập</th>
                                </tr>
                                {listInter.map((item, index) => (
                                    <tr className="grey-text count-tr" key={item.id}>
                                        <td className="training-id" style={{ padding: '8px' }}>{index + 1 + pagination.page * pagination.size}</td>
                                        <td><span className="training-name">{item.internName}</span></td>
                                        <td>{format(new Date(item.startDate), 'dd-MM-yyyy')}</td>
                                        <td>{item.numberDate}</td>
                                    </tr>
                                ))}
                            </div>
                            <div className="wrapper">
                                <tr style={{ alignItems: 'center', fontSize: '25px' }} className="grey-text">

                                    {listSubjectSelect.map(item => (
                                        <th value={item.name} key={item.id} className="position-relative"><p className="position-p w-124">{item.name}</p></th>
                                    ))}
                                </tr>
                                {listInter.map((item) => (
                                    <tr className="grey-text count-tr" key={item.id}>
                                        {item.internSubjectDTOList.map((score) => (
                                            <td key={score.id}>{score.totalScore}</td>
                                        ))}
                                    </tr>
                                ))}
                            </div>
                            <div className="no-scrolling">
                                <tr style={{ alignItems: 'center' }} className="header-tr grey-text">
                                    <th className="position-relative"><p className="position-p w-124">Tổng kết</p></th>

                                    <th className="team-score">Đánh giá trên team</th>
                                    <th className="position-relative"><p className="position-p w-124">Kết quả</p></th>
                                    <th className=" text-center position-relative"><p className="position-p w-124">Hành động</p></th>
                                </tr>
                                {listInter.map(item => (
                                    <tr className="grey-text count-tr" key={item.id}>
                                        <td>{item.finalScore}</td>
                                        <td className="team-score">
                                            {item.scoreInTeam == "" || item.scoreInTeam == null ? "NA" : item.scoreInTeam}

                                        </td>
                                        <td>{item.pass === null ? "NA" : (item.pass ?
                                            <span style={{ color: "green" }}>Pass</span> :
                                            <span style={{ color: "red" }}>Fail</span>)}</td>
                                        <td style={{ cursor: 'pointer' }}>
                                            <MarkInternModal updateFunction={update} userID={item.id} />
                                        </td>
                                    </tr>
                                ))}
                            </div>
                        </table>
                    </div>
                    <div className="position-absolute w-100" style={{ bottom: '12px' }}>
                        <Pagination
                            className="d-flex justify-content-center "
                            count={Math.ceil(pagination.totalElements / pagination.size)}
                            page={pagination.page + 1}
                            onChange={handlePageChange}
                        />
                    </div>


                    {/* <div className=" bottom-0 position-absolute w-100 left-0" style={{ marginBottom: '20px' }}>
                        <Pagination className="d-flex justify-content-center" />
                    </div> */}

                </div>
                <div style={{ paddingTop: '30px', paddingBottom: '10px', width: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <Copyright sx={{ maxWidth: '100%' }} />
                </div>
            </Box>
            {/* <Footer /> */}
        </>
    )
}