import React, { Fragment } from 'react';
import styles from './Header.module.css';
import { SpeedDial, SpeedDialAction } from '@material-ui/lab';
import Backdrop from '@material-ui/core/Backdrop';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';
import { logoutUser } from '../../../actions/userAction';

const UserOptions = ({ user }) => {
  const alert = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const dashboard = () => {
    navigate('/admin/dashboard');
  };
  const orders = () => {
    navigate('/orders');
  };

  const account = () => {
    navigate('/account');
  };

  const logout = () => {
    dispatch(logoutUser());

    alert.success('Logout Successfully');
  };

  const options = [
    { icon: <ListAltIcon />, name: 'Orders', func: orders },
    { icon: <PersonIcon />, name: 'account', func: account },
    { icon: <ExitToAppIcon />, name: 'logout', func: logout },
  ];

  if (user.role === 'admin') {
    options.unshift({
      icon: <DashboardIcon />,
      name: 'Dashboard',
      func: dashboard,
    });
  }

  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <Backdrop open={open} style={{ zIndex: '10' }} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        direction="up"
        className={styles.speedDial}
        open={open}
        icon={
          <img
            className={styles.speedDialIcon}
            src={user.avatar.url ? user.avatar.url : '/profile.png'}
            alt="Profile"
          />
        }
      >
        {options.map((item) => (
          <SpeedDialAction
            key={item.name}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
            tooltipOpen={window.innerWidth <= 600 ? true : false}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;
