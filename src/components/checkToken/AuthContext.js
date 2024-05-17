import axios from "axios";
import {enqueueSnackbar} from "notistack";
import {Navigate} from "react-router-dom";

// Check Token
function AuthContext({children}) {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const pathName = window.location.pathname;
    if (currentUser === null) {
        if (pathName !== "/login") {
            return <Navigate to="/login"/>
        }
    } else {
        let roles = []
        currentUser.roles.forEach(element => {
            roles = [...roles, element.authority]
        });
        const isAdmin = roles.find((role) => role === 'ROLE_ADMIN') 
        const isManager = roles.find((role) => role === 'ROLE_TM') 
        if (pathName === '/users'){
            if (!isAdmin) {
                return <Navigate to={"/"}/>
            } 
        }
        if (pathName === "/training") {
            if (!isAdmin && !isManager) {
                return <Navigate to={"/"}/>
            } 
        }
        {isAdmin && <div></div>}
        if (pathName === "/login") {
            return <Navigate to="/"/>
        }

    }
    if (children === undefined) {
        return <Navigate to="/notFound"/>
    }
    return (<>{children}</>)

}

export function doLogout(navigate) {
    const user = JSON.parse(localStorage.getItem("currentUser"))
    if (user != null) {
        axios.post("http://localhost:8080/logoutUser", {Authorization: `Bearer ${user.accessToken}`}).then(res => {
            // enqueueSnackbar("Đăng xuất thành công", {variant: "success"});
        }).catch(e => {
            console.error(e)
            // enqueueSnackbar("Có lỗi xảy ra không thể đăng xuất", {variant: "error"});
        })
        localStorage.removeItem("currentUser");
        navigate("/login")
    }
}

export default AuthContext;