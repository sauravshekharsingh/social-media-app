import { Button, CircularProgress, Paper } from "@mui/material";
import { useEffect } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import api from "../utils/api";
import { getAuthTokenFromLocalStorage } from "../utils/token";
import formatDate from "../utils/date";

function ProfileInfo({ userId }) {
  const { state: user } = useAuthContext();

  const [state, setState] = useState({
    loading: false,
    profileInfo: null,
  });

  useEffect(() => {
    let url = `/profile/${user.id}`;

    if (userId) {
      url = `/profile/${userId}`;
    }

    async function fetchProfile() {
      try {
        const res = await api.get(url, {
          headers: {
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        });

        setState((state) => {
          return { loading: false, profileInfo: res.data.data };
        });
      } catch (err) {
        console.log(err);
      }
    }

    setState((state) => {
      return { ...state, loading: true };
    });
    fetchProfile();
  }, [user.id, userId]);

  const { loading, profileInfo } = state;

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Paper elevation={3} sx={{ margin: "1rem" }}>
        <Card sx={{ display: "flex" }}>
          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: "1" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h5">
                {profileInfo?.name}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                Username: {profileInfo?.username}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                Joined: {formatDate(profileInfo?.createdAt)}
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to={`/profile/${profileInfo?._id}`}
                sx={{ marginTop: "1rem" }}
              >
                Go to profile
              </Button>
            </CardContent>
          </Box>
          <CardMedia
            component="img"
            sx={{ width: 148 }}
            image={profileInfo?.profilePhoto}
            alt={`${profileInfo?.name}'s profile photo`}
          />
        </Card>
      </Paper>
    </>
  );
}

export default ProfileInfo;
