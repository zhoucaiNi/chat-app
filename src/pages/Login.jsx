import React from 'react';
import "../style.scss";

const Login = () => {
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className='logo'> Chat </span>
        <span className='title'> Log in</span>
        <form>
          <input type="email" placeholder='email' />
          <input type="password" placeholder='password' />
          <button> Log in</button>
        </form>
        <p> Don't have an account? Register</p>
      </div>
    </div>
  )
}

export default Login;
