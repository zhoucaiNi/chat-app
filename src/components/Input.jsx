
import React, { useContext, useEffect, useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const onSelectFile = e => {
    setImg(e.target.files[0]);

    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return
    }

    setSelectedFile(e.target.files[0])
  }

  const handleSend = async () => {
    if (img) {

      const storageRef = ref(storage, uuid());

      await uploadBytesResumable(storageRef, img).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          await updateDoc(doc(db, "chats", data.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text,
              senderId: currentUser.uid,
              data: Timestamp.now(),
              img: downloadURL,
            })
          })
        })
      }
      );

    } else {
      // add text info
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          data: Timestamp.now(),
        })
      })
    }

    // add to userChats
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId + ".data"]: serverTimestamp(),
    })

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId + ".data"]: serverTimestamp(),
    })

    setText("");
    setImg(null);
    setSelectedFile(undefined);
  }

  return (
    <div className='input'>
      <div className="inputBar">
        {selectedFile && <img src={preview} alt="" />}
        <input
          type="text"
          placeholder='Type something...'
          onChange={e => setText(e.target.value)}
          value={text}
        />
      </div>
      <div className="send">
        <AddPhotoAlternateIcon className='img' />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={onSelectFile}
        />

        <label htmlFor='file'>
          <AttachFileIcon className='img' />
        </label>
        <button onClick={handleSend}> Send</button>
      </div>
    </div>
  )
}

export default Input