'use client';
import React, { createContext, useContext } from 'react';
import io, { Socket } from 'socket.io-client';
const url = process.env.NEXT_PUBLIC_SOCKET_URL;

const SocketContext = createContext<Socket | null>(null);
const getSocketContext = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useContext(SocketContext);
};
const socket = io(url, {
  autoConnect: false
});
const SocketContextComponent = ({ children }: { children: React.ReactNode }) => {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
export default SocketContextComponent;
export { getSocketContext, SocketContext };
