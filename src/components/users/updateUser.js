import * as React from 'react';
import { Dialog, DialogTitle, IconButton, Typography } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import './updateUser.css';
import '../../assets/css/cssRecruitment/recruitment.css';

export default function DialogUpdateUserForm() {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <CreateIcon className="color-orange pencil-btn font-size-medium" onClick={handleClickOpen} />

            <Dialog
                className='wrapper-update'
                open={open}
                onClose={handleClose}
                PaperProps={{
                    fontSize: '16px',
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const email = formJson.email;
                        console.log(email);
                        handleClose();
                    },
                }}
            >

                <form className="row g-3" style={{ padding: '30px' }}>
                    <DialogTitle className="col-md-12 grey-text" style={{ paddingBottom: 3 }}><h2 style={{ fontWeight: '700' }}>Cập nhật thông tin</h2></DialogTitle>
                    <DialogContent className="col-md-12">
                        <DialogContentText>
                            <div className="form-label grey-text information-user">Họ tên: <span className='information-user'>Người dùng 04</span></div>
                            <div className="form-label grey-text information-user">Email: <span>user04@gmail.com</span></div>
                            <div className="form-label grey-text information-user">Trạng thái tài khoản: <span>Đang chờ duyệt</span></div>
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div className="form-label grey-text information-user">Vai trò:</div>
                                <div style={{ paddingLeft: '20px' }}>
                                    <FormGroup >
                                        <FormControlLabel control={<Checkbox />} label={<span className="form-label grey-text information-user">Trưởng bộ phận/nhóm</span>} />
                                        <FormControlLabel control={<Checkbox />} label={<span className="form-label grey-text information-user">Nhân sự"</span>} />
                                        <FormControlLabel control={<Checkbox />} label={<span className="form-label grey-text information-user">Kiểm soát chất lượng"</span>} />
                                        <FormControlLabel control={<Checkbox />} label={<span className="form-label grey-text information-user">Quản lý đào tạo"</span>} />
                                    </FormGroup>
                                </div>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <div className="send text-right">
                            <div className="send-child position-relative">
                                <button type="submit" className="btn send-btn btn-success text-center">
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </DialogActions>
                </form>

            </Dialog>
        </>
    )
}
