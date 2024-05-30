import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ClearIcon from "@mui/icons-material/Clear";
import {
    Autocomplete,
    Box,
    Dialog,
    DialogContent,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Popper,
    Select,
    TextField,
    styled
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../../assets/css/cssRecruitment/recruitment.css";
import "../../assets/css/cssRecruitment/responsiveRecruitment.css";
import imagePractice from "../../assets/image/PracticeImage.jpg";
import BreadCrumbs from "../fragment/breadcrumbs/breadcrumbs";
import Footer from "../fragment/footer/footer";
import Header from "../fragment/header/header";
import Navbar from "../fragment/navbar/navbar";
import Pagination from '@mui/material/Pagination';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import DialogCandidateFormCreate from "./dialogCandidateManagement/dialogCandidateFromCreate";
import DialogCandidateFromUpdate from "./dialogCandidateManagement/dialogCandidateFromUpdate";
import DialogCandidateFromWatch from "./dialogCandidateManagement/dialogCandidateFromWatch";
export default function CandidateManagement() {
    const CustomPopper = styled(Popper)({
        '& .MuiAutocomplete-listbox': {
            maxHeight: '150px',
            backgroundColor: '#f0f0f0',
            // Chỉnh chiều cao tối đa
        },
    });

    const [open, setOpen] = useState(false);
    const handleClickPracticeOpen = () => {
        setOpen(true);
    };
    const handleClickPracticeClose = () => {
        setOpen(false);
    };
    const [valueRecuitments, setSearchName] = useState('');
    const [showError, setShowError] = useState(false);
    const [recuitments, setRecuitment] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [recruitmentPlan, setRecruitmentPlan] = useState([]);
    const [selectPlan, setSelectPlan] = useState('');
    const [currentPage, setCurrentPage] = useState(1);


    const handleSearch = (event) => {
        setSearchName(event.target.value);
        if (event.key === "Enter") {
            handleSubmitSearch(event, page);
        } else {
            setTimeout(() => {
                handleSubmitSearch(event, page);
            }, 3000)
        }
    };
    const handleSubmitSearch = async (event, pageNumber) => {
        const user = JSON.parse(localStorage.getItem("currentUser"))
        event.preventDefault();
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " + user.accessToken;
            const response = await axios.get(`http://localhost:8080/api/plansIntern/search?keyword=${event.target.value}&status=${selectedStatus}&namePlan=${selectPlan}&page=${pageNumber}`);
            setRecuitment(response.data.content);
            setPage(response.data.pageable.pageNumber);
            setTotalPages(response.data.totalPages);
            if (response.data.content.length === 0) {
                setPage(0);
                setTotalPages(1)
                setShowError(true);
            } else {
                setShowError(false);
            }
        } catch (error) {
            console.error('Error search results:', error);
        }
    };
    const listTestSelect = [
        { id: "", text: "Trạng thái" },
        { id: "Chưa có kết quả", text: "Chưa có kết quả" },
        { id: "Đã có kết quả", text: "Đã có kết quả" },
        { id: "Đã gửi email cảm ơn", text: "Đã gửi email cảm ơn" },
        { id: "Đã hẹn ngày thực tập", text: "Đã hẹn ngày thực tập" },
        { id: "Không nhận việc", text: "Không nhận việc" },
        { id: "Đã nhận việc", text: "Đã nhận việc" }
    ]
    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
        handleSubmitSelect(event.target.value, page);
    };

    const handleSubmitSelect = async (selectedStatus, pageNumber) => {
        console.log(selectedStatus)
        console.log(selectPlan);
        const user = JSON.parse(localStorage.getItem("currentUser"))
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " + user.accessToken;
            const response = await axios.get(`http://localhost:8080/api/plansIntern/search?keyword=${valueRecuitments}&status=${selectedStatus}&namePlan=${selectPlan}&page=${pageNumber}`);
            setRecuitment(response.data.content);
            setPage(response.data.pageable.pageNumber);
            setTotalPages(response.data.totalPages);
            if (response.data.content.length === 0) {
                setPage(0);
                setTotalPages(1)
                setShowError(true);
            } else {
                setShowError(false);
            }
        } catch (error) {
            console.error('Error searching by status:', error);
        }
    };



    const handleSubmitSelectPlan = async (selectPlan, pageNumber) => {
        const user = JSON.parse(localStorage.getItem("currentUser"))
        try {
            axios.defaults.headers.common["Authorization"] = "Bearer " + user.accessToken;
            const response = await axios.get(`http://localhost:8080/api/plansIntern/search?keyword=${valueRecuitments}&status=${selectedStatus}&namePlan=${selectPlan}&page=${pageNumber}`);
            setRecuitment(response.data.content);
            setPage(response.data.pageable.pageNumber);
            setTotalPages(response.data.totalPages);
            if (response.data.content.length === 0) {
                setPage(0);
                setTotalPages(1)
                setShowError(true);
            } else {
                setShowError(false);
            }
        } catch (error) {
            console.error('Error searching by status:', error);
        }
    };

    async function getAllRecruitmentPlan() {
        const user = JSON.parse(localStorage.getItem("currentUser"))
        if (user != null) {
            try {
                axios.defaults.headers.common["Authorization"] = "Bearer " + user.accessToken;
                const res = await axios.get('http://localhost:8080/api/plans')
                console.log(res.data)
                setRecruitmentPlan(res.data);
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        getAllRecruitmentPlan();
    }, [])

    const [userLogin, setUserLogin] = useState([]);
    const [idUser, setIdUser] = useState();
    async function getAll(pageNumber) {
        const user = JSON.parse(localStorage.getItem("currentUser"))
        setUserLogin(user.roles);
        setIdUser(user.id);
        if (user != null) {
            try {
                axios.defaults.headers.common["Authorization"] = "Bearer " + user.accessToken;
                const response = await axios.get(`http://localhost:8080/api/plansIntern/search?keyword=${valueRecuitments}&status=${selectedStatus}&namePlan=${selectPlan}&page=${pageNumber}`);
                setRecuitment(response.data.content);
                setPage(response.data.pageable.pageNumber);
                setTotalPages(response.data.totalPages);
                if (response.data.content.length === 0) {
                    setPage(0);
                    setTotalPages(1)
                    setShowError(true);
                } else {
                    setShowError(false);
                }
                console.log(recuitments);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }

    async function handleFristPage() {
        handlePagination(null, 1);
    }
    async function handleLastPage() {
        handlePagination(null, totalPages);
    }

    useEffect(() => {
        getAll(page)
    }, [page]);

    const handlePagination = (event, value) => {
        setCurrentPage(value);
        getAll(value - 1);
    }
    const handleGetOptionLabel = (option) => {
        return typeof option === 'string' ? option : option.name || inputValue;
    };
    const [inputValue, setInputValue] = useState('');
    const handlePlanChange = (event, value) => {
        if (value) {
            setSelectPlan(value.name);
            handleSubmitSelectPlan(value.name, page);
        } else {
            setSelectPlan(null);
            handleSubmitSelectPlan('', page);
        }
    };

    const handleEnterChange = (event, value) => {
        if (event.key === "Enter" && event.target) {
            setInputValue(event.target.value)
            console.log(event.target.value);
            setSelectPlan(event.target.value);
            handleSubmitSelectPlan(event.target.value, page);
        }
    }
    const handleBlur = () => {
        if (inputValue.trim() !== '' && !selectPlan) {
            setSelectPlan({ name: inputValue });
        }
    };

    return (
        <>
            <Header />
            <Navbar breadCrumb={"Quản lý ứng viên"} />
            <Box component="main" sx={{ minWidth: '1246px', flexGrow: 1, p: 2, marginTop: '64px', marginLeft: '64px' }}>
                <BreadCrumbs recruitment="Tuyển dụng" personnelNeeds="Quản lý ứng viên" icon={<BusinessCenterIcon sx={{ marginBottom: '5px', marginRight: '2px' }} />} />
                <div className="content-recruiment position-relative">
                    <div className=" d-flex align-items-centent justify-content-between ">
                        <p className="title text-center mb-0">
                            Quản lý ứng viên
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
                            <img src={imagePractice} alt="practice" style={{ width: '100%' }} />
                        </DialogContent>
                    </Dialog>
                    <div className=" mt-2">
                        <div className="d-flex justify-content-between w-auto-complete">
                            <div className="d-flex">
                                <div className="search-input position-relative">
                                    <form onSubmit={handleSubmitSearch}>
                                        <input type="text" className="border-clr-grey w-px position-relative" name="keyword" value={valueRecuitments} onChange={handleSearch} onKeyPress={handleSearch} placeholder="Tìm kiếm với tên hoặc email..." />
                                        <svg className="search-icon position-absolute" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="rgb(131 125 125 / 87%)" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" /></svg>
                                    </form>
                                </div>
                                <FormControl className="ml-10 select-form" sx={{ minWidth: 300 }}>
                                    <InputLabel htmlFor="grouped-select">Trạng thái</InputLabel>
                                    <Select defaultValue=""
                                        id="grouped-select"
                                        label="Trạng thái..."
                                        onChange={handleStatusChange}
                                        value={selectedStatus}

                                        className="select-edit grey-text"
                                    >
                                        {
                                            listTestSelect.map(item => (
                                                <MenuItem value={item.id} key="{item.status}" onClick={handleSubmitSelect}>{item.text}</MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <Autocomplete
                                    className='ml-10 select-form auto-complete'
                                    disablePortal
                                    id="combo-box-demo"
                                    options={recruitmentPlan}
                                    onChange={handlePlanChange}
                                    inputValue={inputValue}
                                    value={selectPlan}
                                    onInputChange={(event, value) => {
                                        if (event && event.target) {
                                            setInputValue(event.target.value);
                                        } else {
                                            setInputValue(value);
                                        }
                                    }}
                                    onKeyPress={handleEnterChange}
                                    onBlur={handleBlur}
                                    getOptionLabel={handleGetOptionLabel}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Kế hoạch tuyển dụng" />}
                                    filterOptions={(options, { inputValue }) => {

                                        // Lọc các mục phù hợp với giá trị nhập vào, không tạo ra các mục trùng lặp
                                        const filtered = options.filter(option => option.name.toLowerCase().includes(inputValue.toLowerCase()) && option.status === "Đã xác nhận");
                                        // Sử dụng Set để loại bỏ các mục trùng lặp
                                        return Array.from(new Set(filtered.map(option => option.name)))
                                            .map(name => options.find(option => option.name === name));
                                    }}
                                    PopperComponent={CustomPopper} // Sử dụng Popper tùy chỉnh
                                />
                            </div>
                            <DialogCandidateFormCreate userRoles={userLogin} />
                        </div>

                    </div>
                    <div>
                        <table className="table responsive-table">
                            <tr className="header-tr grey-text">
                                <th style={{ width: 48 }}>STT</th>
                                <th style={{ width: 144 }}>Tên ứng viên</th>
                                <th style={{ width: 130 }} className=" text-center">
                                    Email
                                </th>
                                <th className="w-130 text-center ws-nowrap">Số điện thoại</th>
                                <th className="w-130 text-center ws-nowrap">Điểm Test(%)</th>
                                <th className="w-130 text-center">Điểm PV</th>
                                <th className="w-130 text-center">Trạng thái</th>
                                <th className="w-130 text-right">Hành động</th>
                            </tr>

                            {recuitments.map((item, index) => (
                                <tr className="grey-text count-tr" key={item.id}>
                                    <td style={{ paddingLeft: "15px" }}>
                                        {index + 1 + page * 10}
                                    </td>
                                    <td className='ws-nowrap'>{item.name}</td>
                                    <td className="text-center">{item.email}</td>
                                    <td className="text-center">{item.phone}</td>
                                    <td className="text-center">{item.scoreTest || "N/A"}</td>
                                    <td className="text-center">{item.scoreInterview || "N/A"}</td>
                                    <td className="text-center">{item.status || "N/A"}</td>
                                    <td className="text-right p-tricklord">
                                        <DialogCandidateFromWatch id={item.id} />
                                        <DialogCandidateFromUpdate id={item.id} userRoles={userLogin}  />
                                    </td>
                                </tr>
                            ))}
                        </table>
                        {showError && <p>No Content</p>}
                        <div className=' position-absolute bottom-0  w-100 start-0 page align-item-center'>
                            <button className='first-button position-relative hover-btn-page btn-page' onClick={handleFristPage} disabled={currentPage === 1}>
                                <KeyboardDoubleArrowLeftIcon className='icon-page position-absolute' />
                            </button>
                            <Pagination count={totalPages} page={currentPage} onChange={handlePagination} className=' d-flex justify-content-center ' />
                            <button className='first-button position-relative hover-btn-page btn-page' onClick={handleLastPage} disabled={currentPage === totalPages}>
                                <KeyboardDoubleArrowRightIcon className='icon-page position-absolute' />
                            </button>
                        </div>
                    </div>
                </div>
            </Box>
            <Footer />
        </>
    )
}