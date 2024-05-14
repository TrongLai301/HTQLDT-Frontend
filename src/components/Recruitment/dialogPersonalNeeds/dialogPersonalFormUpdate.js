import { Dialog, DialogTitle, Grid, IconButton, MenuItem, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import RemoveIcon from "@mui/icons-material/Remove";
import CreateIcon from "@mui/icons-material/Create";
import BackspaceIcon from "@mui/icons-material/Backspace";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup"
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
export default function DialogPersonalFormUpdate({ id, check }) {
  const [dateErr, setDateErr] = useState(false);
  const [techErr, setTechErr] = useState(false);
  const [quantityErr, setQuantityErr] = useState(false);


  const checkValid = (dateEnd, dateStart, techArr) => {
    const dateStartChange = new Date(dateStart);
    dateStartChange.setHours(0, 0, 0, 0);
    const futureDate = new Date(dateStartChange);
    futureDate.setDate(dateStartChange.getDate() + 75);

    const dateEndChange = new Date(dateEnd);
    dateEnd.setHours(0, 0, 0, 0);
    const dateSet = new Date(dateEndChange)
    const errTech = techArr.map(item => {
      if (item.type === "" || item.type === "default") {
        return true;
      } else {
        return false;
      }
    })
    const hasErrTech = errTech.some(item => item === true);
    setTechErr(hasErrTech);
    const errQuantity = techArr.map(item => {
      if (item.quantity == 0 || item.quantity === "" || item.quantity < 0) {
        return true;
      } else {
        return false;
      }
    })
    const hasErrQuantity = errQuantity.some(item => item === true);
    setQuantityErr(hasErrQuantity);

    if (dateSet < futureDate || dateSet == "Invalid Date") {
      setDateErr(true);
    } else {
      setDateErr(false);
    }


    if (dateSet < futureDate || hasErrTech || dateSet == "Invalid Date" || hasErrQuantity) {
      return false;
    } else {
      return true;
    }



  }
  const navigate = useNavigate();
  // Xử lý số lượng nhân sự
  const formData = useFormik({
    initialValues: {
      idUser: null,
      recruitmentRequest: {
        dateStart: "",
        dateEnd: "",
        name: "",
        status: "",
        details: [
          {
            type: "",
            quantity: "",
          },
        ],
      },
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false);
      const dateEnd = new Date(values.recruitmentRequest.dateEnd);
      const dateStart = new Date(values.recruitmentRequest.dateStart);
      if (!checkValid(dateEnd, dateStart, tech)) {
        setSubmitting(false);
        return;
      } else {
        // Dữ liệu hợp lệ, tiến hành gửi dữ liệu
        values.details = [...tech];
        console.log(values);
        try {
          await axios.put("http://localhost:8080/api/recruitmentRequests/" + id, values).then(res => {
            swal(" cập nhật nhu cầu nhân sự thành công", {
              icon: "success",
              buttons: false,
              timer: 2000
            }).then(() => {
              window.location.href = "/recruitment/personalNeeds";
            });
          });
        } catch (error) {
          swal("cập nhật nhu cầu nhân sự thất bại", {
            icon: "error",
            buttons: false,
            timer: 2000
          });
        }
      }
    }
  });

  function PersonalQuantity({ number, onQuantityChange }) {
    if (number === "" || number == 0) {
      number = 0;
    }
    const [count, setCount] = useState(number);
    const handleClickCountPlus = () => {
      setCount(count + 1);
      onQuantityChange(count + 1);
    };
    const handleInputChange = (e) => {
      const newCount = parseInt(e.target.value);
      setCount(newCount);
      onQuantityChange(newCount);
    };
    const handleClickCountMinus = () => {
      if (!count <= 0) {
        setCount(count - 1);
        onQuantityChange(count - 1);
      }
    };
    return (
      <div className="d-flex justify-content-center align-items-center">
        <RemoveIcon onClick={handleClickCountMinus} className="me-1" />
        <input
          value={count}
          style={{ fontSize: "15px", height: "36px" }}
          className="form-control w-25 border-clr-grey border text-center"
          type="number"
          onChange={handleInputChange}
        />
        <AddIcon onClick={handleClickCountPlus} className="ms-1" />
      </div>
    );
  }
  const handleQuantityChange = (newQuantity, index) => {
    const updatedTech = [...tech];
    updatedTech[index].quantity = newQuantity;
    setTech(updatedTech);
  };
  const Dlt = ({ index }) => {
    if (tech.length > 1) {
      return (
        <BackspaceIcon className="position-absolute oc-08 clr-danger hover-danger" sx={{right: '55px' , top: '6px'}} onClick={() => removeTech(index)} />
      )
    }
  }
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

  const listTestSelect = [
    { id: 1, text: "Trạng thái" },
    { id: 2, text: "Bị từ chối bởi DET" },
    { id: 3, text: "Đã gửi" },
  ];
  const [openForm, setOpenForm] = useState(false);
  const handleClickFormOpen = () => {
    setOpenForm(true);
  };
  const handleClickFormClose = () => {
    setOpenForm(false);
  };
  // Xử lý thêm công nghệ
  const [tech, setTech] = useState([]);
  const addTech = () => {
    setTech((prevTech) => [...prevTech, { type: "", quantity: "" }]);
  };

  const removeTech = (index) => {
    const updateTech = tech.filter((_, idx) => idx !== index);
    setTech(updateTech);
  };
  const handleChangeSelect = (e, index) => {
    const updateTech = [...tech];
    updateTech[index] = { ...updateTech[index], type: e.target.value };
    setTech(updateTech);
  }
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/recruitmentRequests/" + id)
      .then((res) => {
        formData.setValues(res.data);
        const detail = res.data.details;
        setTech(
          detail.map((item) => ({ type: item.type, quantity: item.quantity }))
        );
      });
  }, []);

  return (
    <>
      <Tooltip title="Chỉnh sửa chi tiết">
        {check ? <CreateIcon
          className="bg-whiteImportant pencil-btn font-size-medium"
        /> : <CreateIcon
          className="color-orange pencil-btn font-size-medium hover-warning"
          onClick={handleClickFormOpen}
        />}
      </Tooltip>
      <Dialog
        open={openForm}
        onClose={handleClickFormClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          <form className="row g-3" onSubmit={formData.handleSubmit}>
            <div className="col-md-12">
              <h2 className="grey-text" style={{ paddingBottom: 3 }}>
                Cập nhật nhu cầu nhân sự
              </h2>
              <IconButton
                sx={{
                  position: "absolute",
                  right: 0,
                  top: 0,
                }}
                onClick={handleClickFormClose}
              >
                <ClearIcon />
              </IconButton>
            </div>
            <div className="col-md-12">
              <label htmlFor="name" className="form-label grey-text">
                Tên <span className="color-red">*</span>
              </label>
              <input
                type="text"
                onChange={formData.handleChange}
                onBlur={formData.handleBlur} // Thêm onBlur để kiểm tra lỗi khi trường dữ liệu bị mất trỏ
                value={formData.values.recruitmentRequest.name}
                className={`form-control`}
                id="recruitmentRequest.name"
                name="recruitmentRequest.name"
              />
            </div>
            <div className="col-md-12 m-0 d-flex">
              <div className="col-md-6 mb-0">
                <label className="form-label grey-text">
                  Công nghệ <span className="color-red">*</span>
                </label>
              </div>
              <div className="col-md-6 mb-0 text-center">
                <label className="form-label grey-text">
                  Số lượng nhân sự <span className="color-red">*</span>
                </label>
              </div>
            </div>
            {tech.map((tech, index) => (
              <>
                <div key={index} className="col-md-6 mt-0 mb-2 last-child">
                  <select
                    className="form-select grey-text"
                    value={tech.type}
                    aria-label="Default select example"
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
                <div className="col-md-6 text-center mt-0 mb-2 d-flex position-relative align-item-center">
                  <PersonalQuantity
                    number={tech.quantity}
                    key={tech.quantity}
                    onQuantityChange={(newQuantity) =>
                      handleQuantityChange(newQuantity, index)
                    }
                  />
                  <Dlt index={index} />
                </div>
              </>
            ))}
            <div className=" col-md-12 d-flex justify-content-between mt-0">
              <div>
                {techErr && <p style={{ whiteSpace: 'nowrap' }} className="err-valid col-md-6">Công nghệ không được để rỗng</p>}
              </div>
              <div>
                {quantityErr && <p style={{ whiteSpace: 'nowrap' }} className="err-valid justify-content-end col-md-6">Số lượng phải bé hơn 0</p>}
              </div>
            </div>
            <div className="col-md-12 mt-2" onClick={addTech}>
              <p className="grey-text plusTech mb-0">Thêm công nghệ +</p>
            </div>
            <div className="col-md-12">
              <div className="col-md-6 mt-2">
                <label htmlFor="time" className="form-label grey-text">
                  Thời hạn bàn giao <span className="color-red">*</span>
                </label>
                <input
                  type="date"
                  value={formData.values.recruitmentRequest.dateEnd}
                  onChange={formData.handleChange}
                  onBlur={formData.handleBlur}
                  className={`form-control text-center grey-text`}
                  id="recruitmentRequest.dateEnd"
                  name="recruitmentRequest.dateEnd"
                />
                {dateErr && <p className="err-valid ">Thời hạn bàn giao phải tối thiểu 75 ngày</p>}
              </div>
            </div>
            <div className="col-md-6 mt-2 pr-0">
              <label htmlFor="status" className="form-label grey-text">
                Trạng thái
              </label>
              <select
                value={formData.values.recruitmentRequest.status}
                onChange={formData.handleChange}
                className="form-select grey-text"
                aria-label="Default select example"
                name="recruitmentRequest.status"
                id="recruitmentRequest.status"
              >
                {listTestSelect.map((item) => (
                  <option key={item.id} value={item.text}>
                    {item.text}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mt-2">
              <label className="form-label"></label>
              <div className="send text-right">
                <div className="send-child position-relative">
                  <button type="submit" className="btn send-btn btn-success text-center">
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </form>
        </DialogTitle>
      </Dialog>
    </>
  );
}