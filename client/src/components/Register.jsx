import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { setUser } from '../store/slices/userSlice';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './spinner.css';
import { useAppDispatch } from '../hooks/redux-hooks';
import { registration } from '../http/userAPI';
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
      const response = await registration(data.email, data.password, data.firstName, date);
      dispatch(setUser({ id: response.id, email: response.email, name: response.name }));
      navigate('/profile');
      Swal.fire({
        icon: 'success',
        text: `You have successfully registered and logged into your account`,
        showConfirmButton: false,
      });
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
    setIsChangeType(!isChangeType);
    if (null !== changeType) {
      isChangeType ? (changeType.type = 'text') : (changeType.type = 'password');
    }
  };

  return (
    <div className="container">
      <Link to="/login">
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
          Return to log in
        </span>
      </Link>

      <div className="form_block" style={{ height: '700px' }}>
        <h2>Registration</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="containerInput">
            <input
              {...register('firstName', {
                required: 'Required field',
                pattern: {
                  value: /^([А-ЯЁA-Z][а-яёa-z]+[\s]?){1,3}$/,
                  message: 'Please enter a valid name',
                },
              })}
              className={errors.firstName && 'errorInput'}
            />
            <label htmlFor="">Your name</label>
          </div>
          {errors?.firstName && <p className="error">{errors.firstName.message}</p>}

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
                  value: /^[a-zA-Z0-9_-]{1,}$/,
                  message: 'Password must contain 5-10 characters',
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

          <button
            style={{ marginTop: '30px' }}
            disabled={isSubmitting}
            className={isSubmitting ? 'submitting submit' : 'submit'}
          >
            {isSubmitting ? <span className="loader"></span> : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Authorization;
