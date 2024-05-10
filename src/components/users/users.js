import { Box, Dialog, DialogContent, IconButton, FormControl, InputLabel, MenuItem, Select, Typography, Link } from "@mui/material";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Footer from "../fragment/footer/footer";
import Header from "../fragment/header/header";
import Navbar from "../fragment/navbar/navbar";
import "../../assets/css/cssRecruitment/recruitment.css";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css"
import ClearIcon from '@mui/icons-material/Clear';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CreateIcon from '@mui/icons-material/Create';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GroupIcon from '@mui/icons-material/Group';
import axios from "axios";

export default function Users() {


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


    const [listRoleSelect, setListRoleSelect] = useState([])
    const [listUser, setListUser] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    
    const fetchListRoleSelect = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/users/role");
            setListRoleSelect(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchListUser = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/users/list");
            setListUser(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = async (event) => {
        if (event.key === 'Enter') {
            try {
                const response = await axios.get(`http://localhost:8080/api/users?keyword=${searchTerm}`);
                setListUser(response.data);
                setSearchTerm('');
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleChangeSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterRole = async () => {
        if (selectedRole === '') {
          return fetchListUser(); // Không có lọc nếu không có role được chọn
        }
        try {
          const response = await axios.get(`http://localhost:8080/api/users/filter/${selectedRole}`);
          setListUser(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
      };
    
      useEffect(() => {
        handleFilterRole();
      }, [selectedRole]);
    

    return (
        <>
            <Header />
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, p: 2, marginTop: '64px', marginLeft: '64px' }}>
                <Box m={2} style={{ display: 'flex' }}>
                    {/* <Breadcrumbs
                        aria-label='breadcrumb'
                        separator={<NavigateNextIcon fontSize="small" />}>
                        <Link underline="hover" href='#'>Home</Link>
                        <Link underline="hover" href='#'>Catalog</Link>
                        <Link underline="hover" href='#'>Access</Link>
                        <Typography color='text.primary'><GroupIcon /> Users</Typography>
                    </Breadcrumbs> */}
                    <GroupIcon style={{ paddingBottom: '3px' }} />
                    <p color='text.primary' style={{ marginLeft: '10px', marginBottom: '0px', fontFamily: 'sans-serif', fontWeight: '550' }}>Quản lý người dùng</p>
                </Box>
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
                        </DialogContent>
                    </Dialog>
                    <div className=" mt-3">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex">
                                <div className="search-input position-relative">
                                    <input
                                        type="text"
                                        className="w-px position-relative"
                                        style={{ width: '300px' }}
                                        value={searchTerm}
                                        onChange={handleChangeSearch}
                                        onKeyUp={handleSearch}
                                        placeholder="Tìm kiếm với tên hoặc email..."
                                    />
                                    <svg className="search-icon position-absolute" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="rgb(131 125 125 / 87%)" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" /></svg>
                                </div>
                                <FormControl className="h-px" sx={{ minWidth: '250px' }}>
                                    <InputLabel className="top-left" id="demo-simple-small-label">Vai trò...</InputLabel>
                                    <Select
                                        labelId="demo-simple-small-label"
                                        className="h-px"
                                        id="demo-simple-select"
                                        label="Status"
                                        value={selectedRole}
                                        onChange={handleRoleChange}>
                                        <MenuItem value={""} >Select</MenuItem>

                                        {listRoleSelect.map(item => (
                                            <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
                                        ))}
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
                            {listUser.map(item => (
                                <tr className="grey-text count-tr" key={item.id}>
                                    <td className="count-td"></td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>
                                        {item.roles.map(role => (
                                            <label key={role.id}>{role.name}</label>
                                        ))}
                                    </td>
                                    <td className=" text-center">{item.status}</td>
                                    <td className=" text-center">
                                        <RemoveRedEyeIcon className="color-blue white-div font-size-large" />
                                        <CreateIcon className="color-orange pencil-btn font-size-medium" />
                                    </td>
                                </tr>
                            ))}
                        </table>
                        <Stack spacing={1} style={{ marginTop: '190px', alignItems: 'center' }}>
                            <Pagination count={10} shape="rounded" />
                        </Stack>
                    </div>
                </div>
            </Box>
            <Footer />
        </>
    )
}