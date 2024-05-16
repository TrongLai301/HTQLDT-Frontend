import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ClearIcon from "@mui/icons-material/Clear";
import {
    Box,
    Dialog,
    DialogContent,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../../assets/css/cssRecruitment/recruitment.css";
import "../../assets/css/cssRecruitment/responsiveRecruitment.css";
import imagePractice from "../../assets/image/PracticeImage.jpg";
import BreadCrumbs from "../fragment/breadcrumbs/breadcrumbs";
import Footer from "../fragment/footer/footer";
import Header from "../fragment/header/header";
import Navbar from "../fragment/navbar/navbar";
import DialogPersonalFormCreate from "./dialogPersonalNeeds/dialogPersonalFormCreate";
import DialogPersonalFormUpdate from "./dialogPersonalNeeds/dialogPersonalFormUpdate";
import DialogPersonalFormWatch from "./dialogPersonalNeeds/dialogPersonalFormWatch";


export default function PersonalNeeds() {
    const [open, setOpen] = useState(false);
    const handleClickPracticeOpen = () => {
        setOpen(true);
    };
    const handleClickPracticeClose = () => {
        setOpen(false);
    };
    const [check, setCheck] = useState(false);
    const checkDisplay = () => {
        setCheck(false);
    };

    const [status, setStatus] = useState("");
    const handleChange = (e) => {
        setStatus(e.target.value);
        console.log(e.target.value);
    };


    const listPersonal = [
        {
            id: 1,
            name: "DECEN- Nhu cầu nhân sự quý 3",
            time: "14:19 11/11/2019",
            status: "Đã gửi",
            man: "KongDT",
        },
        {
            id: 2,
            name: "DECEN- Nhu cầu 3",
            time: "14:19 11/11/2019",
            status: "Đã gửi",
            man: "KongDT",
        },
        {
            id: 3,
            name: "DECEN- Nhu cầu 3",
            time: "14:19 11/11/2019",
            status: "Đã gửi",
            man: "KongDT",
        },
        {
            id: 4,
            name: "DECEN- Nhu cầu 3",
            time: "14:19 11/11/2019",
            status: "Đã gửi",
            man: "KongDT",
        },
        {
            id: 5,
            name: "DECEN- Nhu cầu 3",
            time: "14:19 11/11/2019",
            status: "Đã gửi",
            man: "KongDT",
        },
        {
            id: 6,
            name: "DECEN- Nhu cầu 3",
            time: "14:19 11/11/2019",
            status: "Đã gửi",
            man: "KongDT",
        },
        {
            id: 7,
            name: "DECEN- Nhu cầu 3",
            time: "14:19 11/11/2019",
            status: "Đã gửi",
            man: "KongDT",
        },
    ];

    const [valueRecuitments, setSearchName] = useState('');
    const [showError, setShowError] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    const handleSearch = (event) => {
        setSearchName(event.target.value);
        if (event.key === 'Enter') {
            handleSubmitSearch(event);
        } else {
            // clearTimeout(search);
            setTimeout(() => {
                handleSubmitSearch(event);
            }, 3000);
        }
    };

    const handleSubmitSearch = async (event) => {
        console.log(event.target.value);
        event.preventDefault();
        try {
            const response = await axios.get(`http://localhost:8080/api/recruitmentRequests/search?name=${event.target.value}&status=${selectedStatus}`);
            setRecuitment(response.data);
            if (response.data.length === 0) {
                setShowError(true);
            } else {
                setShowError(false);
            }
        } catch (error) {
            console.error('Error search results:', error);
        }
    };
    const listTestSelect = [
        { id: " ", text: "Trạng thái" },
        { id: "Đã hủy", text: "Đã hủy" },
        { id: "Đã xác nhận", text: "Đã xác nhận" },
        { id: "Đã gửi", text: "Đã gửi" },
        { id: "Bị từ chối bởi DET", text: "Bị từ chối bởi DET" },
        { id: "Bị từ chối bởi DCAN", text: "Bị từ chối bởi DCAN" },
        { id: "Đang tuyển dụng", text: "Đang tuyển dụng" },
        { id: "Đã bàn giao", text: "Đã bàn giao" },
    ]
    const handleStatusChange = (event) => {
        console.log(event.target.value);
        setSelectedStatus(event.target.value);
        handleSubmitSelect(event.target.value);
    };

    const handleSubmitSelect = async (selectedValue) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/recruitmentRequests/search?name=${valueRecuitments}&status=${selectedValue}`);
            setRecuitment(response.data);
            if (response.data.length === 0) {
                setShowError(true);
            } else {
                setShowError(false);
            }
        } catch (error) {
            console.error('Error searching by status:', error);
        }
    };


    const [recuitments, setRecuitment] = useState([]);
    useEffect(() => {
        axios.get("http://localhost:8080/api/recruitmentRequests").then((res) => {
            setRecuitment(res.data);
        });
    }, []);

    return (
        <>
            <Header />
            <Navbar />
            <Box component="main" sx={{ minWidth: '1096px', flexGrow: 1, p: 2, marginTop: '64px', marginLeft: '64px' }}>
                <BreadCrumbs recruitment="Tuyển dụng" personnelNeeds="Nhu cầu nhân sự" icon={<BusinessCenterIcon sx={{ marginBottom: '5px', marginRight: '2px' }} />} />
                <div className="content-recruiment">
                    <div className=" d-flex align-items-centent justify-content-between">
                        <p className="title text-center mb-0">
                            Nhu cầu nhân sự
                        </p>
                        <div className="d-flex align-items-center cursor-pointer" onClick={handleClickPracticeOpen}>
                            <p className="practice text-center mb-0 me-1">
                                Quy trình tuyển dụng
                            </p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#005B9F" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 16a1 1 0 1 1 1-1a1 1 0 0 1-1 1m1-5.16V14a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1a1.5 1.5 0 1 0-1.5-1.5a1 1 0 0 1-2 0a3.5 3.5 0 1 1 4.5 3.34" /></svg>
                        </div>
                    </div>
                    <Dialog
                        open={open}
                        onClose={handleClickPracticeClose}
                        id="dialog"
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
                    <div className=" mt-2">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex">
                                <div className="search-input position-relative">
                                    <form onSubmit={handleSubmitSearch}>
                                        <input type="text" className="border-clr-grey w-px position-relative" name="name" value={valueRecuitments} onKeyPress={handleSearch} onChange={handleSearch} placeholder="Tìm kiếm với tên..." />
                                        <svg className="search-icon position-absolute" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="rgb(131 125 125 / 87%)" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" /></svg>
                                    </form>
                                </div>
                                <FormControl className="ml-10 select-form" sx={{ minWidth: 300 }}>
                                    <InputLabel htmlFor="grouped-select">Trạng thái</InputLabel>
                                    <Select defaultValue=""
                                        id="grouped-select"
                                        label="Trạng thái"
                                        onChange={handleStatusChange}
                                        value={selectedStatus}
                                        className="select-edit grey-text"
                                    >
                                        {
                                            listTestSelect.map(item => (
                                                <MenuItem type='submit' value={item.id} key="{item.status}"
                                                    onClick={handleSubmitSelect}
                                                >{item.text}</MenuItem>
                                            ))}
                                    </Select>

                                </FormControl>
                            </div>

                            <DialogPersonalFormCreate />

                        </div>

                    </div>
                    <div>
                        <table className="table responsive-table">
                            <tr className="header-tr grey-text">
                                <th style={{ width: 48 }}>STT</th>
                                <th style={{ width: 144 }}>Tên nhu cầu</th>
                                <th style={{ width: 130 }} className=" text-center">
                                    Thời gian khởi tạo
                                </th>
                                <th className="w-130 text-center">Trạng thái</th>
                                <th className="w-130 text-center">Người gửi</th>
                                <th className="w-130 text-right">Hành động</th>
                            </tr>
                            {recuitments.map((item) => (
                                <tr className="grey-text count-tr" key={item.id}>
                                    <td className="count-td pl-20"></td>

                                    <td>{item.name}</td>
                                    <td className="text-center">{moment(item.dateStart).format("HH:mm YYYY-MM-DD")}</td>
                                    <td className="text-center">{item.status}</td>
                                    <td className="text-center">{item.users.name}</td>
                                    <td className="text-right p-tricklord">
                                        <DialogPersonalFormWatch id={item.id} />
                                        {item.status === "Bị từ chối bởi DET" || item.status.toLowerCase() === "đã xác nhận" ? (
                                            <DialogPersonalFormUpdate id={item.id} check={true} />
                                        ) : (
                                            <DialogPersonalFormUpdate id={item.id} />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </table>
                        {showError && <p>No Content</p>}
                    </div>
                </div>
            </Box>
            <Footer />
        </>
    );
}
