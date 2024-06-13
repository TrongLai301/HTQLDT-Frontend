import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, IconButton, InputAdornment } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import logoImage from '../../assets/image/CodeGym.jpg';
import './pageWait.css';
import { useEffect } from "react";
import { useSnackbar } from 'notistack';
import { doLogout } from '../checkToken/AuthContext';


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

// Show and hide password
const EndAdorment = ({ visible, setVisible }) => {
    return (
        <InputAdornment position='end'>
            <IconButton onClick={() => setVisible(!visible)}>
                {visible ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
            </IconButton>
        </InputAdornment>
    )
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function PageWait() {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate()
    const {state} = useLocation();
    const data = JSON.parse(localStorage.getItem("pendingUser"))
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))

    useEffect(() => {
        loginAccount()
    });

    const loginAccount = async () => {
        try {   
            console.log(currentUser);
            console.log(data)
            axios.post("http://localhost:8080/login", data).then(
                res => {
                    if (res.data.code === "401") {
                        enqueueSnackbar(res.data.msg, { variant: "error", anchorOrigin: { horizontal: "right", vertical: "top" } });
                    }
                    if (res.data.code === "200") {
                        localStorage.setItem("currentUser", JSON.stringify(res.data.data))
                        enqueueSnackbar('Đăng nhập thành công !', { variant: "success", anchorOrigin: { horizontal: "right", vertical: "top" } });
                        navigate("/dashboard")
                    }
                    if (res.data.code === "202") {
                        localStorage.setItem("currentUser", JSON.stringify(res.data.data))
                    }
                }
            ).catch(reason => {
                enqueueSnackbar("Có lỗi ở phía máy chủ", { variant: "error", anchorOrigin: { horizontal: "right", vertical: "top" }, autoHideDuration: 3000 });
            })
        } catch (error) {
            console.log(error);
        }
    }
    

    const handleDirectPage = () => {
        doLogout(navigate).then(() => {navigate("/login")})
    }
    
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container style={{ paddingTop: '140px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar style={{ width: '100px', height: '100px' }} sx={{ m: 1, bgcolor: '#282781' }}>
                        <img src={logoImage} style={{ width: '80px', height: '80px' }} />
                    </Avatar>
                    <Typography variant="h2" style={{ paddingTop: '40px' }}>Tài khoản cần chờ admin phê duyệt!</Typography>
                    <div class="form-link">
                        <span>Quay về trang đăng nhập? <a onClick={handleDirectPage} className="link_signup_link">Sign in</a></span>
                    </div>
                </Box>

            </Container>
            <div style={{ marginTop: '420px' }}>
                <Copyright sx={{ mt: 36, mb: 4 }} />
            </div>
        </ThemeProvider>
    )
}

export default PageWait;