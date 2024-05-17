import { Box, Dialog, DialogContent, IconButton, FormControl, InputLabel, MenuItem, Select, Typography, Link } from "@mui/material";
import Footer from "../fragment/footer/footer";
import Header from "../fragment/header/header";
import Navbar from "../fragment/navbar/navbar";
import "../../assets/css/cssRecruitment/recruitment.css";
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

export default function Training() {
    const location = useLocation();

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
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
        totalElements: 0,
    });

    useEffect(() => {
        fetchListSubjectSelect();
        fetchListInternSelect(pagination);
    }, [selectedTrainingState]);

    // Dữ liệu 
    const listTestSelect = [
        { id: 1, text: "Đang thực tập" },
        { id: 2, text: "Đã hoàn tất" },
        { id: 3, text: "Đã dừng thực tập"}
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

    const handlePageChange = (event, value) => {
        setPagination(prev => {
            const newPagination = { ...prev, page: value - 1 };
            fetchListInternSelect(newPagination);
            return newPagination;
        });

    };


    //API danh sách môn học
    const fetchListSubjectSelect = async () => {
        const user = JSON.parse(localStorage.getItem("currentUser"))
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
            axios.defaults.headers.common["Authorization"] = "Bearer " + user.accessToken;
            axios.get(`http://localhost:8080/api/interns/search?page=${newPagination.page}&size=${newPagination.size}&keyword=${searchTerm}&trainingState=${selectedTrainingState}`).then((res) => {
                setListIntern(res.data.content);
                setPagination({
                    ...newPagination,
                    totalElements: res.data.totalElements,
                });
            });
        } catch (error) {
            console.log(error);
        }
        }
    };

    

    return (
        <>
            <Header />
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 2, marginTop: '57px', marginLeft: '64px', bgcolor: 'rgb(231, 227, 227)' }}>
                <Box m={2} style={{ display: 'flex' }}>
                    <Icon style={{ width: 23, height: 23, color: 'rgba(0, 0, 0, 0.60)' }} icon="ion:book-sharp" />
                    <p style={{ marginLeft: '10px', marginBottom: '0px', fontFamily: 'sans-serif', fontWeight: '550', color: 'rgba(0, 0, 0, 0.60)' }}>Đào tạo</p>
                </Box>
                <div className=" d-flex align-items-centent justify-content-between pl-15">
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
                        <div className="d-flex pl-15">
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
                            <FormControl className="h-px" sx={{ minWidth: '300px' }}>
                                <InputLabel className="top-left" id="demo-simple-small-label">Trạng thái thực tập...</InputLabel>
                                <Select
                                    sx={{
                                        height: '30px',
                                        paddingTop: '0px', 
                                        paddingBottom: '0px', 
                                        backgroundColor: 'white'
                                    }}
                                    labelId="demo-simple-small-label"
                                    className="h-px"
                                    id="demo-simple-select"
                                    label="Status"
                                    value={selectedTrainingState}
                                    onChange={handleTrainingStateChange}
                                >
                                
                                    <MenuItem value={""} >Tất cả</MenuItem>
                                    {listTestSelect.map(item => (
                                        <MenuItem value={item.text} key={item.id}>{item.text}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <div className="content-recruiment" style={{borderRadius: '10px'}}>
                    <div className="table-container">
                        <table className="table_training" style={{ display: 'flex' }}>
                            <div className="no-scrolling">
                                <tr className="header-tr grey-text">
                                    <th className="training-id">STT</th>
                                    <th>Tên</th>
                                    <th>Bắt đầu</th>
                                    <th>Số ngày thực tập</th>
                                </tr>
                                {listInter.map((item, index) => (
                                    <tr className="grey-text count-tr" key={item.id}>
                                        <td className="training-id">{index + 1}</td>
                                        <td>{item.userName}</td>
                                        <td>{item.startDate}</td>
                                        <td>{item.numberDate}</td>
                                    </tr>
                                ))}
                            </div>
                            <div className="wrapper">
                                <tr className="header-tr grey-text">
                                    {listSubjectSelect.map(item => (
                                        <th value={item.name} key={item.id}>{item.name}</th>
                                    ))}
                                </tr>
                                {listInter.map((item) => (
                                    <tr className="grey-text count-tr" key={item.id}>
                                        {item.internScoreDTOList.map((score) => (
                                            <td key={score.id}>{score.totalScore}</td>
                                        ))}
                                    </tr>
                                ))}
                            </div>
                            <div className="no-scrolling">
                                <tr className="header-tr grey-text">
                                    <th>Tổng kết</th>
                                    <th>Đánh giá trên team</th>
                                    <th className=" text-center">Hành động</th>
                                </tr>
                                {listInter.map(item => (
                                    <tr className="grey-text count-tr" key={item.id}>
                                        <td>{item.finalScore}</td>
                                        <td>{item.scoreInTeam}</td>
                                        <td>
                                            <RemoveRedEyeIcon style={{ width: '24px', height: '24px', marginRight: '5px' }} className="color-blue white-div font-size-large" />
                                            <CreateIcon style={{ width: '24px', height: '24px' }} className="color-orange pencil-btn font-size-medium" />
                                        </td>
                                    </tr>
                                ))}
                            </div>
                        </table>
                    </div>
                    <Stack spacing={1} style={{ marginTop: '190px', alignItems: 'center' }}>
                        <Pagination
                            count={Math.ceil(pagination.totalElements / pagination.size)}
                            page={pagination.page + 1}
                            shape="rounded"
                            onChange={handlePageChange}
                        />
                    </Stack>
                </div>
            </Box>
            {/* <Footer /> */}
        </>
    )
}