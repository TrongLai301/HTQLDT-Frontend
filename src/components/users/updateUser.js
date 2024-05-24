import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography,
    TextField, FormGroup, FormControlLabel, Checkbox, Button
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './updateUser.css';
import '../../assets/css/cssRecruitment/recruitment.css';

export default function DialogUpdateUserForm({ userId, onUpdate }) {
    const [open, setOpen] = useState(false);
    const [roles, setRoles] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    // Formik initialization
    const formik = useFormik({
        initialValues: {
            id: null,
            name: "",
            email: "",
            phone: "",
            roles: []
        },
        validationSchema: Yup.object({
            name: Yup.string().max(30, 'Không quá 30 ký tự').required('Tên không được bỏ trống'),
            email: Yup.string().email('Email không đúng định dạng').required('Email không được bỏ trống'),
            phone: Yup.string().matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ')
        }),
        validate: async (values) => {
            const errors = {};
            if (values.phone) {
                try {
                    const response = await axios.get(`http://localhost:8080/admin/users/check-phone/${values.phone}`);
                    if (response.data.exists) {
                        errors.phone = "Số điện thoại đã tồn tại";
                    }
                } catch (error) {
                    errors.phone = "Lỗi khi kiểm tra số điện thoại";
                }
            }
            return errors;
        },
        onSubmit: async (values) => {
            try {
                await axios.put(`http://localhost:8080/admin/users/update/${userId}`, values);
                enqueueSnackbar('Cập nhật thành công!', { variant: "success", anchorOrigin: { horizontal: "right", vertical: "top" } });
                onUpdate();
                setOpen(false);
            } catch (error) {
                enqueueSnackbar("Cập nhật thất bại!", { variant: "error", anchorOrigin: { horizontal: "right", vertical: "top" }, autoHideDuration: 3000 });
            }
        },
    });

    // Fetch user data
    useEffect(() => {
        axios.get(`http://localhost:8080/admin/users/view/${userId}`)
            .then((res) => {
                setRoles(res.data.roles);
                formik.setValues(res.data);
            });
    }, [userId]);

    // Handle checkbox change
    const handleCheckboxChange = (roleId) => (event) => {
        const updatedRoles = formik.values.roles.slice();
        const roleIndex = updatedRoles.findIndex(role => role.id === roleId);

        if (event.target.checked && roleIndex === -1) {
            updatedRoles.push({ id: roleId });
        } else if (!event.target.checked && roleIndex !== -1) {
            updatedRoles.splice(roleIndex, 1);
        }
        formik.setFieldValue('roles', updatedRoles);
    };

    // Render roles checkboxes
    const RolesCheckboxes = () => (
        <FormGroup>
            {[
                { id: 2, label: "Trưởng bộ phận/nhóm" },
                { id: 3, label: "Nhân sự" },
                { id: 4, label: "Kiểm soát chất lượng" },
                { id: 5, label: "Quản lý đào tạo" }
            ].map(role => (
                <FormControlLabel
                    key={role.id}
                    control={<Checkbox checked={formik.values.roles.some(r => r.id === role.id)} onChange={handleCheckboxChange(role.id)} />}
                    label={<span className="form-label grey-text information-user">{role.label}</span>}
                />
            ))}
        </FormGroup>
    );

    return (
        <>
            <CreateIcon className="color-orange pencil-btn font-size-medium cursor" onClick={() => setOpen(true)} />

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{ component: 'form', onSubmit: formik.handleSubmit }}
            >
                <div className='form-update-user'>
                    <DialogTitle style={{padding: '0'}}><span style={{ fontWeight: '700', fontSize: '32px' }} className='update-title'>Cập nhật thông tin</span></DialogTitle>
                    <DialogContent>
                        <div className='form-label-input'>
                            <div className="form-label grey-text information-user">Họ tên:
                            <span style={{color: 'red'}}> *</span>
                            </div>
                            <TextField
                                name='name'
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                fullWidth
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </div>
                        <div className='form-label-input'>
                        <div className="form-label grey-text information-user">Email:
                            <span style={{color: 'red'}}> *</span>
                            </div>
                            <TextField
                                name='email'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                fullWidth
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </div>
                        <div className='form-label-input'>
                            <div className="form-label grey-text information-user">Số điện thoại:
                            </div>

                            <TextField
                                name='phone'
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                fullWidth
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div className="form-label grey-text information-user">Vai trò:
                            </div>
                            <div style={{ paddingLeft: '20px' }}>
                                <RolesCheckboxes />
                            </div>
                        </div>
                    </DialogContent>
                    <div className='btn-container-user'>
                        {formik.isValid ? (
                             <Button
                             type="submit"

                             variant="contained"
                             className='send-btn'
                             style={{backgroundColor: 'green'}}>
                                 Cập nhật
                             </Button>
                        ):
                        <Button
                        type="submit"
                        disabled
                        variant="contained"
                        className='send-btn'
                        >
                            Cập nhật
                        </Button>
                        }
                    </div>
                </div>
            </Dialog>
        </>
    );
}