import Avatar from "@mui/material/Avatar";
import {Tooltip} from "@mui/material";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export function NotificationItem({id, content, timestamp, clickIn, index, isRead,link, markReadFunc} ) {
    const navigate = useNavigate();
    // const direct = async () => {
    //     await clickIn();
    //     if (link){
    //         // window.location.href = `http://localhost:3000${link}`
    //         navigate(link)
    //     }
    // }
    const [read, setRead] = useState(isRead)

    const markRead = (event) => {
        event.stopPropagation();
        setRead(!read);
        markReadFunc()
    }
    useEffect(() => {
        setRead(isRead)
    }, [isRead]);
    return (
        <div key={id} className={"noti-item"} onClick={clickIn}>
            <div className={"avatar"}>
                <Avatar
                    alt={"avatar"}
                    src={`https://picsum.photos/50/50?random=${index}`}
                />
            </div>
            <div>
                <div className={"content"} dangerouslySetInnerHTML={{__html: content}}></div>
                <div className={"time"}>{timestamp}</div>
            </div>
            {!read && (
                <Tooltip title={"Đánh dấu là đã đọc"}>
                    <div className={"read-doc"} onClick={markRead}></div>
                </Tooltip>
            )}
        </div>
    )
}