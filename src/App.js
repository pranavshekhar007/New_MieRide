import React, { useEffect } from "react";
import { useGlobalState } from "./GlobalProvider";
import AuthenticatedRoutes from "./routes/AuthenticatedRoutes";
import UnAuthenticatedRoutes from "./routes/UnAuthenticatedRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import OneSignal from "react-onesignal";
import BlogList from "./pages/Blog/BlogList";
import BlogRoutes from "./routes/BlogRoutes";
import BroadcastRoutes from "./routes/BroadcastRoutes";
import PartialAdminRoutes from "./routes/PartialAdminRoutes";
// import OneSignal from "react-onesignal";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const initializeOneSignal = async () => {
      try {
        // Initialize OneSignal
        window.OneSignal = window.OneSignal || [];
        window.OneSignal.push(() => {
          window.OneSignal.init({
            appId: "3a0cabe7-cafc-42e4-a75e-2343a0cd50d1", // Your App ID
            serviceWorkerPath: "/OneSignalSDKWorker.js",
            notifyButton: { enable: true },
          });

          // Check if notifications are enabled
          if (window.OneSignal.isPushNotificationsEnabled) {
            window?.OneSignal?.isPushNotificationsEnabled((isEnabled) => {
              if (isEnabled) {
                console.log("Push notifications are already enabled.");
              } else {
                console.log(
                  "Push notifications are not enabled. Prompting user..."
                );
                window.OneSignal.showSlidedownPrompt();
              }
            });
          }
          if (window.OneSignal.on) {
            // Add event listeners
            window.OneSignal.on("notificationDisplay", (event) => {
              console.log("Notification displayed:", event);
            });

            window.OneSignal.on("notificationClick", (event) => {
              navigate("/user-notification");
            });
          }
        });
      } catch (error) {
        console.error("OneSignal initialization failed:", error);
      }
    };

    initializeOneSignal();
  }, [navigate]);

  // Access global state (assuming globalState has user)
  const { globalState } = useGlobalState();

  // Conditional rendering based on user authentication status
  const renderLayout = () => {
    if (globalState?.user) {
      if (globalState?.user?.is_superadmin) {
        return <AuthenticatedRoutes />;
      } else if (globalState?.user?.is_mierideuser) {
        return <BlogRoutes />;
      } else if (globalState?.user?.is_broadcastuser && globalState?.user?.email == "zoya@gmail.com") {
       return <PartialAdminRoutes/>
      } else if (globalState?.user?.is_broadcastuser) {
        return <BroadcastRoutes/>
       }

    } else {
      return <UnAuthenticatedRoutes />;
    }
  };

  return (
    <>
      {renderLayout()}
      <ToastContainer />
    </>
  );
}

export default App;
