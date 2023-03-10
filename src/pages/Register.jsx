import React from 'react';
import "../style.scss";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

const Register = () => {
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className='logo'> Chat </span>
        <span className='title'> Register</span>
        <form>
          <input type="text" placeholder='display name' />
          <input type="email" placeholder='email' />
          <input type="password" placeholder='password' />
          <input style={{ display: "none" }} type="file" />
          <label htmlFor="file">
            <AddAPhotoIcon className='photoIcon'/>
            <span> Add an avatar</span>
          </label>
          <button> Sign up</button>
        </form>
        <p> Have an account? Login</p>
      </div>
    </div>
  )
}

export default Register;