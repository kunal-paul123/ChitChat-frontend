import React, { lazy, Suspense, useState } from "react";
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  CircularProgress,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import {
  setIsMobileMenu,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotification } from "../../redux/reducers/chat";

const Search = lazy(() => import("../specific/Search"));
const Notifications = lazy(() => import("../specific/Notifications"));

const Header = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { isSearch, isNotification } = useSelector((state) => state.misc);

  const { notificationCount } = useSelector((state) => state.chat);

  const handleMobile = () => dispatch(setIsMobileMenu(true));

  const openSearch = () => dispatch(setIsSearch(true));

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotification());
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });

      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message) || "Something went wrong";
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            background: "linear-gradient(135deg, #2b5876, #4e4376)", // modern gradient
            color: "#fff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              variant="h6" // typo fixed from varient
              sx={{
                display: { xs: "none", sm: "block" },
                fontWeight: 600,
                fontSize: { xs: "1rem", sm: "1.4rem" },
                flexGrow: { xs: 1, sm: 0 },
              }}
            >
              Chat App
            </Typography>

            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>

            <Box flexGrow="1" />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: { xs: 0.5, sm: 1 },
                justifyContent: { xs: "flex-end", sm: "flex-start" },
              }}
            >
              <IconBtn
                title="Search"
                icon={<SearchIcon />}
                onClick={openSearch}
              />

              <IconBtn
                title="Notifications"
                icon={<NotificationsIcon />}
                onClick={openNotification}
                value={notificationCount}
              />
              <IconBtn
                title="Logout"
                icon={<LogoutIcon />}
                onClick={logoutHandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense
          fallback={
            <Backdrop open>
              <CircularProgress color="inherit" />
            </Backdrop>
          }
        >
          <Search />
        </Suspense>
      )}

      {isNotification && (
        <Suspense
          fallback={
            <Backdrop open>
              <CircularProgress color="inherit" />
            </Backdrop>
          }
        >
          <Notifications />
        </Suspense>
      )}
    </>
  );
};

const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
