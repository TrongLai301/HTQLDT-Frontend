import { Dialog, DialogTitle, Grid, IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import RemoveIcon from "@mui/icons-material/Remove";
import CreateIcon from "@mui/icons-material/Create";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DialogPersonalFormReason from "./dialogPersonalFormReason";
import axios from "axios";
import { useFormik } from "formik";
import DialogPersonalFormCreate from "./dialogPersonalFormCreate";
import DialogRecruitmentPlanFormCreate from "../dialogRecruitmentPlan/dialogRecruitmentPlanFormCreate";
import DialogRecruitmentPlanFormCreateSuccess from "./dialogRecruitmentPlanFormCreateSuccess";

export default function DialogPersonalFormWatch({ id , userRoles }) {
    const [tenhnology, setTenhnology] = useState([]);
    const hasRoleAdmin = () => {
        return userRoles.some((role) => role.authority === "ROLE_ADMIN"|| role.authority === "ROLE_QLĐT");
      };
    // Dữ liệu fake
    const formData = useFormik({
        initialValues: {
            idUser: null,
            recruitmentRequest: {
                id: null,
                dateStart: "",
                dateEnd: "",
                name: "",
                status: "",
                reason: "",
                details: [
                    {
                        type: "",
                        quantity: "",
                    },
                ],
            },
        },
    });
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/recruitmentRequests/" + id)
            .then((res) => {
                formData.setValues(res.data);
                const detail = res.data.details;
                setTenhnology(
                    detail.map((item) => ({ type: item.type, quantity: item.quantity }))
                );
            });
    }, []);
    // const testId = [useState()]

    // Xử lý mở form
    const [openForm, setOpenForm] = useState(false);
    const handleClickFormOpen = () => {
        setOpenForm(true);
    };
    const handleClickFormClose = () => {
        setOpenForm(false);
    };

    // Xử lý dialog
    const [openFormCreateSuccess, setOpenFormCreateSuccess] = useState(false);
    const handleCloseWatchOpenCreate = () => {
        setOpenForm(false);
        setOpenFormCreateSuccess(true);
    }
    const [openFormReason, setOpenFormReason] = useState(false);
    const handleCloseWatchOpenReason = () => {
        setOpenForm(false);
        setOpenFormReason(true);
    };


    return (
        <>
       
            <Tooltip title="Xem chi tiết">
                <RemoveRedEyeIcon
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Tooltip on top"
                    className="color-blue white-div fs-edit hover-primary cursor-pointer"
                    onClick={handleClickFormOpen}
                />
            </Tooltip>
        
            
            <Dialog
                id="formWatch"
                open={openForm}
                onClose={handleClickFormClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>
                    <form className=" row g-3">
                        <div className=" col-md-12">
                            <h2 className="grey-text">Nhu cầu nhân sự</h2>
                            <IconButton
                                sx={{
                                    position: "absolute",
                                    right: 0,
                                    top: 0,
                                }}
                                onClick={handleClickFormClose}
                            >
                                <ClearIcon className="fs-1_5em cursor-pointer" />
                            </IconButton>
                        </div>
                        <div className="col-md-12 ">
                            <table className="w-100">
                                <thead>
                                    <tr>
                                        <th>
                                            <label
                                                htmlFor="name"
                                                style={{ color: "#6F6F6F" }}
                                                className="form-label fw-500 mr-15 fs-20"
                                            >
                                                Tên:{" "}
                                            </label>
                                        </th>
                                        <th>
                                            <p className="namePersonal" style={{ color: "#838383" }}>
                                                {formData.values.recruitmentRequest.name}
                                            </p>
                                        </th>
                                        <th style={{ width: '55.05px' }}>
                                            <label
                                                htmlFor="name"
                                                style={{ color: "#6F6F6F" }}
                                                className="form-label fw-500 mr-15 fs-20"
                                            >

                                            </label>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <table className="table-edit">
                                                <thead className="grey-text">
                                                    <th
                                                        style={{ color: "#6F6F6F" }}
                                                        className="text-center p-2 w-250 fw-500"
                                                    >
                                                        Công nghệ
                                                    </th>
                                                    <th
                                                        style={{ color: "#6F6F6F" }}
                                                        className="text-center p-2 w-250 fw-500"
                                                    >
                                                        Số lượng nhân sự
                                                    </th>
                                                </thead>
                                                <tbody>
                                                    {tenhnology.map((item) => (
                                                        <tr key={item.type}>
                                                            <td
                                                                style={{ color: "#838383" }}
                                                                className="text-center p-2 w-250 fs-15 grey-text"
                                                            >
                                                                {item.type}
                                                            </td>
                                                            <td
                                                                style={{ color: "#838383" }}
                                                                className="text-center p-2 w-250 fs-15 grey-text"
                                                            >
                                                                {item.quantity}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-12 mt-2 d-flex height-35">
                            <label
                                htmlFor="time"
                                style={{ color: "#6F6F6F" }}
                                className="form-label fs-20"
                            >
                                Thời hạn bàn giao:{" "}
                            </label>
                            <p className="time-edit" style={{ color: "#838383" }}>
                                {formData.values.recruitmentRequest.dateEnd}
                            </p>
                        </div>
                        {formData.values.recruitmentRequest.status ===
                            "Bị từ chối bởi DET" ? (
                            <div className="col-md-12 mt-2 d-flex ">
                                <label
                                    htmlFor="time"
                                    style={{ color: "#6F6F6F", whiteSpace: "nowrap" }}
                                    className="form-label fs-20 me-2"
                                >
                                    Lý do:
                                </label>
                                <textarea
                                    readOnly
                                    className="form-control resize pt-2 w-372"
                                    style={{ color: "#838383" }}
                                    value={formData.values.recruitmentRequest.reason}
                                ></textarea>
                            </div>
                        ) : (formData.values.recruitmentRequest.status === "Đã xác nhận" || formData.values.recruitmentRequest.status === "Đang tuyển dụng" ? ("") :
                            (formData.values.recruitmentRequest.status === "Bị từ chối bởi DECAN" ? (
                                <div className="col-md-12 mt-2 d-flex ">
                                    <label
                                        htmlFor="time"
                                        style={{ color: "#6F6F6F", whiteSpace: "nowrap" }}
                                        className="form-label fs-20 me-2"
                                    >
                                        Lý do:
                                    </label>
                                    <textarea
                                        readOnly
                                        className="form-control resize pt-2 "
                                        style={{ color: "#838383" }}
                                        value={formData.values.recruitmentRequest.reason}
                                    ></textarea>
                                </div>
                            ) : (
                                hasRoleAdmin() && (
                                    <div className="col-md-12 mt-0 d-flex">
                                    <div className="col-md-3 mt-2">
                                        <button
                                            type="button"
                                            className="btn btn-danger w-100 bg-clr-danger btn-edit stop"
                                            onClick={handleCloseWatchOpenReason}
                                        >
                                            Từ chối
                                        </button>
                                    </div>
                                    <div className="col-md-9 mt-2 ms-2">
                                        <button
                                            type="button"
                                            className=" btn-edit btn btn-success w-98   bg-clr-success"
                                            onClick={handleCloseWatchOpenCreate}
                                        >
                                            Khởi tạo kế hoạch tuyển dụng
                                        </button>
                                    </div>
                                </div>
                                )
                                
                            ))
                        )}
                    </form>
                </DialogTitle>
            </Dialog>
            <DialogPersonalFormReason
                idUser={id}
                open={openFormReason}
                onClose={() => setOpenFormReason(false)}
            />
            <DialogRecruitmentPlanFormCreateSuccess userRoles={userRoles} id={formData.values.recruitmentRequest.id} open={openFormCreateSuccess} onClose={() => setOpenFormCreateSuccess(false)} />

        </>
    );
}
