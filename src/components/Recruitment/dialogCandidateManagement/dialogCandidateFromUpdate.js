import {
  Dialog,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import RemoveIcon from "@mui/icons-material/Remove";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CreateIcon from "@mui/icons-material/Create";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import swal from "sweetalert";
import { useFormik } from "formik";
import { TimeField } from "@mui/x-date-pickers";
import { validFullName, validEmail, validPhone } from "../regex/regex";


export default function DialogCandidateFormUpdate({ id, check, userRoles }) {
  const [errName, setErrName] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errPhoneNumber, setErrPhoneNumber] = useState(false);
  const [errRecruitmentPlan, setErrRecruitmentPlan] = useState(false);
  const [errStatus, setErrStatus] = useState(false);
  const [errFinalResult, setErrFinalResult] = useState(false);


  // Xử lý số lượng nhân sự
  const checkValid = (fullName, email, phoneNumber, recruitmentPlan, status) => {
    if (!validFullName.test(fullName)) {
      setErrName(true);
    } else {
      setErrName(false);
    }
    var hasErrEmail;
    if (!validEmail.test(email) || email === "") {
      setErrEmail(true);
      hasErrEmail = true;
    } else {
      setErrEmail(false);
      hasErrEmail = false;
    }
    // var hasErrFinalResult;
    // if (finalResult === '' || finalResult === 'default' || finalResult === 'undefined') {
    //   hasErrFinalResult = true;
    //   setErrFinalResult(true)
    // } else {
    //   hasErrFinalResult = false;
    //   setErrFinalResult(false)
    // }

    var hasErrPhone;
    if (!validPhone.test(phoneNumber) || phoneNumber === "") {
      setErrPhoneNumber(true);
      hasErrPhone = true;
    } else {
      setErrPhoneNumber(false);
      hasErrPhone = false;
    }

    var hasErrRecruitmentPlan;
    if (recruitmentPlan === '' || recruitmentPlan === null || recruitmentPlan === 'default' || recruitmentPlan === 'undefined') {
      setErrRecruitmentPlan(true);
      hasErrRecruitmentPlan = true;
    } else {
      setErrRecruitmentPlan(false);
      hasErrRecruitmentPlan = false;
    }

    var hasErrStatus;
    if (status === '' || status === 'default') {
      setErrStatus(true);
      hasErrStatus = true;
    } else {
      setErrStatus(false);
      hasErrStatus = false;
    }



    if (!validFullName.test(fullName) || !validEmail.test(email) || hasErrRecruitmentPlan || hasErrStatus || hasErrPhone || hasErrEmail) {
      return false;
    } else {
      return true;
    }
  }
  // Xử lý số lượng nhân sự

  const formData = useFormik({
    initialValues: {
      id: "",
      recruitmentPlan: {
        id: null,
        name: "",
      },
      name: "",
      email: "",
      phone: "",
      linkCv: "",
      interviewTime: "",
      checkInterview: "",
      comment: "",
      note: "",
      finalResult: "",
      status: "",
      scoreTest: "",
      scoreInterview: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      const inputDateTime = date.$d;
      const dateObject = new Date(inputDateTime);

      // Lấy các thành phần riêng lẻ
      const year = dateObject.getFullYear();
      const month = String(dateObject.getMonth() + 1).padStart(2, "0");
      const day = String(dateObject.getDate()).padStart(2, "0");
      const hours = String(dateObject.getHours()).padStart(2, "0");
      const minutes = String(dateObject.getMinutes()).padStart(2, "0");
      const seconds = String(dateObject.getSeconds()).padStart(2, "0");

      // Tạo chuỗi thời gian trong định dạng ISO
      const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      values.interviewTime = formattedDateTime;
      values.finalResult = finalResult;

      if (userRoles.some((role) => role.authority === "ROLE_QLĐT")) {
        if (values.scoreInterview === "" || values.scoreInterview === "N/A") {
          values.scoreInterview = 1;
        }
        if (values.scoreTest === "" || values.scoreTest === "N/A") {
          values.scoreTest = 50;
        }
        if (values.finalResult === "true") {
          values.finalResult = "true";
        } else {
          values.finalResult = "false";
        }
      }
      if (values.scoreInterview === "") {
        values.scoreInterview = "N/A";
      }
      if (values.scoreTest === "") {
        values.scoreTest = "N/A";
      }
      // Lấy dữ liệu check
      const fullName = values.name;
      const email = values.email;
      const phoneNumber = values.phone;
      const recruitmentPlan = values.recruitmentPlan.id;
      // checkValid(fullName, email, phoneNumber, recruitmentPlan, status)

      if (!checkValid(fullName, email, phoneNumber, recruitmentPlan)) {
        setSubmitting(false);
        return;
      } else {
        try {
          await axios.put("http://localhost:8080/api/plansIntern/" + id, values).then(res => {
            swal(" cập nhật thông tin ứng viên thành công", {
              icon: "success",
              buttons: false,
              timer: 1000
            }).then(() => {
              window.location.href = "/recruitment/candidateManagement";
            });
          })
        } catch (error) {
          swal("cập nhật thông tin ứng viên thất bại , số lượng ứng viên kế hoạch bạn chọn đã đủ", {
            icon: "error",
            buttons: false,
            timer: 1000
          });
        }
      }
    },
  });
  // Call api
  const [finalResult, setFinalResult] = useState();
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"))
    if (user != null) {
      try {
        axios.get("http://localhost:8080/api/plans").then((res) => {
          setPlans(res.data);
        });
        axios.get("http://localhost:8080/api/plansIntern/" + id).then((res) => {
          formData.setValues(res.data);
          setFinalResult(res.data.finalResult);
          const formatT = res.data.interviewTime;
          const dateNow = dayjs(formatT);
          setDate(dateNow);
          setFinalResult(res.data.finalResult);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }, []);

  const fetchIsFullManagement = async () => {
    const updatedPlans = await Promise.all(
      plans.map(async (item) => {
        try {
          const res = await axios.get(`http://localhost:8080/api/plansIntern/isFull/${item.id}`);
          return { ...item, isFullManagement: res.data };
        } catch (error) {
          console.error(`Error fetching isFullManagement for plan ${item.id}:`, error);
          return { ...item, isFullManagement: null }; // hoặc giá trị mặc định nào đó
        }
      })
    );
    setPlans(updatedPlans);
  };

  // fetchIsFullManagement();

  // Xử lý mở form
  const listTestSelect = [
    { id: 1, text: "Chọn trạng thái" },
    { id: 2, text: "Chưa có kết quả" },
    { id: 3, text: "Đã có kết quả" },
    { id: 4, text: "Đã gửi email cảm ơn" },
    { id: 5, text: "Đã hẹn ngày thực tập" },
    { id: 6, text: "Không nhận việc" },
    { id: 7, text: "Đã nhận việc" },
  ];
  const hasRoleAdmin = () => {
    return userRoles.some((role) => role.authority === "ROLE_TM");
  };
  const hasRoleHR = () => {
    return userRoles.some((role) => role.authority === "ROLE_HR");
  };

  const [openForm, setOpenForm] = useState(false);
  const handleClickFormOpen = () => {
    setOpenForm(true);
  };
  const handleClickFormClose = () => {
    setOpenForm(false);
  };


  // Code mới của thg candidate
  const dateNow = dayjs();

  const [date, setDate] = useState("");
  const handleChangeDateTime = (e) => {
    setDate(e);
  };
  // const

  // const 
  function TestMarks({ scoreTest, setScoreTest }) {
    if (scoreTest === '' || scoreTest === 'N/A') {
      scoreTest = 50;
    }
    // scoreTest = parseInt(scoreTest);
    const [testMarks, setTestMarks] = useState(scoreTest);
    const handleClickCountPlus = () => {
      if (testMarks < 100) {

        const newTestMarks = parseInt(testMarks) + 1;
        setTestMarks(newTestMarks);
        setScoreTest(newTestMarks);
      }
    };

    const handleInputChange = (e) => {
      if (e.target.value <= 100) {
        const newCount = parseInt(e.target.value);
        setTestMarks(newCount);
      }
    };

    const handleClickCountMinus = () => {
      if (testMarks > 0) {
        const newTestMarks = parseInt(testMarks) - 1;
        setTestMarks(newTestMarks);
        setScoreTest(newTestMarks);
      }
    };

    const handleBlurTestMark = (e) => {
      const newCount = parseInt(e.target.value);
      if (!isNaN(newCount) && newCount <= 100) {
        setTestMarks(newCount);
        setScoreTest(newCount);
      }
    }

    return (
      <>
        {hasRoleAdmin()  && (
          <div className="d-flex justify-content-center align-items-center">
            <RemoveIcon onClick={handleClickCountMinus} className="me-1" />
            <input
              value={testMarks}
              style={{ fontSize: "15px", height: "36px" }}
              className="form-control w-25 border-clr-grey border text-center"
              type="number"
              id="scoreTest"
              onChange={handleInputChange}
              onBlur={handleBlurTestMark}
            />
            <AddIcon onClick={handleClickCountPlus} className="ms-1" />
          </div>
        )}
        {hasRoleHR() && (
          <div className="d-flex justify-content-center align-items-center input-container input-disabled">
            <RemoveIcon onClick={handleClickCountMinus} className="me-1" />
            <input
              value={testMarks}
              style={{ fontSize: "15px", height: "36px" }}
              className="form-control w-25 border-clr-grey border text-center input-disabled"
              type="number"
              id="scoreTest"
              onChange={handleInputChange}
              onBlur={handleBlurTestMark}
              disabled
            />
            <AddIcon onClick={handleClickCountPlus} className="ms-1" />
          </div>
        )}
      </>

    );
  }

  // 
  function Interview({ scoreInterview, setScoreInterview }) {
    if (scoreInterview === '' || scoreInterview === 'N/A') {
      scoreInterview = 1;
    }
    const [interview, setInterview] = useState(scoreInterview);
    const handleClickCountPlus = () => {
      if (interview < 10) {
        setInterview(interview + 1);
        setScoreInterview(+interview + 1);
      }
    };
    const handleInputChange = (e) => {
      if (e.target.value <= 10) {
        const newCount = parseInt(e.target.value);
        setInterview(newCount);
        setScoreInterview(newCount);
      }
    };
    const handleClickCountMinus = () => {
      if (!interview <= 0) {
        setInterview(interview - 1);
        setScoreInterview(interview - 1);
      }
    };
    const handleBlurScoreIterview = (e) => {
      const newCount = parseInt(e.target.value);
      if (!isNaN(newCount) && newCount <= 10) {
        setInterview(newCount);
        setScoreInterview(newCount);
      }
    }

    return (
      <>
        {hasRoleAdmin()  && (
          <div className="d-flex justify-content-center align-items-center">
            <RemoveIcon onClick={handleClickCountMinus} className="me-1" />
            <input
              value={interview}
              style={{ fontSize: "15px", height: "36px" }}
              className="form-control w-25 border-clr-grey border text-center "
              type="number"
              id="scoreInterview"
              onChange={handleInputChange}
              onBlur={handleBlurScoreIterview}
            />
            <AddIcon onClick={handleClickCountPlus} className="ms-1" />
          </div>
        )}
        {hasRoleHR() && (
          <div className="d-flex justify-content-center align-items-center input-container input-disabled">
            <RemoveIcon onClick={handleClickCountMinus} className="me-1" />
            <input
              value={interview}
              style={{ fontSize: "15px", height: "36px" }}
              className="form-control w-25 border-clr-grey border text-center"
              type="number"
              id="scoreInterview"
              onChange={handleInputChange}
              onBlur={handleBlurScoreIterview}
              disabled
            />
            <AddIcon onClick={handleClickCountPlus} className="ms-1" />
          </div>
        )}
      </>
    );

  }

  const [change, setChange] = useState(finalResult ? "true" : "false");
  const handleChangePassFaild = (e) => {
    setFinalResult(e.target.value);
    setChange(e.target.value)
  };

  return (
    <>
      {( hasRoleAdmin() || hasRoleHR() ) ? (    <Tooltip title="Chỉnh sửa chi tiết">
          <CreateIcon
            className="color-orange pencil-btn font-size-medium hover-warning cursor-pointer"
            onClick={handleClickFormOpen}
          />
        </Tooltip>) : (
    ""
      )
      }

      <Dialog
        id="formCandidateCreate"
        open={openForm}
        onClose={handleClickFormClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle> {hasRoleAdmin()   && (<>
          <form className="row g-3" onSubmit={formData.handleSubmit}>
            {/* Form 1 */}
            <div className="col-md-12">
              <h2 className="grey-text mb-0" style={{ paddingBottom: 3 }}>
                Thông tin ứng viên
              </h2>
              <IconButton
                sx={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                }}
                onClick={handleClickFormClose}
              >
                <ClearIcon className="cursor-pointer" />
              </IconButton>
            </div>
            <div className="col-md-12">
              <h4 className="grey-text mb-1">Thông tin</h4>
              <hr className="hr-infor" />
            </div>
            <div className="col-md-6 mt-1 ">
              <label htmlFor="name" className="form-label grey-text mb-0 mt-2">
                Họ và tên ứng viên <span className="color-red">*</span>
              </label>
              <div className="input-disabled">
                <input
                  maxLength={60}
                  value={formData.values.name}
                  onChange={formData.handleChange}
                  name="name"
                  id="name"
                  type="text"
                  placeholder="Nhập họ và tên ứng viên..."
                  className="form-control grey-text input-disabled"
                  disabled
                />
              </div>

              <div className="col-md-8  mt-0">
                {errName && (
                  <p className="err-valid ws-nowrap ">
                    Tên không được để trống, có kí tự đặc biệt hoặc số
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-6 mt-1">
              <label htmlFor="name" className="form-label grey-text mb-0 mt-2">
                Email <span className="color-red">*</span>
              </label>
              <div className="input-disabled">
                <input
                  maxLength={60}
                  type="text"
                  value={formData.values.email}
                  name="email"
                  id="email"
                  onChange={formData.handleChange}
                  placeholder="Nhập email ứng viên..."
                  className="form-control grey-text input-disabled"
                  disabled
                />
              </div>

              <div className="col-md-8  mt-0">
                {errEmail && (
                  <p className="err-valid ws-nowrap ">
                    Email không hợp lệ
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-6 mt-1 ">
              <label htmlFor="name" className="form-label grey-text mb-0 mt-2">
                Số điện thoại <span className="color-red">*</span>
              </label>
              <div className="input-disabled">
                <input
                  maxLength={60}
                  type="text"
                  name="phone"
                  id="phone"
                  value={formData.values.phone}
                  onChange={formData.handleChange}
                  placeholder="Nhập số điện thoại..."
                  className="form-control grey-text input-disabled"
                  disabled
                />
              </div>

              <div className="col-md-8  mt-0">
                {errPhoneNumber && (
                  <p className="err-valid ws-nowrap ">
                    Số điện thoại không hợp lệ
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-6 mt-1 ">
              <label htmlFor="name" className="form-label grey-text mb-0 mt-2 ">
                Link CV
              </label>
              <div className="input-disabled">
                <input
                  maxLength={60}
                  type="text"
                  value={formData.values.linkCv}
                  id="linkCv"
                  name="linkCv"
                  onChange={formData.handleChange}
                  className="form-control grey-text input-disabled"
                  disabled
                />
              </div>

            </div>
            <div className="col-md-6 mt-1">
              <label
                htmlFor="time"
                className="form-label text-center grey-text mb-0 mt-2"
              >
                Thời gian hẹn phỏng vấn <span className="color-red">*</span>
              </label>
              <div id="time" className=" d-flex justify-content-center input-disabled">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeField
                    className="time-set form-control "
                    value={date}
                    onChange={handleChangeDateTime}
                    format="HH:mm"
                    disabled
                  />
                  <DemoContainer components={["DateTimePicker"]}>
                    <DemoItem>
                      <DateTimePicker
                        className="date-set form-control "
                        views={["day", "month", "year", "hours", "minutes"]}
                        value={date}
                        minDate={dateNow}
                        // minTime={dateNow}
                        onChange={handleChangeDateTime}
                        format="YYYY/MM/DD"
                        disabled
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            </div>
            <div className="col-md-6 mt-1 ">
              <label htmlFor="name" className="form-label grey-text mb-0 mt-2 ">
                Kế hoạch tuyển dụng <span className="color-red">*</span>
              </label>
              <div className="select-disabled input-disabled">
                <select
                  className="form-select grey-text "
                  aria-label="Default select example"
                  onChange={formData.handleChange}
                  value={formData.values.recruitmentPlan.id}
                  name="recruitmentPlan.id"
                  id="recruitmentPlan.id"
                  disabled
                >
                  {plans.filter((item) => item.status === "Đã xác nhận").map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>

                  ))}
                </select>
              </div>

              <div className="col-md-8  mt-0">
                {errRecruitmentPlan && (
                  <p className="err-valid ws-nowrap ">
                    Kế hoạch tuyển dụng không được để trống
                  </p>
                )}
              </div>
            </div>
            <>
              <div className="col-md-12">
                <div className="col-md-12">
                  <h4 className="grey-text mb-1">Kết quả phỏng vấn</h4>
                  <hr className="hr-infor" />
                </div>
                <div className="col-md-12 d-flex mt-3">
                  <div className="col-md-4 ">
                    <label
                      htmlFor="name"
                      className="form-label grey-text mb-0 ws-nowrap"
                    >
                      Có đến phỏng vấn?
                    </label>
                    <select
                      className="form-select grey-text"
                      style={{ width: "170px" }}
                      aria-label="Default select example"
                      onChange={formData.handleChange}
                      name="checkInterview"
                      id="checkInterview"
                      value={formData.values.checkInterview.toString()}
                    >
                      <option value="true">Có</option>
                      <option value="false">Không</option>
                    </select>
                  </div>
                  {/*  */}
                  <div className="col-md-4 text-center mt-0 mb-2">
                    <label
                      htmlFor="name"
                      className="form-label grey-text mb-0 ws-nowrap"
                    >
                      Điểm kiểm tra (%)
                    </label>
                    <TestMarks
                      scoreTest={formData.values.scoreTest}
                      setScoreTest={(value) =>
                        formData.setFieldValue("scoreTest", value)
                      }
                    />
                  </div>
                  <div className="col-md-4 text-center mt-0 mb-2">
                    <label
                      htmlFor="name"
                      className="form-label grey-text mb-0 ws-nowrap"
                    >
                      Điểm phỏng vấn trực tiếp
                    </label>
                    <Interview
                      scoreInterview={formData.values.scoreInterview}
                      setScoreInterview={(value) =>
                        formData.setFieldValue("scoreInterview", value)
                      }
                    />
                  </div>
                </div>
                {/*  */}
                <div className="col-md-12 mt-2">
                  <label
                    htmlFor="name"
                    className="form-label grey-text mb-0 ws-nowrap"
                  >
                    Nhận xét (nếu có)
                  </label>
                  <div className="col-md-12 text-area-field">
                    <TextField
                      placeholder="Nhập nhận xét"
                      id="outlined-multiline-flexible form-control"
                      multiline
                      value={formData.values.comment}
                      onChange={formData.handleChange}
                      name="comment"
                      maxRows={4}
                    />
                  </div>
                </div>
                <div className="col-md-12 mt-2 d-flex align-item-center justify-content-center">
                  <label
                    htmlFor="name"
                    className="form-label grey-text mb-0 ws-nowrap"
                  >
                    Kết quả cuối cùng:
                  </label>
                  <select
                    className={`form-select ms-2 ${finalResult === "true" || finalResult === true ? 'text-success' : finalResult === "false" || finalResult === false ? 'text-danger' : 'grey-text'}`}
                    style={{ width: "170px" }}
                    aria-label="Default select example"
                    value={finalResult}
                    onChange={handleChangePassFaild}
                  >
                    <option className={`grey-text ${finalResult === "true" || finalResult === true || finalResult === "false" || finalResult === false || finalResult === "" ? 'd-none' : ''}`} disabled value="">
                      N/A
                    </option>
                    <option className="text-success" value="true">
                      Passed
                    </option>
                    <option className="text-danger" value="false">
                      Failed
                    </option>
                  </select>
                </div>
                <div className="col-md-12 text-center  mt-0">
                  {errFinalResult && (
                    <p style={{ paddingLeft: '230px' }} className="err-valid ws-nowrap ">
                      Trạng thái không được để trống
                    </p>
                  )}
                </div>
              </div>
            </>
            <div className="col-md-12">
              <h4 className="grey-text mb-1">Trạng thái</h4>
              <hr className="hr-infor" />
            </div>
            <div className="col-md-12 mb-2 mt-1 d-flex justify-content-between">
              <div className="col-md-10 d-flex">
                <div className="col-md-5">
                  <label
                    htmlFor="name"
                    className="form-label grey-text mb-0 mt-2 ws-nowrap"
                  >
                    Cập nhật trạng thái
                  </label>
                  {formData.values.status === "Đã nhận việc" ? (
   <select
   className="form-select grey-text"
   aria-label="Default select example"
   value={formData.values.status}
   onChange={formData.handleChange}
   id="status"
   name="status"
   disabled
 >
   {listTestSelect.map((item) => (
     <option key={item.id} value={item.text}>
       {item.text}
     </option>
   ))}
 </select>
                  ) : (<select
                    className="form-select grey-text"
                    aria-label="Default select example"
                    value={formData.values.status}
                    onChange={formData.handleChange}
                    id="status"
                    name="status"
                  >
                    {listTestSelect.map((item) => (
                      <option key={item.id} value={item.text}>
                        {item.text}
                      </option>
                    ))}
                  </select>)
                }
               
                </div>
                <div className="col-md-7 ms-4">
                  <label
                    htmlFor="name"
                    className="form-label grey-text mb-0 mt-2 ws-nowrap"
                  >
                    Lưu ý
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập lưu ý nếu có..."
                    className="form-control grey-text"
                    value={formData.values.note}
                    id="note"
                    name="note"
                    onChange={formData.handleChange}
                  />
                </div>
              </div>
            </div>
            <div className=" text-right mt-0 d-flex align-item-flex-end justify-content-end mt-3">
              <div className="send-child position-relative ">
                <button
                  type="submit"
                  className=" text-center align-item-center btn send-btn btn-success "
                >
                  Lưu
                </button>
              </div>
            </div>
            <div className="col-md-8  mt-0">
              {errStatus && (
                <p className="err-valid ws-nowrap ">
                  Trạng thái không được để trống
                </p>
              )}
            </div>
          </form>
        </>)
        }

          {hasRoleHR() && (<>
            <form className="row g-3" onSubmit={formData.handleSubmit}>
              {/* Form 1 */}



              <div className="col-md-12">
                <h2 className="grey-text mb-0" style={{ paddingBottom: 3 }}>
                  Thông tin ứng viên
                </h2>
                <IconButton
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                  }}
                  onClick={handleClickFormClose}
                >
                  <ClearIcon className="cursor-pointer" />
                </IconButton>
              </div>
              <div className="col-md-12">
                <h4 className="grey-text mb-1">Thông tin</h4>
                <hr className="hr-infor" />
              </div>
              <div className="col-md-6 mt-1 ">
                <label htmlFor="name" className="form-label grey-text mb-0 mt-2">
                  Họ và tên ứng viên <span className="color-red">*</span>
                </label>
                <input
                  maxLength={60}
                  value={formData.values.name}
                  onChange={formData.handleChange}
                  name="name"
                  id="name"
                  type="text"
                  placeholder="Nhập họ và tên ứng viên..."
                  className="form-control grey-text"
                />
                <div className="col-md-8  mt-0">
                  {errName && (
                    <p className="err-valid ws-nowrap ">
                      Tên không được để trống, có kí tự đặc biệt hoặc số
                    </p>
                  )}
                </div>
              </div>
              <div className="col-md-6 mt-1">
                <label htmlFor="name" className="form-label grey-text mb-0 mt-2">
                  Email <span className="color-red">*</span>
                </label>
                <input
                  maxLength={60}
                  type="text"
                  value={formData.values.email}
                  name="email"
                  id="email"
                  onChange={formData.handleChange}
                  placeholder="Nhập email ứng viên..."
                  className="form-control grey-text"
                />
                <div className="col-md-8  mt-0">
                  {errEmail && (
                    <p className="err-valid ws-nowrap ">
                      Email không hợp lệ
                    </p>
                  )}
                </div>
              </div>
              <div className="col-md-6 mt-1">
                <label htmlFor="name" className="form-label grey-text mb-0 mt-2">
                  Số điện thoại <span className="color-red">*</span>
                </label>
                <input
                  maxLength={60}
                  type="text"
                  name="phone"
                  id="phone"
                  value={formData.values.phone}
                  onChange={formData.handleChange}
                  placeholder="Nhập số điện thoại..."
                  className="form-control grey-text"
                />
                <div className="col-md-8  mt-0">
                  {errPhoneNumber && (
                    <p className="err-valid ws-nowrap ">
                      Số điện thoại không hợp lệ
                    </p>
                  )}
                </div>
              </div>
              <div className="col-md-6 mt-1 ">
                <label htmlFor="name" className="form-label grey-text mb-0 mt-2">
                  Link CV
                </label>
                <input
                  maxLength={60}
                  type="text"
                  value={formData.values.linkCv}
                  id="linkCv"
                  name="linkCv"
                  onChange={formData.handleChange}
                  className="form-control grey-text"
                />
              </div>
              <div className="col-md-6 mt-1">
                <label
                  htmlFor="time"
                  className="form-label text-center grey-text mb-0 mt-2"
                >
                  Thời gian hẹn phỏng vấn <span className="color-red">*</span>
                </label>
                <div id="time" className=" d-flex justify-content-center">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimeField
                      className="time-set form-control"
                      value={date}
                      onChange={handleChangeDateTime}
                      format="HH:mm"
                    />
                    <DemoContainer components={["DateTimePicker"]}>
                      <DemoItem>
                        <DateTimePicker
                          className="date-set form-control"
                          views={["day", "month", "year", "hours", "minutes"]}
                          value={date}
                          minDate={dateNow}
                          // minTime={dateNow}
                          onChange={handleChangeDateTime}
                          format="YYYY/MM/DD"
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
              </div>
              <div className="col-md-6 mt-1 ">
                <label htmlFor="name" className="form-label grey-text mb-0 mt-2">
                  Kế hoạch tuyển dụng <span className="color-red">*</span>
                </label>
                <select
                  className="form-select grey-text"
                  aria-label="Default select example"
                  onChange={formData.handleChange}
                  value={formData.values.recruitmentPlan.id}
                  name="recruitmentPlan.id"
                  id="recruitmentPlan.id"
                >
                  <option value="default">Chọn kế hoạch tuyển dụng</option>
                  {plans.filter((item) => item.status === "Đã xác nhận").map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <div className="col-md-8  mt-0">
                  {errRecruitmentPlan && (
                    <p className="err-valid ws-nowrap ">
                      Kế hoạch tuyển dụng không được để trống
                    </p>
                  )}
                </div>
              </div>
              <>
                <div className="col-md-12">
                  <div className="col-md-12">
                    <h4 className="grey-text mb-1">Kết quả phỏng vấn</h4>
                    <hr className="hr-infor" />
                  </div>
                  <div className="col-md-12 d-flex mt-3">
                    <div className="col-md-4 select-container select-container ">
                      <label
                        htmlFor="name"
                        className="form-label grey-text mb-0 ws-nowrap"
                      >
                        Có đến phỏng vấn?
                      </label>
                      <div className="select-disabled input-disabled">
                        <select
                          className="form-select grey-text "
                          style={{ width: "170px" }}
                          aria-label="Default select example"
                          onChange={formData.handleChange}
                          name="checkInterview"
                          id="checkInterview"
                          value={formData.values.checkInterview.toString()}
                          disabled
                        >
                          <option value="true">Có</option>
                          <option value="false">Không</option>
                        </select>
                      </div>

                    </div>
                    {/*  */}
                    <div className="col-md-4 text-center mt-0 mb-2">
                      <label
                        htmlFor="name"
                        className="form-label grey-text mb-0 ws-nowrap"
                      >
                        Điểm kiểm tra (%)
                      </label>
                      <TestMarks
                        scoreTest={formData.values.scoreTest}
                        setScoreTest={(value) =>
                          formData.setFieldValue("scoreTest", value)
                        }
                      />
                    </div>
                    <div className="col-md-4 text-center mt-0 mb-2">
                      <label
                        htmlFor="name"
                        className="form-label grey-text mb-0 ws-nowrap"
                      >
                        Điểm phỏng vấn trực tiếp
                      </label>
                      <Interview
                        scoreInterview={formData.values.scoreInterview}
                        setScoreInterview={(value) =>
                          formData.setFieldValue("scoreInterview", value)
                        }
                      />
                    </div>
                  </div>
                  {/*  */}
                  <div className="col-md-12 mt-2">
                    <label
                      htmlFor="name"
                      className="form-label grey-text mb-0 ws-nowrap"
                    >
                      Nhận xét (nếu có)
                    </label>
                    <div className="col-md-12 text-area-field input-disabled bg-#e9ecef ">
                      <TextField
                        placeholder="Nhập nhận xét"
                        id="outlined-multiline-flexible form-control "
                        multiline
                        value={formData.values.comment}
                        onChange={formData.handleChange}
                        name="comment"
                        disabled
                        maxRows={4}
                      />
                    </div>
                  </div>
                  <div className="col-md-12 mt-2 d-flex align-item-center justify-content-center select-container input-disabled">
                    <label
                      htmlFor="name"
                      className="form-label grey-text mb-0 ws-nowrap"
                    >
                      Kết quả cuối cùng:
                    </label>
                    <select
                      className={`form-select ms-2 ${finalResult === "true" || finalResult === true ? 'text-success' : finalResult === "false" || finalResult === false ? 'text-danger' : 'grey-text'}`}
                      style={{ width: "170px" }}
                      aria-label="Default select example"
                      value={finalResult}
                      onChange={handleChangePassFaild}
                      disabled
                    >
                      <option className={`grey-text ${finalResult === "true" || finalResult === true || finalResult === "false" || finalResult === false || finalResult === "" ? 'd-none' : ''}`} disabled value="">
                        N/A
                      </option>
                      <option className="text-success" value="true">
                        Passed
                      </option>
                      <option className="text-danger" value="false">
                        Failed
                      </option>
                    </select>
                  </div>
                  <div className="col-md-12 text-center  mt-0">
                    {errFinalResult && (
                      <p style={{ paddingLeft: '230px' }} className="err-valid ws-nowrap ">
                        Trạng thái không được để trống
                      </p>
                    )}
                  </div>
                </div>


              </>



              {/* chung */}
              <div className="col-md-12">
                <h4 className="grey-text mb-1">Trạng thái</h4>
                <hr className="hr-infor" />
              </div>
              <div className="col-md-12 mb-2 mt-1 d-flex justify-content-between">
                <div className="col-md-10 d-flex">
                  <div className="col-md-5">
                    <label
                      htmlFor="name"
                      className="form-label grey-text mb-0 mt-2 ws-nowrap"
                    >
                      Cập nhật trạng thái
                    </label>
                    <select
                      className="form-select grey-text "
                      aria-label="Default select example"
                      value={formData.values.status}
                      onChange={formData.handleChange}
                      id="status"
                      name="status"
                    >
                      {listTestSelect.map((item) => (
                        <option key={item.id} value={item.text}>
                          {item.text}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-7 ms-4">
                    <label
                      htmlFor="name"
                      className="form-label grey-text mb-0 mt-2 ws-nowrap"
                    >
                      Lưu ý
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập lưu ý nếu có..."
                      className="form-control grey-text"
                      value={formData.values.note}
                      id="note"
                      name="note"
                      onChange={formData.handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className=" text-right mt-0 d-flex align-item-flex-end justify-content-end mt-3">
                <div className="send-child position-relative ">
                  <button
                    type="submit"
                    className=" text-center align-item-center btn send-btn btn-success "
                  >
                    Lưu
                  </button>
                </div>
              </div>
              <div className="col-md-8  mt-0">
                {errStatus && (
                  <p className="err-valid ws-nowrap ">
                    Trạng thái không được để trống
                  </p>
                )}
              </div>
            </form>
          </>)}
        </DialogTitle>
      </Dialog>
    </>
  );
}
