import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { setUser } from '../store/slices/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './spinner.css';
import { useAppDispatch } from '../hooks/redux-hooks';
import { login } from '../http/userAPI';
import moment from 'moment';

const Authorization = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isChangeType, setIsChangeType] = useState(true);
  const refPass = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onChange',
  });
  const { ref } = register('password');

  const onSubmit = async (data) => {
    try {
      const date = moment().format('YYYY-MM-DD HH:mm:ss');
      const response = await login(data.email, data.password, date);
      localStorage.setItem('email', response.email);
      const token = localStorage.getItem('token');
      Swal.fire({
        icon: 'success',
        text: `You have successfully logged`,
        showConfirmButton: false,
        timer: 2000,
      });
      dispatch(setUser({ email: response.email, id: response.id, token, name: response.name }));
      navigate('/profile');
    } catch ({ response }) {

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${response.data.message}`,
      });
    }
  };

  const onClickEyeNewPass = () => {
    const changeType = refPass.current;
    console.log(changeType);
    setIsChangeType(!isChangeType);
    if (null !== changeType) {
      isChangeType ? (changeType.type = 'text') : (changeType.type = 'password');
    }
  };

  return (
    <div className="container">
      <div className="form_block" style={{ height: '1000px' }}>
        <h2>Authorization</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="containerInput">
            <input
              {...register('email', {
                required: 'Required field',
                pattern: {
                  value: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/,
                  message: 'Please enter a valid email',
                },
              })}
              className={errors.email && 'errorInput'}
            />
            <label htmlFor="">Login</label>
          </div>
          {errors?.email && <p className="error">{errors.email.message}</p>}

          <div className="pass">
            <input
              {...register('password', {
                required: 'Required field',
                pattern: {
                  value: /^[a-z0-9_-]{1,}$/,
                  message: 'Enter correct password',
                },
              })}
              className={errors.password && 'errorInput'}
              type="password"
              ref={(e) => {
                ref(e);
                refPass.current = e;
              }}
            />

            <img
              onClick={onClickEyeNewPass}
              className="eye"
              src="../images/closedEye.svg"
              alt="closed-eye"
            />
            <label htmlFor="">Password</label>
          </div>
          {errors?.password && <p className="error">{errors.password.message}</p>}

          <button disabled={isSubmitting} className={isSubmitting ? 'submitting submit' : 'submit'}>
            {isSubmitting ? <span className="loader"></span> : 'Log in'}
          </button>

          <div className="register">
            <label htmlFor="">Don't have an account?</label>
            <Link to="/register">
              <span
                style={{
                  fontWeight: 500,
                  fontSize: '18px',
                  color: '#676a71',
                  padding: '23px 94px 23px 62px',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}
              >
                Click here to create an account
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Authorization;
