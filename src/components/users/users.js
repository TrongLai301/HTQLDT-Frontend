import { Box, Dialog, DialogContent, IconButton, FormControl, InputLabel, Menu, MenuItem, Select, TextField, Typography } from "@mui/material";
import BreadCrumbs from "../fragment/breadcrumbs/breadcrumbs";
import Footer from "../fragment/footer/footer";
import Header from "../fragment/header/header";
import Navbar from "../fragment/navbar/navbar";
import "../../assets/css/cssRecruitment/recruitment.css";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css"
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import imagePractice from '../../assets/image/z5420560028155_279ad92bb3d475ee7a7d0139eac6402f.jpg'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';

import { useState } from "react";
export default function Users() {
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
        { id: 1, text: "Super admin" },
        { id: 2, text: "Team leader" },
        { id: 3, text: "Intern" }
    ]
    const listPersonal = [
        { id: 1, name: 'Nguyen Van A', time: '14:19 11/11/2019', status: 'Đã gửi', man: 'KongDT', email: 'hai@mail.com', role:'Intern' },
        { id: 2, name: 'Nguyen Van A', time: '14:19 11/11/2019', status: 'Đã gửi', man: 'KongDT', email: 'hai@mail.com', role:'Intern' },
        { id: 3, name: 'Nguyen Van A', time: '14:19 11/11/2019', status: 'Đã gửi', man: 'KongDT', email: 'hai@mail.com', role:'Intern' },
        { id: 4, name: 'Nguyen Van A', time: '14:19 11/11/2019', status: 'Đã gửi', man: 'KongDT', email: 'hai@mail.com', role:'Intern' },
        { id: 5, name: 'Nguyen Van A', time: '14:19 11/11/2019', status: 'Đã gửi', man: 'KongDT', email: 'hai@mail.com', role:'Intern' },
        { id: 6, name: 'Nguyen Van A', time: '14:19 11/11/2019', status: 'Đã gửi', man: 'KongDT', email: 'hai@mail.com', role:'Intern' },
        { id: 7, name: 'Nguyen Van A', time: '14:19 11/11/2019', status: 'Đã gửi', man: 'KongDT', email: 'hai@mail.com', role:'Intern' }
    ]

    return (
        <>
            <Header />
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 2, marginTop: '64px', marginLeft: '64px' }}>
                <BreadCrumbs />
                <div className="content-recruiment">
                    <div className=" d-flex align-items-centent justify-content-between">
                        <p className="title text-center mb-0">
                            Quản lý người dùng
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
                                    <input type="text" className="w-px position-relative" placeholder="Search with name..." />
                                    <svg className="search-icon position-absolute" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="rgb(131 125 125 / 87%)" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" /></svg>
                                </div>
                                <FormControl className="h-px" sx={{ minWidth: '250px' }}>
                                    <InputLabel className="top-left" id="demo-simple-small-label">Vai trò...</InputLabel>
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
                                        ))

                                        }

                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                    <div>
                        <table className=" table ">
                            <tr className="header-tr grey-text">
                                <th>STT</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th className=" text-center">Trạng thái</th>
                                <th className=" text-center">Hành động</th>
                            </tr>
                            {listPersonal.map(item => (
                                <tr className="grey-text count-tr" key={item.id}>
                                    <td className="count-td"></td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.role}</td>
                                    <td className=" text-center">{item.status}</td>
                                    <td className=" text-center">
                                        <RemoveRedEyeIcon className="color-blue white-div font-size-large"/>
                                        <CreateIcon className="color-orange pencil-btn font-size-medium"/>
                                    </td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>
            </Box>
            <Footer />
        </>
    )
}