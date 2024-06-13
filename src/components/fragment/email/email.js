import { useEffect, useRef, useState } from "react";
import emailjs from '@emailjs/browser';
import axios from 'axios';
import {sendNotifications} from "../../Notification/notification";

export default function Email() {
    const [toSend, setToSend] = useState([]);
    const [dataSendPersonalNeed, setDataSendPersonalNeed] = useState([]);
    const [dataSendRecruitmentPlan, setDataSendRecruitmentPlan] = useState([]);
    const intervalRef = useRef(null);
    const emailSentRef = useRef(false);
    const timeoutRef = useRef(null);

    const emailApi = () => {
        axios.get('http://localhost:8080/api/send/').then(res => {
            setToSend(res.data.emailData);
        })

    }

    useEffect(() => {
        emailApi();
    }, [])

    // Đang giới hạn số lượng mỗi template là 5 tin nhắn
    const check = () => {
        const recruitmentPlan = [];
        const personalNeed = [];
       var RP = 0;
       var PN = 0;
        toSend.forEach(item => {
            if (item.isRequest === 0 && RP < 5) {
                RP++;
                recruitmentPlan.push(item);
            }
            if (item.isRequest === 1  && PN <5) {
                PN++;
                personalNeed.push(item);
            }
        })
        setDataSendPersonalNeed(personalNeed);
        setDataSendRecruitmentPlan(recruitmentPlan);
    }

    useEffect(() => {
        check();
    }, [toSend])


    const serviceId = process.env.REACT_APP_API_SERVICE_ID;
    const templateIdRecruitmentPLan = process.env.REACT_APP_API_TEMPLATE_RECRUITMENT_PLAN_ID;
    const templateIdPersonalNeed = process.env.REACT_APP_API_TEMPLATE_PERSONAL_NEED_ID;
    const publicKey = process.env.REACT_APP_API_PUBLIC_KEY;
    const sendEmailBoth = (item, template) => {
        const templateParamsRcruitmentPLan = {
            to_email: item.toEmail,
            to_name: item.toName,
            intern_needs: item.internNeeds,
            intern_need_hand_over: item.internNeedHandOver,
            name_personal_needs: item.namePersonalNeeds,
            link_progress: item.linkProgress,
            date_start: item.dateStart,
            date_end: item.dateEnd,
            total_intern: item.totalIntern,
            pass_intern: item.passIntern,
            trainning_intern: item.trainingIntern,
            hand_over_intern: item.handOverIntern,
            fail_intern: item.failIntern,
            not_trainning_intern: item.notTrainingIntern
        }
        emailjs.send(serviceId, template, templateParamsRcruitmentPLan, publicKey).then(
            (response) => {

                console.log('Success!', response);
            }, (error) => {
                console.log(error.text);
            }
        )
    }
    const sendEmailsSequentially = async (data, templateId) => {
        const delay = 1000; // thời gian chờ giữa các email (ms)
        for (const item of data) {
            await sendEmailBoth(item, templateId);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    };

    const sendNotificationToUser = async () => {
        dataSendRecruitmentPlan.map((item) => {
            sendNotifications(
                null,
                `Bạn vửa có email mới từ kế hoạch tuyển dụng <b>${item.namePersonalNeeds}</b>`,
                null,
                null,
                "https://mail.google.com/",
                [item.toEmail])
        })
        dataSendPersonalNeed.map((item) => {
            sendNotifications(
                null,
                `Bạn vửa có email mới từ nhu cầu <b>${item.namePersonalNeeds}</b>`,
                null,
                null,
                "https://mail.google.com/",
                [item.toEmail]
            )
        })
    }

    useEffect(() => {
        const checkAndSendEmails = () => {
            const dayNow = new Date();
            const hoursCheck = dayNow.getHours();
            const minutesCheck = dayNow.getMinutes();

            const sendPersonalNeedEmails = () => {
                return sendEmailsSequentially(dataSendPersonalNeed, templateIdPersonalNeed);
            };

            const sendRecruitmentPlanEmails = () => {
                return sendEmailsSequentially(dataSendRecruitmentPlan, templateIdRecruitmentPLan);
            };

            // Kiểm tra gửi email vào phút thứ 50
            if (hoursCheck === 13 && minutesCheck === 50 && !emailSentRef.current) {
                sendPersonalNeedEmails()
                    .then(() => sendRecruitmentPlanEmails())
                    .then(sendNotificationToUser)
                    .then(() => {
                        emailSentRef.current = true;
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                    })
                    .catch(error => {
                        console.error('Lỗi khi gửi email:', error);
                    });
            }
        };

        // Thiết lập interval để kiểm tra mỗi phút
        intervalRef.current = setInterval(checkAndSendEmails, 60 * 1000);
        // Hàm để đặt lại emailSentRef sau 24 giờ
        const resetEmailSentRef = () => {
            emailSentRef.current = false;
            console.log('Email sent flag reset');
        };

        // Thiết lập timeout để reset emailSentRef sau 24 giờ
        const resetTimeout = () => {
            setTimeout(resetEmailSentRef,  30 * 1000);
        };

        // Gọi resetTimeout ngay khi component mount
        resetTimeout();

        // Dọn dẹp interval khi component bị unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return null;
}