import { io } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

    const socketInstance = io(backendURL, {
      withCredentials: true,
      transports: ["polling"], // Vercel does not support "websocket"
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("🟢 Connected to server via socket:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Disconnected from socket server:", reason);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", async (error) => {
      console.error("Socket connection error:", error.message);
      setIsConnected(false);

      // Handle auth failure
      if (error.message.includes("Unauthorized") || error.message.includes("token")) {
        console.warn("Attempting to refresh access token...");

        try {
          await fetch(`${backendURL}/refresh`, {
            method: "POST",
            credentials: "include",
          });
          console.log("🔄 Token refreshed, reconnecting socket...");
          socketInstance.connect(); // Retry connection
        } catch (refreshError) {
          console.error("Token refresh failed, please login again.");
        }
      }
    });


    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("connect_error");
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
