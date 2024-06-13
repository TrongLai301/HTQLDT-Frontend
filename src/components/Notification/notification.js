import NotificationsIcon from "@mui/icons-material/Notifications";
import * as React from "react";
import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale-extreme.css';
import './notification.scss'
import {useEffect, useRef, useState} from "react";
import {Tooltip} from "@mui/material";
import axios from "axios";
import {MoreVert, NotificationsNone, NotificationsPaused} from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import {NotificationItem} from "./notificationItem";
import {useNavigate} from "react-router-dom";
import {SubmenuNotification} from "./submenuNotification";


export function Notification() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('all');
    const notiNumber = useRef(0);
    const handleToggle = () => {
        getDatas()
        setOpen(!open)
    }


    const [renderData, setRenderData] = useState(
        [
            //     {
            //         id: 1,
            //         content: "Nhu cầu nhân sự abc xyz vừa bị từ chối",
            //         timestamp: "1 phút trước",
            //         link: "",
            //         isRead: false,
            //     }, {
            //     id: 2,
            //     content: "Nhu cầu nhân sự tháng 3 vừa cập nhật trạng thái: Bị từ chối bởi DET. ",
            //     timestamp: "1 giờ trước",
            //     isRead: false,
            //     link: '/'
            // }, {
            //     id: 3,
            //     content: "Nhu cầu nhân sự tháng 3 vừa cập nhật trạng thái: Đang tuyển dụng",
            //     timestamp: "5 giây trước",
            //     isRead: false,
            // }, {
            //     id: 4,
            //     content: "Nhu cầu nhân sự abc xyz vừa bị tử chối",
            //     timestamp: "3 ngày trước",
            //     isRead: true,
            // }, {
            //     id: 5,
            //     content: "Nhu cầu nhân sự abc xyz vừa bị tử chối",
            //     timestamp: "5 ngày trước",
            //     isRead: true,
            // }, {
            //     id: 6,
            //     content: "Nhu cầu nhân sự abc xyz vừa bị tử chối",
            //     timestamp: "5 ngày trước",
            //     isRead: true,
            // }, {
            //     id: 7,
            //     content: "Nhu cầu nhân sự abc xyz vừa bị tử chối",
            //     timestamp: "5 ngày trước",
            //     isRead: true,
            // }, {
            //     id: 8,
            //     content: "Nhu cầu nhân sự abc xyz vừa bị tử chối",
            //     timestamp: "5 ngày trước",
            //     isRead: true,
            // }, {
            //     id: 9,
            //     content: "Nhu cầu nhân sự abc xyz vừa bị tử chối",
            //     timestamp: "5 ngày trước",
            //     isRead: true,
            // },
        ]
    );
    const navigate = useNavigate();
    const StyledIconWrapper = styled(Box)(({theme}) => ({
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',

        '&::before': {
            content: notiNumber.current > 0 ? `"${notiNumber.current}"` : "''",
            position: 'absolute',
            right: 2,
            top: 3,
            width: '40%',
            height: '40%',
            backgroundColor: notiNumber.current > 0 ? 'rgba(255, 0, 0, 0.83)' : 'transparent',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            color: 'white'
        }
    }));

    const markReaded = async (index) => {
        renderData[index].isRead = true
        sendDatas()
        // await setRenderData([...renderData])
    }
    const markAllReaded = async () => {
        renderData.map((item,index) => {
            console.log(`${index} before` + item.isRead)
            item.isRead = true
            console.log(`${index} after` + item.isRead)
        })
        await setRenderData([...renderData])
    }


    useEffect(() => {
        if (renderData) {
            sendDatas().then(getDatas)
        }
    }, [type]);

    const sendDatas = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/api/notifications/${currentUser.id}`, renderData);
        } catch (error) {
            console.error('Error sending data:', error);
        }
    };
    const getDatas = () => {
        axios.get(`http://localhost:8080/api/notifications/${currentUser.id}`, {
            params: {
                type: type
            }
        }).then(
            response => {
                findNotiNumber(response.data)
                setRenderData(response.data);
            }
        )
    };

    const findNotiNumber = (data) => {
        notiNumber.current = 0;
        data.map(data => {
            if (data.isRead === false) {
                notiNumber.current++
            }
        })
    }
    return (
        <Tippy
            placement={"bottom-end"}
            onClickOutside={() => {
                sendDatas().then(handleToggle)
            }}
            visible={open}
            interactive
            render={() => (
                <div className={"notification-container"}>
                    <div className={"wrapper"}>
                        <div className={"header"}>
                            <div className={'top-header'}>
                                <h4 className={"title"}>Thông báo</h4>
                                <SubmenuNotification markAllReaded={() => {markAllReaded().then(sendDatas())}}/>
                            </div>
                            <div className={"btns"}>
                                <div
                                    className={type === 'all' ? 'btn selected' : 'btn '}
                                    onClick={() => {
                                        setType('all')
                                    }}
                                >
                                    Tất cả
                                </div>
                                <div
                                    className={type === 'un_read' ? 'btn selected' : 'btn'}
                                    onClick={() => {
                                        setType('un_read')
                                    }}
                                >
                                    Chưa đọc
                                </div>
                            </div>
                        </div>
                        <div className={"body"}>
                            {renderData.length > 0 ? (
                                renderData.map((notiItem, index) => (
                                    <NotificationItem
                                        isRead={notiItem.isRead}
                                        id={notiItem.id}
                                        content={notiItem.content}
                                        timestamp={notiItem.timestamp}
                                        clickIn={() => {
                                            markReaded(index).then(sendDatas().then(() => {
                                                if (notiItem.link) {
                                                    if (notiItem.link.indexOf("mail.google.com") >= 0) {
                                                        window.location.href = `https://mail.google.com/`
                                                    } else  {
                                                        window.location.href = `http://localhost:3000${notiItem.link}`
                                                    }
                                                }
                                            }))
                                        }}
                                        markReadFunc={() => {markReaded(index)}}
                                        index={index}
                                        link={notiItem.link}
                                    />
                                ))
                            ) : (
                                <div className={"noti-placeholder"}>
                                    <div className={"icon"}>
                                        <NotificationsPaused/>
                                    </div>
                                    <div>Hiện không có thông báo nào</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}>
            <StyledIconWrapper onClick={handleToggle} className={'notificateIcon'}>
                {open ?
                    <NotificationsIcon sx={{fontSize: '35px'}}/>
                    :
                    <NotificationsNone sx={{fontSize: '35px'}}/>
                }
            </StyledIconWrapper>
        </Tippy>
    )
}

// Hàm gửi thông báo
// Nếu set giá trị cho cả listReceiverID và roleReceiver thì sẽ lấy theo listReceiverID
export async function sendNotifications(
    creatorId,
    content,
    roleReceiver,
    listReceiverId,
    link,
    listReceiverEmail,
) {
    var date = new Date()
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const notificationInfo = {
        creatorId: creatorId ,
        content: content,
        listRoleReceiver: roleReceiver,
        listReceiverId: listReceiverId,
        timeCreate: date.toISOString(),
        link: link,
        listReceiverEmail: listReceiverEmail,
    }
    await axios.post('http://localhost:8080/api/notifications', notificationInfo)
}