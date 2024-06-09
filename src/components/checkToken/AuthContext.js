import axios from "axios";
import {enqueueSnackbar} from "notistack";
import {Navigate, useNavigate} from "react-router-dom";
import Login from "../pages/login/login";
import Register from "../pages/login/register";
import PageWait from "../stats/standbyPage/pageWait";
import {useEffect} from "react";

// Context xác thực người dùng
function AuthContext({children}) {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const pathName = window.location.pathname;

    if (currentUser === null) {
        if (pathName === '/') {
            return children
        }
        if (pathName !== "/login" && pathName !== "/register") {
            return <Navigate to="/login"/>
        }
        // return <Navigate to="/"/>
    } else {
        axios.get(`http://localhost:8080/api/tokens/checkToken?token=${currentUser.accessToken}`).then(res => {
                console.log(res)
            }
        ).catch(e => {
            axios.post("http://localhost:8080/logoutUser", {}, {
                headers: {
                    Authorization: `Bearer ${currentUser.accessToken}` // Thêm token vào header
                }
            })
            localStorage.removeItem("currentUser");
            window.location.href= 'http://localhost:3000/';
        })

        const roles = currentUser.roles.map(role => role.authority); // Lấy danh sách vai trò của người dùng
        const isAdmin = roles.includes('ROLE_ADMIN'); // Kiểm tra xem người dùng có vai trò admin hay không
        const isManager = roles.includes('ROLE_TM'); // Kiểm tra xem người dùng có vai trò quản lý hay không
        const isDivisionManager = roles.includes('ROLE_DM'); // Kiểm tra xem người dùng có vai trò quản lý bộ phận hay không
        const isQualityController = roles.includes('ROLE_QC'); // Kiểm tra xem người dùng có vai trò kiểm soát chất lượng hay không
        const isHumanResource = roles.includes('ROLE_HR'); // Kiểm tra xem người dùng có vai trò nhân sự hay không
        const status = currentUser.status;
        const state = currentUser.state;

        if (pathName === '/') {
                return <Navigate to={"/dashboard"}/>
        }
        if (pathName === '/users') {
            if (!isAdmin) {
                return <Navigate to={"/dashboard"}/>
            }
        }
        if (pathName === "/training") {
            if (!isAdmin && !isManager) {
                return <Navigate to={"/dashboard"}/>
            }
        }
        if (pathName === '/users' && !isAdmin) {
            return <Navigate to="/dashboard"/>;
        }
        if (pathName === "/training/stats") {
            if (!isAdmin) {
                return <Navigate to={"/"}/>
            }
        }
        if (pathName === "/login") {
            return <Navigate to="/dashboard"/>
        }

    }
    return children ? <>{children}</> : <Navigate to="/notFound" />;
}

// Hàm đăng xuất
export function doLogout(navigate) {
    const user = JSON.parse(localStorage.getItem("currentUser")); // Lấy thông tin người dùng hiện tại từ localStorage

    // Kiểm tra xem người dùng có tồn tại không
    if (user) {
        // Gửi yêu cầu đăng xuất đến server
        axios.post("http://localhost:8080/logoutUser", {}, {
            headers: {
                Authorization: `Bearer ${user.accessToken}` // Thêm token vào header
            }
        }).then(() => {
        }).catch(e => {
            console.error(e); // In lỗi ra console
        });

        localStorage.removeItem("currentUser"); // Xóa thông tin người dùng khỏi localStorage
        navigate("/"); // Điều hướng người dùng đến trang chủ
    } else {
        navigate("/"); // Nếu không có người dùng, điều hướng trực tiếp đến trang chủ
    }
}


export default AuthContext;
