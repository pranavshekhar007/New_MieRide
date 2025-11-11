import React, { useEffect, useState } from "react";
import moment from "moment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../GlobalProvider";
import { useNavigate } from "react-router-dom";
import { getChatSupportListServ } from "../../services/support.services";
import NoRecordFound from "../../components/NoRecordFound";
import { updateNotificationStatusServ } from "../../services/notification.services";
import CustomTopNav from "../../components/CustomTopNav";
import NewSidebar from "../../components/NewSidebar";
import ChatSidebar from "../../components/ChatSidebar";
function ChatWelcomeScreen() {
  const { setGlobalState, globalState } = useGlobalState();
  const navItems = [
    [
      {
        name: "New Request",
        path: "/user-interac-deposite",
      },
      {
        name: "Active Chat",
        path: "/user-quick-deposite",
      },
      {
        name: "Close Chat",
        path: "/integrated-email",
      },
    ],
  ];
  return (
    <div className="mainBody">
      <NewSidebar selectedItem="Chat Support" />
      <div className="contentLayout">
        <div className="bgWhite borderRadius30  minHeight100vh">
          <div className="d-flex">
            {/* chat sidebar */}
            <ChatSidebar />
            <div className="chatSupportMain w-100 ms-4  d-flex align-items-center justify-content-center" style={{ height: "calc(100vh - 44px)"}}>
              <div>
                <div className="d-flex justify-content-center">
                  <img src="/imagefolder/chatBrand.png" style={{height:"140px"}} />
                </div>
                <h1 className="chatHeading mt-5">Welcome to Chat Support</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWelcomeScreen;
