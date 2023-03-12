import React from 'react';
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
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';



const Register = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      // create user 
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        (error) => {
          setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log(res);


            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            // put the user info in the db
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL
            });
            // create a userChat using the uid
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");

          })
        }
      );
    } catch (error) {
      setErr(true);
      console.log(error);
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
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <AddAPhotoIcon className='photoIcon' />
            <span> Add an avatar</span>
          </label>
          <button> Sign up</button>
          {err && <span> Something went wrong</span>}
        </form>
        <p> Have an account? <Link to="/login">Login </Link></p>
      </div>
    </div >
  )
}

export default Register;