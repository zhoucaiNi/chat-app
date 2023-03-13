import React, { useEffect } from 'react';
import { useState } from 'react';
import "../style.scss";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { arrayUnion, doc, getDoc, serverTimestamp, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuid } from "uuid";

const Register = () => {
  const [err, setErr] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


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
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return
    }

    setSelectedFile(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      // create user 
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, displayName);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          // update profile
          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });
          // create user on firestore
          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL
          });
          // create a userChat using the uid  
          // userChat = display on the right
          // chats = contents the chats

          await setDoc(doc(db, "userChats", res.user.uid), {});

          const helperUID = "C1pLMopAMgNIGxBSGGFhbe5txp23";

          try {
            const querySnapshot = await getDoc(doc(db, "users", helperUID));
            if (querySnapshot.exists()) {
              console.log(querySnapshot.data());
              const combinedId = res.user.uid > helperUID ? res.user.uid + helperUID : helperUID + res.user.uid;
              const text = "Hi, welcome to Zhoucai's realtime chat app. Use the search bar to find other users!";
              // create a userChat using the uid  

              await setDoc(doc(db, "chats", combinedId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: helperUID,
                  data: Timestamp.now(),
                })
              })

              await updateDoc(doc(db, "userChats", res.user.uid), {
                [combinedId + ".lastMessage"]: {
                  text
                },
                [combinedId + ".userInfo"]: {
                  uid: helperUID,
                  displayName: querySnapshot.data().displayName,
                  photoURL: querySnapshot.data().photoURL,
                },
                [combinedId + ".date"]: serverTimestamp(),
              })

              await updateDoc(doc(db, "userChats", helperUID), {
                [combinedId + ".lastMessage"]: {
                  text
                },
                [combinedId + ".userInfo"]: {
                  uid: res.user.uid,
                  displayName: res.user.displayName,
                  photoURL: res.user.photoURL,
                },
                [combinedId + ".date"]: serverTimestamp(),
              })

            }
          } catch (err) {
            setErr(true)
            console.log(err);
          }

          // await setDoc(doc(db, "chats", res.user.uid), { combinedId });

          navigate("/");
        })
      }
      );
    } catch (error) {
      setErr(true);
      console.log(error);
      setLoading(false);
    }

  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className='logo'> Chat </span>
        <span className='title'> Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder='display name' />
          <input type="email" placeholder='email' />
          <input type="password" placeholder='password' />
          <input style={{ display: "none" }} type="file" id="file" onChange={onSelectFile} />
          <label htmlFor="file">
            {!preview && <AddAPhotoIcon className='photoIcon' />}
            {selectedFile && <img src={preview} alt="avatar preview" />}
            <span> Add an avatar</span>
          </label>
          <button disabled={loading}> Sign up</button>
          {loading && <p> Uploading and compressing the image please wait...</p>}
          {err && <span> Something went wrong</span>}
        </form>
        <p> Have an account? <Link to="/login">Login </Link></p>
      </div>
    </div >
  )
}

export default Register;