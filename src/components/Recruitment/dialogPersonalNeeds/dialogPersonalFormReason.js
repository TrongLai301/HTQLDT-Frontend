import { Dialog, DialogTitle, Grid, IconButton, TextareaAutosize } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import RemoveIcon from '@mui/icons-material/Remove';
import CreateIcon from '@mui/icons-material/Create';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import swal from "sweetalert";
import { sendNotifications } from "../../Notification/notification";


export default function DialogPersonalFormReason({nameNeedPlan,data, idUser, open, onClose }) {
    const [reason, setReason] = useState('');
    const localhost = process.env.REACT_APP_API_BACK_END;
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${localhost}api/recruitmentRequests/` + idUser + '/users/2',
                { reason }
            ).then(() => {
                swal("Cập nhật lý do thành công", {
                    icon: "success",
                    buttons: false,
                    timer: 2000
                }).then(() => {
                    sendNotifications(null,`Nhu cầu nhân sự <b>${nameNeedPlan}</b> bị từ chối bởi <b>Quản lý đào tạo</b>`,['ROLE_DM','ROLE_TM'],null,`recruitment/personalNeeds?idRequest=${data.values.recruitmentRequest.id}`)
                    window.location.href = "/recruitment/personalNeeds";
                });
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle >
                    <form className=" row g-3" onSubmit={handleSubmit}>
                        <div className=" col-md-12">
                            <h2 className="grey-text text-center">Lý do từ chối</h2>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 0
                                }}
                                onClick={onClose}
                            >
                                <ClearIcon className="fs-1_5em" />
                            </IconButton>
                        </div>
                        <div className="col-md-12">
                            <div className="form-floating">
                                <textarea
                                    className="form-control resize pt-2 text-area"
                                    placeholder="Describe yourself here..."
                                    id="floatingTextarea2"
                                    style={{ height: 200 }}
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                >
                                </textarea>
                                <label className=" grey-text" htmlFor="floatingTextarea2">Lý do từ chối...</label>
                            </div>
                        </div>
                        <div className="col-md-12 mt-2 d-flex">
                            <div className="col-md-6 mt-2">
                                <button type="button" onClick={onClose} className="btn btn-danger w-100 bg-clr-danger btn-edit">Hủy</button>
                            </div>
                            <div className="col-md-6 mt-2 ms-2">
                                <button className=" btn-edit btn btn-success w-98 bg-clr-success" type="submit">Gửi</button>
                            </div>
                        </div>
                    </form>
                </DialogTitle>
            </Dialog >
        </>
    )
}