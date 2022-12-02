import React, { useEffect, useState, useCallback } from 'react';
import { removeUser, setUser } from '../store/slices/userSlice';
import { useAuth } from '../hooks/use-auth';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import { getUsers,blockUser, unblockUser, deleteUser } from '../http/userAPI';
import moment from 'moment';
import jwtDecode from 'jwt-decode';
import { IoTrashBinSharp } from 'react-icons/io5';
import { TbLock } from 'react-icons/tb';
import { TbLockOpen } from 'react-icons/tb';

const Profile = () => {
  const dispatch = useDispatch();
  const { isAuth } = useAuth();
  const [users, setUsers] = useState();
  const [userName, setUserName] = useState('');
  const [idUsers, setIdUsers] = useState();
  const [isClicked, setIsClicked] = useState(false);
  const [isLogged, setIsLogged] = useState(isAuth);
  const token = localStorage.getItem('token');
  const [decoded, setDecoded] = useState(token);

  function checkUser() {
    if (users !== undefined) {
      const isUser = users.filter((item) => item.id === decoded.id);
      console.log(isUser);
      if (!isUser[0]) {
        localStorage.clear();
        setIsLogged(false);
        console.log('localstorage clear');
      } else if (isUser[0].status === 'blocked') {
        localStorage.clear();
        setIsLogged(false);
      }
    }
  }

  useEffect(() => {
    const dataStorage = localStorage.getItem('token');
    if (dataStorage) {
      setDecoded(jwtDecode(dataStorage));
      dispatch(
        setUser({ id: decoded.id, name: decoded.name, email: decoded.email, token: dataStorage }),
      );
      console.log(userName);
      setUserName(localStorage.getItem('email'));
    }
    // eslint-disable-next-line
  }, []);

  const fetchData = useCallback(async () => {
    getUsers().then((data) => {
      setUsers(data);
      console.log(data);
    });
  }, [setUsers]);

  useEffect(() => {
    fetchData();
    checkUser();
    // eslint-disable-next-line
  }, [isClicked]);

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line
  }, [users, idUsers]);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 70,
    },
    { field: 'name', headerName: 'Name', width: 160 },
    { field: 'email', headerName: 'Email', width: 160 },
    {
      field: 'createdAt',
      headerName: 'Registration date',
      renderCell: (params) => moment(params.row.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      field: 'dateLogin',
      headerName: 'Login date',
      width: 200,
      renderCell: (params) => moment(params.row.dateLogin).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
    },
  ];

  const logOut = () => {
    dispatch(removeUser());
    localStorage.clear();
    setIsLogged(false);
  };

  const handlerTable = (row) => {
    setIdUsers(row);
    console.log(idUsers);
  };

  const handlerDelete = async() => {
    if (idUsers.includes(decoded.id)) {
      localStorage.clear();
      setIsLogged(false);
    }
    deleteUser(idUsers).then((data) => {
    setIsClicked(!isClicked);
    console.log(data);
    })
  };

  const handlerBlock = async () => {
    if (idUsers.includes(decoded.id)) {
      localStorage.clear();
      setIsLogged(false);
    } else {
      blockUser(idUsers).then((data) => {
      setIsClicked(!isClicked);
      console.log(data);
      })
    }
  };

  const handlerUnblock = async () => {
    unblockUser(idUsers).then((data) => {
    setIsClicked(!isClicked);
    console.log(data);
      
    })
  };

  return isLogged ? (
    <div
      style={{
        position: 'relative',
        marginTop: '10%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h2>
        Welcome <b>{userName}</b>!
      </h2>

      <div style={{ width: '62%', height: '100%' }}>
        <div className="menu">
          <div className="toolBar">
            <IoTrashBinSharp style={{ fill: '#B3404A' }} onClick={handlerDelete} />
            <TbLock onClick={handlerBlock} />
            <TbLockOpen onClick={handlerUnblock} />
          </div>
          <button
            onClick={logOut}
            style={{
              height: '100%',
              background: 'transparent',
              borderRadius: '8px',
              padding: '19px 71px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '18px',
            }}
          >
            Log out
          </button>
        </div>

        {users && (
          <div style={{ height: '340px', width: '100%' }}>
            <DataGrid
              rows={users}
              columns={columns}
              pageSize={4}
              rowsPerPageOptions={[4]}
              checkboxSelection
              // onCellClick={(e) => }
              onSelectionModelChange={(row) => {
                handlerTable(row);
              }}
            />
          </div>
        )}
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default Profile;
