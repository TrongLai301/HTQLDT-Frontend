import { Box, Dialog, DialogContent, IconButton, FormControl, InputLabel, MenuItem, Select, Typography, Link } from "@mui/material";
import Footer from "../fragment/footer/footer";
import Header from "../fragment/header/header";
import Navbar from "../fragment/navbar/navbar";
import "../../assets/css/cssRecruitment/recruitment.css";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css"
import ClearIcon from '@mui/icons-material/Clear';
import imagePractice from '../../assets/image/z5420560028155_279ad92bb3d475ee7a7d0139eac6402f.jpg'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Icon } from '@iconify/react';
// import {faEnvelop} from ''
import './training.css';

export default function Training() {
    const location = useLocation();
    console.log(location);

    const [open, setOpen] = useState(false);

    const handleClickPracticeOpen = () => {
        setOpen(true);
    }
    const handleClickPracticeClose = () => {
        setOpen(false);
    }

    const [status, setStatus] = useState('');
    const handleChange = (e) => {
        setStatus(e.target.value);
        console.log(e.target.value)
    };

    // Dữ liệu fake
    const listTestSelect = [
        { id: 1, text: "Đang thực tập" },
        { id: 2, text: "Đã hoàn tất" },
        { id: 3, text: "Tất cả" },
        { id: 4, text: "Đã dừng quá trình thực tập" }
    ]
    const userList = [
        { id: 1, name: 'Nguyen Van A', startDay: '11/11/2019', totalDays: '25', summary: '100', evaluationOnTeam: '100', subject1: '9', subject2: '9', subject3: '9', subject4: '9', subject5: '9', subject6: '9', subject7: '9' },
        { id: 2, name: 'Nguyen Van A', startDay: '11/11/2019', totalDays: '25', summary: '100', evaluationOnTeam: '100', subject1: '9', subject2: '9', subject3: '9', subject4: '9', subject5: '9', subject6: '9', subject7: '9' },
        { id: 3, name: 'Nguyen Van A', startDay: '11/11/2019', totalDays: '25', summary: '100', evaluationOnTeam: '100', subject1: '9', subject2: '9', subject3: '9', subject4: '9', subject5: '9', subject6: '9', subject7: '9' },
        { id: 4, name: 'Nguyen Van A', startDay: '11/11/2019', totalDays: '25', summary: '100', evaluationOnTeam: '100', subject1: '9', subject2: '9', subject3: '9', subject4: '9', subject5: '9', subject6: '9', subject7: '9' },
        { id: 5, name: 'Nguyen Van A', startDay: '11/11/2019', totalDays: '25', summary: '100', evaluationOnTeam: '100', subject1: '9', subject2: '9', subject3: '9', subject4: '9', subject5: '9', subject6: '9', subject7: '9' },
        { id: 6, name: 'Nguyen Van A', startDay: '11/11/2019', totalDays: '25', summary: '100', evaluationOnTeam: '100', subject1: '9', subject2: '9', subject3: '9', subject4: '9', subject5: '9', subject6: '9', subject7: '9' },
        { id: 7, name: 'Nguyen Van A', startDay: '11/11/2019', totalDays: '25', summary: '100', evaluationOnTeam: '100', subject1: '9', subject2: '9', subject3: '9', subject4: '9', subject5: '9', subject6: '9', subject7: '9' }
    ]

    return (
        <>
            <Header />
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 2, marginTop: '57px', marginLeft: '64px' }}>
                <Box m={2} style={{ display: 'flex' }}>
                    {/* <Breadcrumbs
                        aria-label='breadcrumb'
                        separator={<NavigateNextIcon fontSize="small" />}>
                        <Link underline="hover" href='#'>Home</Link>
                        <Link underline="hover" href='#'>Catalog</Link>
                        <Link underline="hover" href='#'>Access</Link>
                        <Typography color='text.primary'><GroupIcon /> Users</Typography>
                    </Breadcrumbs> */}
                    {/* <FontAwesomeIcon icon="fa-solid fa-book-open" />                    */}
                    <Icon style={{ width: 23, height: 23, color: 'rgba(0, 0, 0, 0.60)' }} icon="ion:book-sharp" />
                    <p style={{ marginLeft: '10px', marginBottom: '0px', fontFamily: 'sans-serif', fontWeight: '550', color: 'rgba(0, 0, 0, 0.60)' }}>Đào tạo</p>
                </Box>
                <div className="content-recruiment">
                    <div className=" d-flex align-items-centent justify-content-between">
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
                            <div className="d-flex">
                                <div className="search-input position-relative">
                                    <input type="text" className="w-px position-relative" style={{ width: '300px' }} placeholder="Tìm kiếm với tên hoặc email..." />
                                    <svg className="search-icon position-absolute" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="rgb(131 125 125 / 87%)" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" /></svg>
                                </div>
                                <FormControl className="h-px" sx={{ minWidth: '300px' }}>
                                    <InputLabel className="top-left" id="demo-simple-small-label">Trạng thái thực tập...</InputLabel>
                                    <Select
                                        labelId="demo-simple-small-label"
                                        className="h-px"
                                        id="demo-simple-select"
                                        label="Status"
                                        value={status}
                                        onChange={handleChange}
                                    >
                                        {listTestSelect.map(item => (
                                            <MenuItem value={item.id} key={item.id}>{item.text}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div className="table-container">
                        <table className="table_training" style={{ display: 'flex' }}>
                            <div className="no-scrolling">
                                <tr className="header-tr grey-text">
                                    <th className="training-id">STT</th>
                                    <th>Tên</th>
                                    <th>Bắt đầu</th>
                                    <th style={{width: '200px'}}>Số ngày TT</th>
                                </tr>
                                {userList.map(item => (
                                    <tr className="grey-text count-tr" key={item.id}>
                                        <td className="training-id">{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.startDay}</td>
                                        <td>{item.totalDays}</td>
                                        {/* <td className=" text-center">
                                        <RemoveRedEyeIcon className="color-blue white-div font-size-large" />
                                        <CreateIcon className="color-orange pencil-btn font-size-medium" />
                                    </td> */}
                                    </tr>
                                ))}
                            </div>
                            <div className="wrapper">
                                <tr className="header-tr grey-text">
                                    <th>Môn 1</th>
                                    <th>Môn 2</th>
                                    <th>Môn 3</th>
                                    <th>Môn 4</th>
                                    <th>Môn 5</th>
                                    <th>Môn 6</th>
                                    <th>Môn 7</th>
                                </tr>
                                {userList.map(item => (
                                    <tr className="grey-text count-tr">
                                        <td>{item.subject1}</td>
                                        <td>{item.subject2}</td>
                                        <td>{item.subject3}</td>
                                        <td>{item.subject4}</td>
                                        <td>{item.subject5}</td>
                                        <td>{item.subject6}</td>
                                        <td>{item.subject7}</td>
                                    </tr>
                                ))}
                            </div>
                            <div className="no-scrolling">
                                <tr className="header-tr grey-text">
                                    <th>Tổng kết</th>
                                    <th>Đánh giá trên team</th>
                                    <th className=" text-center">Hành động</th>
                                </tr>
                                {userList.map(item => (
                                    <tr className="grey-text count-tr" key={item.id}>
                                        <td>{item.summary}</td>
                                        <td>{item.evaluationOnTeam}</td>
                                        <td>
                                            <RemoveRedEyeIcon style={{ width: '24px', height: '24px', marginRight: '5px' }} className="color-blue white-div font-size-large" />
                                            <CreateIcon style={{ width: '24px', height: '24px' }} className="color-orange pencil-btn font-size-medium" />
                                        </td>
                                    </tr>
                                ))}
                            </div>
                        </table>
                    </div>
                    <Stack spacing={2} style={{ marginTop: '190px', alignItems: 'center' }}>
                        <Pagination count={10} shape="rounded" />
                    </Stack>
                </div>
            </Box>
            <Footer />
        </>
    )
}