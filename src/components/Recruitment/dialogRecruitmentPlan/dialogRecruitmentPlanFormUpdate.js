import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import RemoveIcon from "@mui/icons-material/Remove";
import { Dialog, DialogTitle, IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import axios from "axios";
import { useFormik } from "formik";
import swal from "sweetalert";

export default function DialogRecruitmentPlanFormUpdate({ check, id,userRoles,idUser }) {
  const [dateErr, setDateErr] = useState(false);
  const [techErr, setTechErr] = useState(false);
  const [errNumberOfPersonal, setErrNumberOfPersonal] = useState(false);
  const [errNumberofOutput, setErrNumberOfOutput] = useState(false);
  const [errNameRecruitmentPlan, setErrNameRecruitmentPlan] = useState(false);
  const [errIdPersonalNeed, setErrIdPersonalNeed] = useState(false);
  const [errNumber, setErrNumber] = useState(false);
  

  // Xử lý số lượng nhân sự
  const checkValid = (dateSet, techArr, dateCreate, nameRecruitmentPlan, personalneed) => {
    const futureDate = new Date(dateCreate);
    futureDate.setDate(dateCreate.getDate() + 75);
    // 
  
    var hasErrPersonalNeeds;
    if (personalneed === "" || personalneed === null || personalneed === "default") {
      hasErrPersonalNeeds = true;
      setErrIdPersonalNeed(true);
    } else {
      hasErrPersonalNeeds = false;
      setErrIdPersonalNeed(false);
    }

    // 
    const errTech = techArr.map(item => {
      if (item.type === "" || item.type === "default") {
        return true;
      } else {
        return false;
      }
    })
    const hasErrTech = errTech.some(item => item === true);
    setTechErr(hasErrTech);
    // 
    const errNumberR = techArr.map(item => {
      if (item.numberOfPersonnelNeeded !== "" && item.NumberOfOutputPersonnel !== "" && item.numberOfPersonnelNeeded !== 0 && item.NumberOfOutputPersonnel !== 0) {
        return item.numberOfPersonnelNeeded < item.numberOfOutputPersonnel;
      } else {
        return false;
      }
    })
    console.log(errNumberR);
    const hasErrNumber = errNumberR.some(item => item === true);
    console.log(hasErrNumber);
    setErrNumber(hasErrNumber)
    //
    var hasErrOfPersonal;
    if (!hasErrNumber) {
      const errNumberPersonal = techArr.map(item => {
        if (item.numberOfPersonnelNeeded === 0 || item.numberOfPersonnelNeeded === "" || item.numberOfPersonnelNeeded < 0) {
          return true;
        } else {
          return false;
        }
      })
      hasErrOfPersonal = errNumberPersonal.some(item => item === true);
      setErrNumberOfPersonal(hasErrOfPersonal);
    } else {
      hasErrOfPersonal = false;
      setErrNumberOfPersonal(false);
    }
    // 
    var hasErrNumberOutput;
    if (!hasErrNumber) {
      const errNumberOutput = techArr.map(item => {
        if (item.numberOfOutputPersonnel === 0 || item.numberOfOutputPersonnel === "" || item.numberOfOutputPersonnel < 0) {
          return true;
        } else {
          return false;
        }
      })
      hasErrNumberOutput = errNumberOutput.some(item => item === true)
      setErrNumberOfOutput(hasErrNumberOutput);
    } else {
      hasErrNumberOutput = false;
      setErrNumberOfOutput(false);
    }
    //  

    var hasErrRecruitmentPlan;
    if (nameRecruitmentPlan === "") {
      hasErrRecruitmentPlan = true;
      setErrNameRecruitmentPlan(true);
    } else {
      hasErrRecruitmentPlan = false;
      setErrNameRecruitmentPlan(false);
    }


    if (dateSet < futureDate || dateSet === "Invalid Date") {
      setDateErr(true);
    } else {
      setDateErr(false);
    }


    if (dateSet < futureDate || dateSet === "Invalid Date" || hasErrTech || hasErrNumberOutput || hasErrOfPersonal || hasErrRecruitmentPlan || hasErrPersonalNeeds || hasErrNumber) {
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
      idUser: idUser,
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
      values.idUser = idUser;
      console.log(values.recruitmentPlan.recruitmentRequest.id);
      const personalneed = values.recruitmentPlan.recruitmentRequest.id;
      const nameRecruitmentPlan = values.recruitmentPlan.name;
      if (values.recruitmentPlan.dateRecruitmentEnd === '') {
        values.recruitmentPlan.dateRecruitmentEnd = dateRecruitmentEnd;
      }
      if (values.recruitmentPlan.handoverDeadline === '') {
        values.recruitmentPlan.handoverDeadline = handoverDeadline;
      }
      const date = new Date(values.recruitmentPlan.handoverDeadline);
      const dateCreate = new Date(values.recruitmentPlan.dateRecruitmentEnd);
      // checkValid(date, tech, dateCreate, nameRecruitmentPlan, personalneed)
      // setSubmitting(false);
      // return;
      if (!checkValid(date, tech, dateCreate, nameRecruitmentPlan, personalneed)) {
        setSubmitting(false);
        return;
      } else if (!checkValidInput(values.recruitmentPlan.name)) {
        setSubmitting(false);
        return;
      } else {
        // Dữ liệu hợp lệ, tiến hành gửi dữ liệu
        try {
          values.planDetails = [...tech];
          setSubmitting(true);
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
      setHandoverDeadline(res.data.recruitmentPlan.handoverDeadline);
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
  const hasRoleAdmin = () => {
    return userRoles.some((role) => role.authority === "ROLE_ADMIN"|| role.authority === "ROLE_QLĐT");
  };
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
    if (number === "" || number === 0) {
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
    if (count > 60) {
      handleQuantityOffPersonal(60, index);
    } else {
      handleQuantityOffPersonal(count, index);
    }
  };
  // Hàm dữ liệu cần tuyển
  function NumberOfPersonnelNeeded({ number, idx }) {
    if (number === "" || number === 0) {
      number = 0;
    }
    const [countOf, setCountOf] = useState(number);
    const handleClickCountPlus = () => {
      if (number < 60 || countOf < 60) {
        setCountOf(countOf + 1);
        handleQuantityOffPersonal(parseInt(number) + 1, idx);
      }
    };
    const handleInputChange = (e) => {
      if (e.target.value <= 60) {
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

  const [handoverDeadline, setHandoverDeadline] = useState("");

  const timeNow = new Date();
  const year = timeNow.getFullYear();
  const month = String(timeNow.getMonth() + 1).padStart(2, '0'); // Tháng phải có 2 chữ số
  const day = String(timeNow.getDate()).padStart(2, '0'); // Ngày phải có 2 chữ số
  const timeNowValue = `${year}-${month}-${day}`;
  const [dateRecruitmentEnd, setRecuitmentDateEnd] = useState(timeNowValue);

  const handleDateChange = (event) => {
    if (event.target.name === 'recruitmentPlan.dateRecruitmentEnd') {
      setRecuitmentDateEnd(event.target.value);
    } else if (event.target.name === 'recruitmentPlan.handoverDeadline') {
      setHandoverDeadline(event.target.value);
      // 
      const timeChange = new Date(event.target.value);
      timeChange.setDate(timeChange.getDate() - 75);
      const yearChange = timeChange.getFullYear();
      const monthChange = String(timeChange.getMonth() + 1).padStart(2, '0'); // Tháng phải có 2 chữ số
      const dayChange = String(timeChange.getDate()).padStart(2, '0'); // Ngày phải có 2 chữ số
      const timeChangeValue = `${yearChange}-${monthChange}-${dayChange}`;
      // 
      if (timeChange < timeNow) {
        setRecuitmentDateEnd(timeNowValue);
        formData.handleChange({
          target: {
            name: 'recruitmentPlan.dateRecruitmentEnd',
            value: timeNowValue
          }
        });
      } else {

        setRecuitmentDateEnd(timeChangeValue);
        formData.handleChange({
          target: {
            name: 'recruitmentPlan.dateRecruitmentEnd',
            value: timeChangeValue
          }
        });
      }
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
            min={timeNowValue}
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
      {hasRoleAdmin() && (
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
              {/* <select
                className="form-select grey-text"
                aria-label="Default select example"
                onChange={(event) => handleChangeRecruitmentNeeds(event)}
                value={chooseRecruitmentNeeds}
                name="recruitmentPlan.recruitmentRequest.id"
                id="recruitmentPlan.recruitmentRequest.id"
              >
                <option value="default">Chọn nhu cầu nhân sự</option>
                {recuitments.filter(item => item.status != "Bị từ chối bởi DET").map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select> */}
              <input
                readOnly
                value={formData.values.recruitmentPlan.recruitmentRequest.name}
                type="text"
                className='form-control grey-text'
              />
              <div className="col-md-8  mt-0">
                {errIdPersonalNeed && (
                  <p className="err-valid ws-nowrap ">
                    Nhu cầu không được để trống
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-12">
              <label htmlFor="name" className="form-label grey-text">
                Tên kế hoạch tuyển dụng <span className="color-red">*</span>
              </label>
              <input
                value={formData.values.recruitmentPlan.name}
                maxLength={60}
                type="text"
                placeholder="Ví dụ: DECEN - Kế hoạch tuyển dụng quý 3/2021"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur} // Thêm onBlur để kiểm tra lỗi khi trường dữ liệu bị mất trỏ
                className='form-control grey-text'
                id="recruitmentPlan.name"
                name="recruitmentPlan.name"
              />
            </div>
            <div className="col-md-8  mt-0">
              {errNameRecruitmentPlan && (
                <p className="err-valid ws-nowrap ">
                  Tên kế hoạch không được để trống
                </p>
              )}
            </div>

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
                  Công nghệ không được để trống
                </p>
              )}
            </div>
            {errNumber && (
              <div className="col-md-8  mt-0 text-center">

                <p className="err-valid ws-nowrap ">
                  Số lượng cần tuyển phải lớn hơn số lượng đầu ra
                </p>
              </div>
            )}
            {errNumberOfPersonal &&
              <div className="col-md-4 mt-0 text-center">
                <p style={{ whiteSpace: 'nowrap' }} className="err-valid">Số lượng phải lớn hơn 0</p>
              </div>
            }
            {errNumberofOutput &&
              <div className="col-md-4 mt-0 text-center">
                <p style={{ whiteSpace: 'nowrap' }} className="err-valid">Số lượng phải lớn hơn 0</p>
              </div>
            }

            <div className="col-md-12 mt-2 " >
              <p className="grey-text plusTech mb-0 w-160 cursor-pointer" onClick={addTech}>Thêm công nghệ +</p>
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
                  <button type="submit" className="btn send-btn btn-success text-center">
                    Lưu
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
