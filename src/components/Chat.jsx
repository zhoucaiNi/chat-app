import React from 'react'
import VideocamIcon from '@mui/icons-material/Videocam';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Messages from './Messages';
import Input from './Input';
import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';


const Chat = () => {

  const { data } = useContext(ChatContext);

  return (
    <div className="chat">

      <div className="chatInfo">
        <span> {data.user.displayName}</span>
        <div className="chatIcons">
          <VideocamIcon className="icons" />
          <PersonAddIcon className="icons" />
          <MoreHorizIcon className="icons" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  )
}

export default Chat