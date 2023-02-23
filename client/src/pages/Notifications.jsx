import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import api from "../utils/api";
import formatDate from "../utils/date";
import { getAuthTokenFromLocalStorage } from "../utils/token";

function Notifications({ notifications, setNotifications }) {
  async function markAsRead() {
    try {
      await api.put(
        "/notification/read",
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        }
      );

      setNotifications(
        notifications.map((notification) => {
          notification.read = true;
          return notification;
        })
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Typography variant="h4" sx={{ margin: "1rem" }}>
        Notifications
      </Typography>
      <Grid container spacing={2} sx={{ padding: "0 1rem" }}>
        <Grid item sm={6} xs={12}>
          <Paper elevation={0} sx={{ padding: "1rem" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{ marginBottom: "1rem", marginRight: "auto" }}
              >
                Unread
              </Typography>
              <Button variant="contained" size="small" onClick={markAsRead}>
                Mark As Read
              </Button>
            </Box>
            {notifications.map((notification) => {
              if (notification.read) return null;

              return (
                <Card sx={{ marginBottom: "1rem" }} key={notification._id}>
                  <CardHeader
                    avatar={
                      <Avatar
                        src={notification.from.profilePhoto}
                        aria-label="recipe"
                      >
                        {notification.from.name}
                      </Avatar>
                    }
                    action={
                      notification?.post?.photo ? (
                        <IconButton aria-label="settings">
                          <img
                            src={notification?.post?.photo}
                            height="48"
                            width="48"
                            alt={notification?.post.content}
                          ></img>
                        </IconButton>
                      ) : (
                        <IconButton aria-label="settings">
                          <Typography variant="caption">
                            {notification?.post?.content?.substr(0, 10)}...
                          </Typography>
                        </IconButton>
                      )
                    }
                    title={`${notification.from.name} ${
                      notification.type === "like" ? "liked" : "commented on"
                    } your post.`}
                    subheader={formatDate(notification.createdAt)}
                  />
                </Card>
              );
            })}
          </Paper>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Paper elevation={0} sx={{ padding: "1rem" }}>
            <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
              Old
            </Typography>
            {notifications.map((notification) => {
              if (!notification.read) return null;

              return (
                <Card sx={{ marginBottom: "1rem" }} key={notification._id}>
                  <CardHeader
                    avatar={
                      <Avatar
                        src={notification.from.profilePhoto}
                        aria-label="recipe"
                      >
                        {notification.from.name}
                      </Avatar>
                    }
                    action={
                      notification?.post?.photo ? (
                        <IconButton aria-label="settings">
                          <img
                            src={notification?.post?.photo}
                            height="48"
                            width="48"
                            alt={notification?.post.content}
                          ></img>
                        </IconButton>
                      ) : (
                        <IconButton aria-label="settings">
                          <Typography variant="caption">
                            {notification?.post?.content?.substr(0, 10)}...
                          </Typography>
                        </IconButton>
                      )
                    }
                    title={`${notification.from.name} ${
                      notification.type === "like" ? "liked" : "commented on"
                    } your post.`}
                    subheader={formatDate(notification.createdAt)}
                  />
                </Card>
              );
            })}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default Notifications;
