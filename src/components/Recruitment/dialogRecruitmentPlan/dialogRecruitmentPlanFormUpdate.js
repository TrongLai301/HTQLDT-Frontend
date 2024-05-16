import { Dialog, DialogTitle, IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import RemoveIcon from "@mui/icons-material/Remove";
import BackspaceIcon from "@mui/icons-material/Backspace";

import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import CreateIcon from "@mui/icons-material/Create";

export default function DialogRecruitmentPlanFormUpdate({ check, id }) {
  const [dateErr, setDateErr] = useState(false);
  const [techErr, setTechErr] = useState(false);
  const [errNumberOfPersonal, setErrNumberOfPersonal] = useState(false);
  const [errNumberofOutput, setErrNumberOfOutput] = useState(false);
  // Xử lý số lượng nhân sự
  const checkValid = (dateSet, techArr, dateCreate) => {
    const futureDate = new Date(dateCreate);
    futureDate.setDate(dateCreate.getDate() + 75);

    const errTech = techArr.map((item) => {
      if (item.type === "" || item.type === "default") {
        return true;
      } else {
        return false;
      }
    });
    const hasErrTech = errTech.some((item) => item === true);
    setTechErr(hasErrTech);
    //
    const errNumberPersonal = techArr.map((item) => {
      if (
        item.numberOfPersonnelNeeded == 0 ||
        item.numberOfPersonnelNeeded === "" ||
        item.numberOfPersonnelNeeded < 0
      ) {
        return true;
      } else {
        return false;
      }
    });

    const hasErrOfPersonal = errNumberPersonal.some((item) => item === true);
    setErrNumberOfPersonal(hasErrOfPersonal);
    //
    const errNumberOutput = techArr.map((item) => {
      if (
        item.numberOfOutputPersonnel == 0 ||
        item.numberOfOutputPersonnel === "" ||
        item.numberOfOutputPersonnel < 0
      ) {
        return true;
      } else {
        return false;
      }
    });
    const hasErrNumberOutput = errNumberOutput.some((item) => item === true);
    setErrNumberOfOutput(hasErrNumberOutput);
    if (dateSet < futureDate || dateSet == "Invalid Date") {
      setDateErr(true);
    } else {
      setDateErr(false);
    }

    if (
      dateSet < futureDate ||
      dateSet == "Invalid Date" ||
      hasErrTech ||
      hasErrNumberOutput ||
      hasErrOfPersonal
    ) {
      return false;
    } else {
      return true;
    }
  };
  const checkValidInput = (recruitmentPlanName) => {
    if (recruitmentPlanName.length <= 60) {
      return true;
    } else {
      return false;
    }
  };

  const formData = useFormik({
    initialValues: {
      idUser: null,
      recruitmentPlan: {
        recruitmentRequest: {
          id: null,
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
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false);
      values.planDetails = [...tech];
      values.idUser = 1;
      if (values.recruitmentPlan.dateRecruitmentEnd == '') {
        values.recruitmentPlan.dateRecruitmentEnd = dateRecruitmentEnd;
      }
      if (values.recruitmentPlan.handoverDeadline == '') {
        values.recruitmentPlan.handoverDeadline = handoverDeadline;
      }
      const date = new Date(values.recruitmentPlan.handoverDeadline);
      const dateCreate = new Date(values.recruitmentPlan.dateRecruitmentEnd);
      if (!checkValid(date, tech, dateCreate)) {
        setSubmitting(false);
        return;
      } else if (!checkValidInput(values.recruitmentPlan.name)) {
        setSubmitting(false);
        return;
      } else {
        // Dữ liệu hợp lệ, tiến hành gửi dữ liệu
        try {
          await axios
            .put("http://localhost:8080/api/plans/" + id, values)
            .then((res) => {
              swal("Cập nhật kế hoạch tuyển dụng thành công", {
                icon: "success",
                buttons: false,
                timer: 2000,
              }).then(() => {
                window.location.href = "/recruitment/recruitmentPlan";
              });
            });
        } catch (error) {
          swal("Cập nhật kế hoạch tuyển dụng thất bại", {
            icon: "error",
            buttons: false,
            timer: 2000,
          });
        }
      }
    },
  });
  // Call api
  useEffect(() => {

    axios.get("http://localhost:8080/api/plans/" + id).then((res) => {
      formData.setValues(res.data);
      const detail = res.data.planDetails;
      setTech(
        detail.map((item) => ({
          type: item.type,
          numberOfPersonnelNeeded: item.numberOfPersonnelNeeded,
          numberOfOutputPersonnel: item.numberOfOutputPersonnel,
        }))
      );
    });
  }, []);

  // Xử lý mở form
  const listTechnology = [
    { id: 1, text: "PHP" },
    { id: 2, text: "Laravel" },
    { id: 3, text: "React" },
    { id: 4, text: "React Native" },
    { id: 5, text: "Agular" },
    { id: 6, text: "Python - Django" },
    { id: 7, text: "VueJs" },
    { id: 8, text: "Android" },
    { id: 9, text: "IOS" },
    { id: 10, text: "JAVA" },
    { id: 11, text: ".NET" },
  ];
  const [openForm, setOpenForm] = useState(false);
  const handleClickFormOpen = () => {
    setOpenForm(true);
  };
  const handleClickFormClose = () => {
    setOpenForm(false);
  };
  // Xử lý thêm công nghệ
  const [tech, setTech] = useState([
    { type: "", numberOfPersonnelNeeded: "", numberOfOutputPersonnel: "" },
  ]);
  const addTech = () => {
    setTech((prevTech) => [
      ...prevTech,
      { type: "", numberOfPersonnelNeeded: "", numberOfOutputPersonnel: "" },
    ]);
  };

  const removeTech = (index) => {
    const updateTech = tech.filter((_, idx) => idx !== index);
    setTech(updateTech);
  };
  const handleChangeSelect = (e, index) => {
    const updateTech = [...tech];
    updateTech[index] = { ...updateTech[index], type: e.target.value };
    setTech(updateTech);
  };

  // Hàm dữ liệu đầu ra
  function NumberOfOutputPersonnel({ number, idx }) {
    if (number === "" || number == 0) {
      number = 0;
    }
    const [countOf, setCountOf] = useState(number);

    const handleClickCountPlus = () => {
      if (number < 20 || countOf < 20) {
        setCountOf(parseInt(countOf) + 1);
        numberOfOutputPersonnel((parseInt(number) + 1), idx);
      }
    };
    const handleInputChange = (e) => {
      if (e.target.value <= 20) {
        const newCount = parseInt(e.target.value);
        setCountOf(newCount);
      }
    };
    const handleClickCountMinus = () => {
      if (!countOf <= 0) {
        setCountOf(countOf - 1);
        numberOfOutputPersonnel((parseInt(number) - 1), idx);

      }
    };
    const handleBlur = () => {
      numberOfOutputPersonnel(countOf, idx);
    };
    return (
      <div className="d-flex justify-content-center align-items-center">
        <RemoveIcon onClick={handleClickCountMinus} className="me-1" />
        <input
          value={countOf}
          style={{ fontSize: "15px", height: "36px" }}
          className="form-control w-25 border-clr-grey border text-center"
          type="number"
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        <AddIcon
          onClick={handleClickCountPlus}
          className="ms-1" />
      </div>
    );
  }
  const numberOfOutputPersonnel = (countOf, index) => {
    const updatedTech = [...tech];
    updatedTech[index].numberOfOutputPersonnel = countOf;
    setTech(updatedTech);
    const count = countOf * 3;
    if (count > 40) {
      handleQuantityOffPersonal(40, index);
    } else {
      handleQuantityOffPersonal(count, index);
    }
  };
  // Hàm dữ liệu cần tuyển
  function NumberOfPersonnelNeeded({ number, idx }) {
    if (number === "" || number == 0) {
      number = 0;
    }
    const [countOf, setCountOf] = useState(number);
    const handleClickCountPlus = () => {
      if (number < 40 || countOf < 40) {
        setCountOf(countOf + 1);
        handleQuantityOffPersonal(parseInt(number) + 1, idx);
      }
    };
    const handleInputChange = (e) => {
      if (e.target.value <= 40) {
        const newCount = parseInt(e.target.value);
        setCountOf(newCount);
      }
    };
    const handleClickCountMinus = () => {
      if (!countOf <= 0) {
        setCountOf(countOf - 1);
        handleQuantityOffPersonal(parseInt(number) - 1, idx);
      }
    };
    const handleBlur = () => {
      handleQuantityOffPersonal(countOf, idx);
    };
    return (
      <div className="d-flex justify-content-center align-items-center">
        <RemoveIcon onClick={handleClickCountMinus} className="me-1" />
        <input
          value={countOf}
          style={{ fontSize: "15px", height: "36px" }}
          className="form-control w-25 border-clr-grey border text-center"
          type="number"
          onChange={handleInputChange}
          onBlur={handleBlur}
        />
        <AddIcon onClick={handleClickCountPlus} className="ms-1" />
      </div>
    );
  }
  const handleQuantityOffPersonal = (countOf, index) => {
    const updatedTech = [...tech];
    updatedTech[index].numberOfPersonnelNeeded = countOf;
    setTech(updatedTech);
  };
  const handoverDeadlineStr = formData.values.recruitmentPlan.handoverDeadline;
  const timeHandOver = new Date(handoverDeadlineStr);
  const yearH = timeHandOver.getFullYear();
  const monthH = String(timeHandOver.getMonth() + 1).padStart(2, '0'); // Tháng phải có 2 chữ số
  const dayH = String(timeHandOver.getDate()).padStart(2, '0'); // Ngày phải có 2 chữ số
  const timeHandOverValue = `${yearH}-${monthH}-${dayH}`;
  const [handoverDeadline, setHandoverDeadline] = useState(timeHandOverValue);

  const timeNow = new Date();
  const year = timeNow.getFullYear();
  const month = String(timeNow.getMonth() + 1).padStart(2, '0'); // Tháng phải có 2 chữ số
  const day = String(timeNow.getDate()).padStart(2, '0'); // Ngày phải có 2 chữ số
  const timeNowValue = `${year}-${month}-${day}`;
  const dateDeadline = new Date(timeNow);
  dateDeadline.setDate(timeNow.getDate() + 75);
  const [dateRecruitmentEnd, setRecuitmentDateEnd] = useState(timeNowValue);

  const handleDateChange = (event) => {
    if (event.target.name === 'recruitmentPlan.dateRecruitmentEnd') {
      setRecuitmentDateEnd(event.target.value);
    } else if (event.target.name === 'recruitmentPlan.handoverDeadline') {
      setHandoverDeadline(event.target.value);
    }
    formData.handleChange(event);
  }

  function TimeRecruitment() {


    return (
      <>
        <div className="col-md-4 mt-0 mb-2 child">
          <input
            type="date"
            min={timeNowValue}
            onChange={handleDateChange}
            onBlur={formData.handleBlur}
            value={dateRecruitmentEnd}
            className={`form-control text-center grey-text`}
            id="recruitmentPlan.dateRecruitmentEnd"
            name="recruitmentPlan.dateRecruitmentEnd"
          />
        </div>
        <div className="col-md-4 mt-0 mb-2 child">
          <input
            type="date"
            onChange={handleDateChange}
            value={handoverDeadline}
            onBlur={formData.handleBlur}
            className={`form-control text-center grey-text`}
            id="recruitmentPlan.handoverDeadline"
            name="recruitmentPlan.handoverDeadline"
          />
        </div>

      </>
    )
  }
  const Dlt = ({ index }) => {
    if (tech.length > 1) {
      return (
        <ClearIcon
          className="position-absolute oc-08 clr-danger hover-danger"
          sx={{ right: "55px", top: "6px" }}
          onClick={() => removeTech(index)}
        />
      );
    }
  };
  return (
    <>
      {check ? (
        <CreateIcon className="bg-whiteImportant pencil-btn font-size-medium" />
      ) : (
        <Tooltip title="Chỉnh sửa chi tiết">
          <CreateIcon
            className="color-orange pencil-btn font-size-medium hover-warning cursor-pointer"
            onClick={handleClickFormOpen}
          />
        </Tooltip>
      )}
      <Dialog
        id="formCreateRecruitmentPlan"
        open={openForm}
        onClose={handleClickFormClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          <form className="row g-3" onSubmit={formData.handleSubmit}>
            <div className="col-md-12">
              <h2 className="grey-text" style={{ paddingBottom: 3 }}>
                Cập nhật kế hoạch tuyển dụng
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
              <label htmlFor="name" className="form-label grey-text">
                Từ nhu cầu nhân sự
              </label>
              <input
                type="text"
                className='form-control grey-text'
                value={formData.values.recruitmentPlan.recruitmentRequest.name}
                readOnly
              />
            </div>
            <div className="col-md-12">
              <label htmlFor="name" className="form-label grey-text">
                Tên kế hoạch tuyển dụng <span className="color-red">*</span>
              </label>
              <input
                type="text"
                className='form-control grey-text'
                value={formData.values.recruitmentPlan.name}
                readOnly
              />
            </div>
            {!checkValidInput(formData.values.recruitmentPlan.name) && (
              <div>
                {/* Hiển thị thông báo lỗi */}
                <p
                  style={{ whiteSpace: "nowrap" }}
                  className="err-valid col-md-6"
                >
                  Độ dài tối đa là 60 ký tự.
                </p>
              </div>
            )}
            <div className="col-md-12  d-flex">
              <div className="col-md-4 mb-0">
                <label className="form-label grey-text">
                  Công nghệ <span className="color-red">*</span>
                </label>
              </div>
              <div className="col-md-4 mb-0 text-center">
                <label className="form-label grey-text">
                  Số lượng nhân sự cần tuyển{" "}
                  <span className="color-red">*</span>
                </label>
              </div>
              <div className="col-md-4 mb-0 text-center ">
                <label className="form-label grey-text">
                  Số lượng nhân sự đầu ra <span className="color-red">*</span>
                </label>
              </div>
            </div>
            {tech.map((tech, index) => (
              <>
                <div key={index} className="col-md-4 mt-0 mb-2 child">
                  <select
                    className="form-select grey-text"
                    aria-label="Default select example"
                    defaultValue="default"
                    value={tech.type}
                    onChange={(e) => handleChangeSelect(e, index)}
                    name={`tech[${index}].type`}
                  >
                    <option value={tech.type}>{tech.type}</option>
                    {listTechnology.map((item) => (
                      <option key={item.id} value={item.text}>
                        {item.text}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 text-center mt-0 mb-2   align-item-center">
                  <NumberOfPersonnelNeeded
                    number={tech.numberOfPersonnelNeeded}
                    key={tech.numberOfPersonnelNeeded}
                    idx={index}
                  />
                </div>
                <div className="col-md-4 text-center mt-0 mb-2  position-relative align-item-center">
                  <NumberOfOutputPersonnel
                    number={tech.numberOfOutputPersonnel}
                    key={tech.numberOfOutputPersonnel}
                    idx={index}
                  />
                  <Dlt index={index} />
                </div>
              </>
            ))}

            <div className="col-md-4 mt-0">
              {techErr && (
                <p style={{ whiteSpace: "nowrap" }} className="err-valid">
                  Công nghệ không được để rỗng
                </p>
              )}
            </div>
            <div className="col-md-4 mt-0 text-center">
              {errNumberOfPersonal && (
                <p style={{ whiteSpace: "nowrap" }} className="err-valid">
                  Số lượng phải lớn hơn 0
                </p>
              )}
            </div>
            <div className="col-md-4 mt-0 text-center">
              {errNumberofOutput && (
                <p style={{ whiteSpace: "nowrap" }} className="err-valid">
                  Số lượng phải lớn hơn 0
                </p>
              )}
            </div>

            <div className="col-md-12 mt-2" onClick={addTech}>
              <p className="grey-text plusTech mb-0">Thêm công nghệ +</p>
            </div>
            <div className="col-md-12  d-flex">
              <div className="col-md-4 mb-0">
                <label className="form-label grey-text">
                  Thời hạn tuyển dụng <span className="color-red">*</span>
                </label>
              </div>
              <div className="col-md-4 mb-0 text-center">
                <label className="form-label grey-text">
                  Thời hạn bàn giao <span className="color-red">*</span>
                </label>
              </div>
              <div className="col-md-4 mb-0 text-center">
                <label className="form-label"></label>
              </div>
            </div>
            <TimeRecruitment />
            <div className="col-md-4 mb-2 mt-0">
              <div className="send text-right mt-0">
                <div className="send-child position-relative">
                  <button type="submit" className="btn send-btn btn-success ">
                    Gửi
                    <SendIcon className="iconSend position-absolute" />
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-8 text-center mt-0">
              {dateErr && (
                <p className="err-valid ws-nowrap ">
                  Thời hạn bàn giao phải lớn hơn thời hạn tuyển dụng tối thiểu 75 ngày
                </p>
              )}
            </div>
          </form>
        </DialogTitle>
      </Dialog>
    </>
  );
}