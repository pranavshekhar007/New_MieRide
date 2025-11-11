import React, { useState, useEffect } from "react";
import {
  getChatSupportCategoryListServ,
  addCategoryServ,
} from "../services/support.services";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import Ably from "ably";
function ChatSidebar({ selectedItem }) {
  const navigate = useNavigate();
  const [showSkelton, setShowSkelton] = useState(false);
  const [list, setList] = useState([]);
  const getListFunc = async () => {
    if (list.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getChatSupportCategoryListServ();
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };
  useEffect(() => {
    getListFunc();
  }, []);
   useEffect(() => {
        getListFunc();
        // Initialize Ably client with the API key
        const ably = new Ably.Realtime(
          "cgbtZA.AQetNw:hE5TCgJHH9F4gWbFqv6pD5ScBM-A_RnW0RQG7xwQg-Y"
        );
    
        // Helper to subscribe to a channel and its events
        const subscribeToChannel = (channelName, events) => {
          const channel = ably.channels.get(channelName);
          events.forEach((event) => {
            channel.subscribe(event, (message) => {
              console.log(
                `Received '${event}' real-time update on '${channelName}' channel:`,
                message.data
              );
              
              getListFunc();
            });
          });
          return channel;
        };
    
        // Channel-event mapping
        const channelEventMap = [
          {
            name: "admin-new-support-chat-case",
            events: ["new-support-case"],
          },
        ];
    
        // Subscribe to all channels and events
        const channels = channelEventMap.map(({ name, events }) =>
          subscribeToChannel(name, events)
        );
    
        return () => {
          ably.close();
        };
      }, []);
  return (
    <div className="chatSupportSidebarMain">
      <div className="mb-4 chatCategoryDiv">
        <h2 className="d-flex justify-content-between align-items-center">
          User Support{" "}
          <i
            className="fa fa-plus bg-light text-dark d-flex align-items-center justify-content-center"
            style={{
              height: "20px",
              width: "20px",
              borderRadius: "50%",
              paddingTop: "2px",
            }}
            onClick={() => alert("Work in progress")}
          ></i>
        </h2>
        {showSkelton
          ? [1, 2, 3, 4, 5]?.map((v, i) => {
              return (
                <div className="mb-1">
                  <Skeleton height={25} width={240} />
                </div>
              );
            })
          : list
              ?.filter((v, i) => {
                return v?.user_type == "user";
              })
              ?.map((v, i) => {
                return (
                  <div
                    className={
                      "chatSidebarItem d-flex align-items-center justify-content-between" +
                      (selectedItem == v?.id ? " chatSidebarActiveItem" : " ")
                    }
                    onClick={() => navigate("/chat-box/user/" + v?.id)}
                  >
                    <div className="d-flex align-items-center">
                      <i className="fa fa-circle"></i>
                      <span>{v?.name}</span>
                    </div>
                    {v?.unread_counts?.user >0 && (
                      <div className="chatCounter">
                        <p className="mb-0">{v?.unread_counts?.user}</p>
                      </div>
                    )}
                  </div>
                );
              })}
      </div>
      <div className="mb-4 chatCategoryDiv">
        <h2 className="d-flex justify-content-between align-items-center">
          Driver Support{" "}
          <i
            className="fa fa-plus bg-light text-dark d-flex align-items-center justify-content-center"
            style={{
              height: "20px",
              width: "20px",
              borderRadius: "50%",
              paddingTop: "2px",
            }}
            onClick={() => alert("Work in progress")}
          ></i>
        </h2>
        {showSkelton
          ? [1, 2, 3, 4, 5]?.map((v, i) => {
              return (
                <div className="mb-1">
                  <Skeleton height={25} width={240} />
                </div>
              );
            })
          : list
              ?.filter((v, i) => {
                return v?.user_type == "driver";
              })
              ?.map((v, i) => {
                return (
                  <div
                    className={
                      "chatSidebarItem d-flex align-items-center justify-content-between" +
                      (selectedItem == v?.id ? " chatSidebarActiveItem" : " ")
                    }
                    onClick={() => navigate("/chat-box/driver/" + v?.id)}
                  >
                    <div className="d-flex align-items-center">
                      <i className="fa fa-circle"></i>
                      <span>{v?.name}</span>
                    </div>
                   {v?.unread_counts?.driver >0 && (
                      <div className="chatCounter">
                        <p className="mb-0">{v?.unread_counts?.driver}</p>
                      </div>
                    )}
                  </div>
                );
              })}
      </div>
      <div>
        <h2 className="d-flex justify-content-between align-items-center">
          Website Support{" "}
        </h2>
      </div>
    </div>
  );
}

export default ChatSidebar;
