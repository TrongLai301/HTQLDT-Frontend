import { Dialog, DialogContent, DialogTitle, FormControl, NativeSelect } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import "./internpage.scss"
import DialogActions from "@mui/material/DialogActions";
import axios, { options } from "axios";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import _ from 'lodash'
import { sortedUniq } from "lodash/array";
import target from "lodash/seq";
import { useSnackbar } from "notistack";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CreateIcon from "@mui/icons-material/Create";
import '../../training/training.css'

export function MarkInternModal({ userID, updateFunction }) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const [open, setOpen] = useState(false)
    const { enqueueSnackbar } = useSnackbar();
    const [readOnly, setReadOnly] = useState(false)
    const finalScore = useRef()
    const passed = useRef()
    const [finalScoreValue, setFinalScoreValue] = useState();
    const [finalResultPass, setFinalResultPass] = useState(null);
    const [inValidSave, setInV21alidSave] = useState(false);

    const handleClose = () => {
        updateFunction()
        setOpen(false)
    };
    const handleListItemClick = (value) => {
        setOpen(false)
    };
    const [defaultData, setDefaultData] = useState();
    const [data, setData] = useState({
        name: '',
        startDate: "",
        endDate: "",
        trainingState: '',
        isPass: null,
        scoreInTeam: null,

        subjects: [
            { name: "Môn 1", theoryScore: '', practiceScore: '', attitudeScore: '' },
            { name: "Môn 2", theoryScore: '', practiceScore: '', attitudeScore: '' },
            { name: "Môn 3", theoryScore: '', practiceScore: '', attitudeScore: '' },
            { name: "Môn 4", theoryScore: '', practiceScore: '', attitudeScore: '' },
            { name: "Môn 5", theoryScore: '', practiceScore: '', attitudeScore: '' },
            { name: "Môn 6", theoryScore: '', practiceScore: '', attitudeScore: '' },
            { name: "Môn 7", theoryScore: '', practiceScore: '', attitudeScore: '' },
        ],
    })
    const handleTrainingStateChange = (event) => {
        if (event.target.value === 'trained') {
            const currentDate = new Date().toISOString().split('T')[0];
            setData({ ...data, trainingState: event.target.value, endDate: currentDate });
        } else {
            setData({ ...data, trainingState: event.target.value });
        }
    };
    const inputRegex = /^(10(\.0+)?|[0-9](\.[0-9])?|)$/;
    const handleTheoryScoreChange = (event, index) => {
        if (event.target.value.match(inputRegex)) {
            // setInValidSave(false)
            const updatedSubjects = [...data.subjects];
            updatedSubjects[index].theoryScore = event.target.value;
            setData({
                ...data,
                subjects: updatedSubjects
            });
        }
    }
    const handlePracticeScoreChange = (event, index) => {
        console.log(target.value)
        if (event.target.value.match(inputRegex)) {
            const updatedSubjects = [...data.subjects];
            updatedSubjects[index].practiceScore = event.target.value;
            setData({
                ...data,
                subjects: updatedSubjects
            });
        }
    }
    const handleAttitudeScoreChange = (event, index) => {
        console.log(target.value)
        if (event.target.value.match(inputRegex)) {
            const updatedSubjects = [...data.subjects];
            updatedSubjects[index].attitudeScore = event.target.value;
            setData({
                ...data,
                subjects: updatedSubjects
            });
        }
    }
    const handleScoreInTeamChange = (event) => {
        if (event.target.value.match(inputRegex)) {
            setData({
                ...data,
                scoreInTeam: event.target.value
            });
        }
    }

    finalScore.current = []
    passed.current = true

    function findTotal(theory, practice, attitude) {
        theory = parseFloat(theory);
        practice = parseFloat(practice);
        attitude = parseFloat(attitude);
        if (isNaN(theory) || isNaN(practice) || isNaN(attitude)) {
            passed.current = false
            return (<div className={"result"}>NA</div>)
        }

        let result = (theory + practice * 2 + attitude * 2) / 5
        result = parseFloat(result.toFixed(2)); // Làm tròn đến 2 chữ số sau dấu thập phân
       
        finalScore.current.push(result)
        if (result % 1 === 0) {
            result = result.toFixed(1)
        }
        if (result >= 7) {
            return (<div className={"result"}> {result}
                <div className={"result-icon success"}><FontAwesomeIcon icon={faCheck} /></div>
            </div>)
        } else {
            return (<div className={"result"}> {result}
                <div className={"result-icon fail"}><FontAwesomeIcon icon={faX} /></div>
            </div>)
        }
    }

    const param = useParams();

    const fetchFinalResultPass = (finalScore, inTeamScore) => {
        if (passed.current) {
            finalScore = parseFloat(finalScore);
            inTeamScore = parseFloat(inTeamScore);
            if (!isNaN(finalScore) && !isNaN(inTeamScore)) {
                let isPass = parseFloat(((finalScore + inTeamScore) / 2).toFixed(2));
                setFinalResultPass(isPass > 7)
            } else {
                setFinalResultPass(null)
            }
        } else {
            setFinalResultPass(null)
        }
    }

    useEffect(() => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + currentUser.accessToken;
        axios.get(`http://localhost:8080/api/interns/?id=${userID}`).then(res => {
            setData(res.data)
        })
    }, []);

    useEffect(() => {

        // axios.defaults.headers.common["Authorization"] = "Bearer " + currentUser.accessToken;
        // axios.get(`http://localhost:8080/api/interns/?id=${param.id}`).then(res => {
        //     // compareObjects(res.data,data);
        // }) 
        setFinalScoreValue(
            parseFloat(
                finalScore.current.reduce((a, b) => a + b, 0) / finalScore.current.length)
                .toFixed(2))
        fetchFinalResultPass(
            parseFloat(
                finalScore.current.reduce((a, b) => a + b, 0) / finalScore.current.length)
                .toFixed(2)
            , data.scoreInTeam, false)
    }, [data]);

    // Handle submit
    const handleSubmit = () => {

        let sendData;
        if (finalResultPass !== null) {
            const currentDate = new Date().toISOString().split('T')[0];
            sendData = { ...data, endDate: currentDate, isPass: finalResultPass };
        } else {
            sendData = { ...data }
        }
        axios.defaults.headers.common["Authorization"] = "Bearer " + currentUser.accessToken;
        axios.put('http://localhost:8080/api/interns', sendData).then(res => {
            enqueueSnackbar("Lưu thành công ! :D", {
                variant: "success",
                anchorOrigin: { horizontal: "right", vertical: "top" }
            })
            updateFunction()
            setOpen(false)
                ;
        }).catch(e => {
            enqueueSnackbar("Không thể lưu vui lòng thử lại sau! :((", {
                variant: "error",
                anchorOrigin: { horizontal: "right", vertical: "top" },
                autoHideDuration: 3000
            });
        })
    }
    // Hàm lấy ra ngày thực tập
    const getBusinessDay = (dateFrom, dateTo) => {
        let day = 0;
        if (new Date(null).toDateString() === dateTo.toDateString()) {
            dateTo = new Date()
        }

        for (var currentDate = new Date(dateFrom); currentDate <= dateTo; currentDate.setDate(currentDate.getDate() + 1)) {
            if (
                currentDate.toLocaleDateString('en-US', { weekday: "short" }) !== 'Sun'
                &&
                currentDate.toLocaleDateString('en-US', { weekday: "short" }) !== 'Sat'
            ) {
                day++;
            }
        }
        return (
            day >= 50 ?
                <span style={{ fontWeight: 600, color: "red", fontSize: '1.1rem' }}>{day}</span>
                :
                <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{day}</span>
        )
    }


    return (
        <>
            <RemoveRedEyeIcon
                onClick={() => {
                    setOpen(true);
                    setReadOnly(true)
                }}
                style={{ width: '27px', height: '27px', marginRight: '7px' }}
                className="color-blue white-div font-size-large hov" />
            <CreateIcon onClick={() => {
                setOpen(true);
                setReadOnly(false)
            }} style={{ width: '24px', height: '24px' }} className="hov color-orange pencil-btn font-size-medium" />
            <Dialog fullWidth maxWidth={'sm'} onClose={handleClose} open={open}>
                <DialogTitle key={2} sx={{ padding: "16px 24px 8px 24px  " }}>Kết quả học tập</DialogTitle>
                <DialogContent>
                    <div key={3} className={"flex-col"}>
                        <h6>Họ tên: {data.name}</h6>
                        <div className={"flex-row"}>
                            <p>Ngày bắt đầu: {data.startDate}</p>
                            <p style={{ paddingRight: '8px' }}>
                                Số ngày thực tập: {getBusinessDay(new Date(data.startDate), new Date(data.endDate))}
                            </p>
                        </div>
                        <p>Ngày kết thúc: {data.endDate ? data.endDate : "Chưa kết thúc"}</p>
                    </div>
                    {/*Modal body*/}
                    <div key={5} className={"table-score"}>
                        <div className={"flex flex-row justify-content-between"}>
                            <p className={"l"}>Môn học</p>
                            <p id={"theory"}>Lý thuyết</p>
                            <p>Thực hành</p>
                            <p>Thái độ</p>
                            <p>Tổng</p>
                        </div>
                        {data.subjects.map((subject, index) => {
                            return (
                                <div className={"flex flex-row justify-content-between"}>
                                    <p className={"table-score__item tl"}>{subject.name}</p>
                                    <div className={"table-score__item"}>
                                        {readOnly ?
                                            subject.theoryScore
                                            :
                                            (<input
                                                type={"number"}
                                                // onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                value={subject.theoryScore}
                                                onChange={(e) => {
                                                    handleTheoryScoreChange(e, index)
                                                }}
                                                className={"input-score "} />)}
                                    </div>
                                    <div className={"table-score__item"}>
                                        {readOnly ?
                                            subject.practiceScore
                                            :
                                            <input
                                                disabled={readOnly}
                                                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                type={"number"}
                                                value={subject.practiceScore}
                                                onChange={(e) => {
                                                    handlePracticeScoreChange(e, index)
                                                }}
                                                className={readOnly ? "input-score" : "input-score"} />
                                        }
                                    </div>
                                    <div className={"table-score__item"}>
                                        {readOnly ?
                                            subject.attitudeScore
                                            :
                                            <input
                                                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                type={"number"}
                                                value={subject.attitudeScore}
                                                onChange={(e => handleAttitudeScoreChange(e, index))}
                                                className={readOnly ? "input-score" : "input-score"} />
                                        }
                                    </div>
                                    <div className={"table-score__item"} style={{ position: "relative" }}>{
                                        findTotal(
                                            subject.theoryScore,
                                            subject.practiceScore,
                                            subject.attitudeScore)}
                                    </div>
                                </div>
                            )
                        })}

                        <div className={"flex flex-row justify-content-between"}>
                            <p className={"tb l"}>Tổng kết</p>
                            <p className={"table-score__item"}>
                                {finalScoreValue}
                            </p>
                        </div>
                        <div className={"flex flex-row justify-content-between"}>
                            <p className={"tb "}>Kết quả thực tập</p>
                            <p className={"table-score__item"}>
                                {finalResultPass === null ? "NA" : (finalResultPass ?
                                    <span style={{ color: "green" }}>Pass</span> :
                                    <span style={{ color: "red" }}>Fail</span>)}
                            </p>
                        </div>
                        <div className={"flex flex-row justify-content-between"}>
                            <p className={"tl"}>Đánh giá trên team</p>
                            <div className={"table-score__item "}>
                                {readOnly ?
                                    data.scoreInTeam
                                    :
                                    <input
                                        onChange={(e) => {
                                            handleScoreInTeamChange(e)
                                        }}
                                        type={"number"}
                                        value={data.scoreInTeam}
                                        className={"input-score"} />
                                }
                            </div>
                        </div>
                        <div className={"flex flex-row justify-content-between"}>
                            {readOnly ?
                                (data.trainingState === null
                                    ||
                                    data.trainingState === "training"
                                    ||
                                    data.trainingState === ""
                                ) ?
                                    <div>Đang thực tập</div> :
                                    <div>Đã hoàn thành</div>
                                :
                                <FormControl sx={{ width: '30%' }}>
                                    <NativeSelect
                                        disabled={readOnly}
                                        value={data.trainingState}
                                        onChange={handleTrainingStateChange}
                                        inputProps={{
                                            name: 'trainingState',
                                            id: 'uncontrolled-native',
                                        }}>
                                        <option value={'training'}>Đang thực tập</option>
                                        <option value={'trained'}>Đã hoàn thành</option>
                                        <option value={'stop_training'}>Đã dừng thực tập</option>
                                    </NativeSelect>
                                </FormControl>
                            }
                        </div>
                    </div>
                </DialogContent>
                <DialogActions sx={{ display: "flex" }}>
                    {!readOnly
                        &&
                        <button disabled={inValidSave} onClick={() => {
                            handleSubmit()
                        }} className={"save-btn"}>
                            LƯU
                        </button>
                    }
                </DialogActions>
            </Dialog>
        </>
    );
}