import { Dialog, DialogTitle, Grid, IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DialogRecruitmentPlanFormReason from "./dialogRecruitmentPlanFormReason";
import axios from "axios";
import { useFormik } from "formik";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

export default function DialogRecruitmentPlanFormWatch({ id, check, statusItem, reasonItem , userRoles }) {
  const [tenhnology, setTenhnology] = useState([]);
  const navigate = useNavigate();
  const hasRoleAdmin = () => {
    return userRoles.some((role) => role.authority === "ROLE_ADMIN"|| role.authority === "ROLE_HR");
  };
  // Dữ liệu fake
  const formData = useFormik({
    initialValues: {
      idUser: null,
      recruitmentPlan: {
        recruitmentRequest: {
          dateStart: "",
          dateEnd: "",
          name: "",
          reason: "",
          division: null,
          status: "",
        },
        name: "",
        handoverDeadline: "",
        dateRecruitmentEnd: "",
        status: "",
      },
      planDetails: [
        {
          recruitmentPlan: null,
          type: "",
          numberOfPersonnelNeeded: "",
          numberOfOutputPersonnel: "",
        },
      ],
    },
  });
  
  // Call api
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showCancelButton: false,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  const approve = () => {
    const user = JSON.parse(localStorage.getItem("currentUser"))
    if (user != null) {
      try {
        axios.put(`http://localhost:8080/api/plans/${id}/users/1`).then(() => {
          setOpenForm(false);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Phê duyệt thành công",
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            window.location.href = "/recruitment/recruitmentPlan";
          });
        })
      } catch (error) {
        console.error('Error fetching approval:', error);
        // You can handle the error here, e.g., show a message to the user
      }
    }
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"))
    if (user != null) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + user.accessToken;
      axios.get("http://localhost:8080/api/plans/" + id).then((res) => {
        formData.setValues(res.data);
        const detail = res.data.planDetails;
        setTenhnology(detail);
      });
    }
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
          className="color-blue white-div fs-edit hover-primary"
          onClick={handleClickFormOpen}
        />
      </Tooltip>
   
      
      <Dialog
        id="formWatchRecruitmentPlan"
        open={openForm}
        onClose={handleClickFormClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          <form className=" row g-3">
            <div className=" col-md-12">
              <h2 className="grey-text">Kế hoạch tuyển dụng</h2>
              <IconButton
                sx={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                }}
                onClick={handleClickFormClose}
              >
                <ClearIcon className="fs-1_5em" />
              </IconButton>
            </div>
            <div className="col-md-12 ">
              <table className="w-100">
                <tbody>
                  <tr className=" mb-2">
                    <th className="w-1">
                      <label
                        htmlFor="name"
                        style={{ color: "#6F6F6F", whiteSpace: "nowrap" }}
                        className="fw-500 mr-15 fs-20"
                      >
                        Từ nhu cầu nhân sự:{" "}
                      </label>
                    </th>
                    <th>
                      <p
                        className="namePersonal mb-0"
                        style={{ color: "#838383" }}
                      >
                        {
                          formData.values.recruitmentPlan.recruitmentRequest
                            .name
                        }
                      </p>
                    </th>
                  </tr>
                  <tr>
                    <th>
                      <label
                        htmlFor="name"
                        style={{ color: "#6F6F6F", whiteSpace: "nowrap" }}
                        className="fw-500 mr-15 fs-20"
                      >
                        Tên kế hoạch tuyển dụng:{" "}
                      </label>
                    </th>
                    <th>
                      <p
                        className="namePersonal mb-0"
                        style={{ color: "#838383" }}
                      >
                        {formData.values.recruitmentPlan.name}
                      </p>
                    </th>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <div className="col-md-12 d-flex justify-content-center">
                        <table className="table-edit w-600">
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
                              Số lượng nhân sự đầu vào
                            </th>
                            <th
                              style={{ color: "#6F6F6F" }}
                              className="text-center p-2 w-250 fw-500"
                            >
                              Số lượng nhân sự đầu ra
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
                                  {item.numberOfPersonnelNeeded}
                                </td>
                                <td
                                  style={{ color: "#838383" }}
                                  className="text-center p-2 w-250 fs-15 grey-text"
                                >
                                  {item.numberOfOutputPersonnel}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                  <tr className="mt-2">
                    <td className="w-1">
                      <label
                        htmlFor="time"
                        style={{ color: "#6F6F6F" }}
                        className="form-label fs-20 mb-0"
                      >
                        Thời hạn tuyển dụng:{" "}
                      </label>
                    </td>
                    <td>
                      <p
                        className=" namePersonal mb-0"
                        style={{ color: "#838383" }}
                      >
                        {formData.values.recruitmentPlan.dateRecruitmentEnd}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label
                        htmlFor="time"
                        style={{ color: "#6F6F6F" }}
                        className="form-label fs-20 mb-0 "
                      >
                        Thời hạn bàn giao:{" "}
                      </label>
                    </td>
                    <td>
                      <p
                        className=" namePersonal mb-0"
                        style={{ color: "#838383" }}
                      >
                        {formData.values.recruitmentPlan.handoverDeadline}
                      </p>
                    </td>
                  </tr>
                 
                    <tr>
                      <td>
                        <label
                          htmlFor="time"
                          style={{ color: "#6F6F6F" }}
                          className="form-label fs-20 mb-0"
                        >
                          Trạng thái:{" "}
                        </label>
                      </td>
                      <td>
                        <p
                          className=" namePersonal mb-0"
                          style={{ color: "#838383" }}
                        >
                          {statusItem}
                        </p>
                      </td>
                    </tr>
                 
                </tbody>
              </table>
            </div>

            {formData.values.recruitmentPlan.status === "Bị từ chối bởi DET" ? (
              <div className="col-md-12  d-flex ">
                <label
                  htmlFor="time"
                  style={{ color: "#6F6F6F", whiteSpace: "nowrap" }}
                  className="form-label fs-20 me-2"
                >
                  Lý do:
                </label>
                <textarea
                  readOnly
                  className="form-control resize pt-2 w-618"
                  style={{ color: "#838383" }}
                  value={formData.values.recruitmentPlan.reason}
                ></textarea>
              </div>
            ) : (hasRoleAdmin() ? (
              <div className="col-md-12 mt-0 d-flex">
                <div className="col-md-6 mt-2">
                  <button
                    type="button"
                    className="btn btn-danger w-100 bg-clr-danger btn-edit stop"
                    onClick={handleCloseWatchOpenReason}
                  >
                    Từ chối
                  </button>
                </div>
                <div className="col-md-6 mt-2 ms-2">
                  <button type="button" onClick={approve} className=" btn-edit btn btn-success w-98    bg-clr-success">
                    Phê duyệt
                  </button>
                </div>
              </div>)
              : statusItem === "Bị từ chối bởi DECAN" ? (
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
                    value={reasonItem}
                  ></textarea>
                </div>
              ) : (
                hasRoleAdmin() && (
                <div className="col-md-12 mt-0 d-flex mt-2">
                  <div className="col-md-6 mt-2">
                    <button
                      type="button"
                      style={{ height: '42px' }}
                      className="btn btn-primary w-100 bg-clr-primary btn-edit stop"
                    >
                      Xem kết quả tuyển dụng
                    </button>
                  </div>
                  <div className="col-md-6 mt-2 ms-2">
                    <button
                      type="button"
                      style={{ height: '42px' }}
                      className=" btn-edit btn btn-success w-98    bg-clr-successV1">
                      Xem kết quả đào tạo
                    </button>
                  </div>
                </div>
              )
            )

            )}
          </form>
        </DialogTitle>
      </Dialog>
      <DialogRecruitmentPlanFormReason
        idPlan={id}
        open={openFormReason}
        onClose={() => setOpenFormReason(false)}
      />
    </>
  );
}
