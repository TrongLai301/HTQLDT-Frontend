import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, IconButton, InputAdornment } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from "axios";
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useLocation, useNavigate } from "react-router-dom";
import logoImage from '../../../assets/image/logoCodeGym.png';
import logoGoogle from '../../../assets/image/google.png';
import { useState } from "react";

import { GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from "jwt-decode";
import { useGoogleLogin } from '@react-oauth/google';
import { Password } from '@mui/icons-material';
import './login.css';
import GoogleIcon from '@mui/icons-material/Google';
import { sendNotifications } from "../../Notification/notification";

import { useEffect } from 'react';
import { elements } from 'chart.js';
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

function Login() {
    
    const [local, setLocal] = useState('')
    useEffect(() => {
        const storedLocation = localStorage.getItem('currentLocation');
        try {
            const parsedLocation = JSON.parse(storedLocation);
            setLocal(parsedLocation) // In ra đối tượng JavaScript đã phân tích
        } catch (error) {
            console.error(error); // In ra lỗi nếu có
        }
    }, []);
    const localCheck = local.split('=');
    const localPath = localCheck[0];
    const number = localCheck[1];


    const [visible, setVisible] = React.useState(true)
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate()
    const handleSubmit = (event) => {
        event.preventDefault();
        setFlagValidate({ ...flagValidate, validSubmit: false })
        const formData = new FormData(event.currentTarget);
        const data = {};
        formData.forEach((value, key) => data[key] = value);
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
                    localStorage.setItem("pendingUser", JSON.stringify(data))
                    navigate("/pageWait", {state: {data}})
                    if(localPath === "/recruitment/personalNeeds?idRequest" || localPath === "/recruitment/recruitmentPlan?idPlan"){
                        navigate(local);
                    } else{
                        navigate("/users")
                    }
                }
                if(res.data.code === "203") {
                    enqueueSnackbar(res.data.msg, { variant: "error", anchorOrigin: { horizontal: "right", vertical: "top" } });
                }
                setFlagValidate({...flagValidate, validSubmit: true})
            }
        ).catch(reason => {
            enqueueSnackbar("Có lỗi ở phía máy chủ", { variant: "error", anchorOrigin: { horizontal: "right", vertical: "top" }, autoHideDuration: 3000 });
            setFlagValidate({ ...flagValidate, validSubmit: true })
        })
       
    };

    // Ép buộc component re-render
    const [, forceRender] = React.useReducer(x => x + 1, 0);

    // Validation
    const [flagValidate, setFlagValidate] = React.useState({
        validEmail: false,
        validPass: false,
        validSubmit: true,
        emailError: "Email không được để trống",
        passwordError: "Mật khẩu không được để trống",
    })

    const [showMsg, setShowMsg] = React.useState({
        showEmailError: false,
        showPassError: false,
        showUserNotFoundError: false,
        showSuccesAlert: false,
        showFailAlert: false,
    })


    // Hàm kiểm tra email
    let checkEmail = (value) => {
        let patternEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
        if (value.match(patternEmail)) {
            setFlagValidate({ ...flagValidate, validEmail: true })
        } else if (value === "") {
            setFlagValidate({ ...flagValidate, validEmail: false, emailError: "Email không được bỏ trống" })
        } else {
            setFlagValidate({ ...flagValidate, validEmail: false, emailError: "Không đúng định dạng email" })
        }
    }

    // Hàm kiểm tra pass
    let checkPass = (value) => {
        let patternPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g
        if (value.match(patternPassword)) {
            setFlagValidate({ ...flagValidate, validPass: true })
        } else if (value === "") {
            setFlagValidate({ ...flagValidate, validPass: false, passwordError: "Mật khẩu không được để trống" })
        } else {
            setFlagValidate({
                ...flagValidate,
                validPass: false,
                passwordError: "Mật khẩu phải ít nhất 8 ký tự và có viết hoa, thường và số"
            })
        }
    }


    // Disabled submit nếu một trong các flag là false
    const validForm = Object.values(flagValidate).some(value => !value);

    // Tạo các ref dể lấy giá trị của input
    const emailInput = React.useRef();
    const passwordInput = React.useRef();
    const submitButton = React.useRef();

    const loginAccountGoogle = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                // Lấy access token
                const { access_token } = response;

                // Sử dụng access token để lấy thông tin người dùng từ Google
                const userInfo = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
                const dataGoogle = {
                    name: userInfo.data.name,
                    phone: "",
                    email: userInfo.data.email,
                    password: "Email0" + userInfo.data.email,
                };
                console.log(dataGoogle);
                axios.post("http://localhost:8080/loginGoogle", dataGoogle).then(
                    res => {
                        if (res.data.code === "401") {
                            enqueueSnackbar(res.data.msg, { variant: "error", anchorOrigin: { horizontal: "right", vertical: "top" } });
                        }
                        if (res.data.code === "200") {
                            localStorage.setItem("currentUser", JSON.stringify(res.data.data))
                            enqueueSnackbar('Đăng nhập thành công !', { variant: "success", anchorOrigin: { horizontal: "right", vertical: "top" } });
                            navigate("/dashboard")
                        }
                        if (res.data.code === "201") {
                            localStorage.setItem("currentUser", JSON.stringify(res.data.data))
                            localStorage.setItem("pendingUser", JSON.stringify(dataGoogle))
                            sendNotifications(
                                null,
                                `Có người dùng mới đăng ký với email <b>${res.data.email}</b> `,
                                ['ROLE_ADMIN'],
                                null,
                                `/users?idUser=${res.data.id}`);
                            enqueueSnackbar('Đăng nhập thành công !', { variant: "success", anchorOrigin: { horizontal: "right", vertical: "top" } });
                            navigate("/pageWait", { state: { dataGoogle } })
                        }

                        if (res.data.code === "202") {
                            console.log(res.data);
                            localStorage.setItem("currentUser", JSON.stringify(res.data.data))
                            localStorage.setItem("pendingUser", JSON.stringify(dataGoogle))
                            enqueueSnackbar('Đăng nhập thành công!', { variant: "success", anchorOrigin: { horizontal: "right", vertical: "top" } });
                            navigate("/pageWait", { state: { dataGoogle } })
                        }
                        setFlagValidate({ ...flagValidate, validSubmit: true })
                    }
                ).catch(reason => {
                    enqueueSnackbar("Có lỗi ở phía máy chủ", { variant: "error", anchorOrigin: { horizontal: "right", vertical: "top" }, autoHideDuration: 3000 });
                    setFlagValidate({ ...flagValidate, validSubmit: true })
                })
            } catch (error) {
                console.log(error);
            }
        }
    });



    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs" style={{display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: '146px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar style={{ width: '100px', height: '100px' }} sx={{ m: 1, bgcolor: '#282781' }}>
                        <img src={logoImage} style={{ width: '80px', height: '80px' }} />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            placeholder="Example123@gmail.com"

                            inputRef={emailInput}
                            onChange={(e) => checkEmail(e.currentTarget.value)}
                            onFocus={() => {
                                setShowMsg({ ...showMsg, showEmailError: true })
                            }}
                            error={showMsg.showEmailError && !flagValidate.validEmail}
                            helperText={showMsg.showEmailError && !flagValidate.validEmail ? flagValidate.emailError : null}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={visible ? "password" : "text"}
                            id="password"
                            autoComplete="current-password"
                            InputProps={{
                                endAdornment: <EndAdorment visible={visible} setVisible={setVisible} />
                            }}

                            onFocus={() => {
                                setShowMsg({ ...showMsg, showPassError: true })
                            }}
                            placeholder={"Example0123"}
                            inputRef={passwordInput}
                            error={showMsg.showPassError && !flagValidate.validPass}
                            onChange={(e) => checkPass(e.currentTarget.value)}
                            helperText={showMsg.showPassError && !flagValidate.validPass ? flagValidate.passwordError : null}
                        />
                        {flagValidate.showSuccesAlert
                            &&
                            <Alert style={{ marginTop: 5 }} severity="success">
                                This is a success Alert.
                            </Alert>
                        }
                        {flagValidate.showFailAlert
                            &&
                            <Alert style={{ marginTop: 5 }} severity="error">
                                This is a success Alert.
                            </Alert>
                        }
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2,  padding: "8px 0px", fontWeight: 600}} disabled={validForm} ref={submitButton}>
                            Sign In
                        </Button>
                        <div class="form-link">
                            <span>Don't have an account? <a href="http://localhost:3000/register" class="link signup-link">Sign up</a></span>
                        </div>


                        <div class="line" sx={{ mt: 2 }}></div>

                        <Button fullWidth sx={{ mt: 2, mb: 2, fontWeight: 800}} variant="outlined" size='medium' onClick={() => loginAccountGoogle()}>
                            <img src={logoGoogle} style={{ width: '40px', height: '40px' }} />
                            Login with Google
                        </Button>
                    </Box>
                </Box>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ position: 'fixed', bottom: '20px' }}>
                        <Copyright sx={{ mt: 36, mb: 4, marginTop: '0px', marginBottom: '0px' }} />
                    </div>

                </div>
                
            </Container>
        </ThemeProvider>
    )
}

export default Login;