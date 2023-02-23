import { Container, Grid, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import PostsList from "../components/PostsList";
import ProfileInfo from "../components/ProfileInfo";
import ProfileUpdate from "../components/ProfileUpdate";
import useAuthContext from "../hooks/useAuthContext";
import "./styles.css";

function Profile() {
  const [posts, setPosts] = useState({
    data: [],
    loading: false,
  });

  const { state: user } = useAuthContext();
  const { userId } = useParams();

  return (
    <Grid container spacing={2} id="flex-md">
      <Grid container justifyContent="center" item md={7} id="flex-md-1">
        <Container maxWidth="sm" sx={{ margin: "1rem" }}>
          <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
            {user.id === userId ? "Your" : ""} Posts
          </Typography>
          <PostsList userId={userId} posts={posts} setPosts={setPosts} />
        </Container>
      </Grid>
      <Grid item md={5}>
        <Container>
          <ProfileInfo userId={userId} />
          <ProfileUpdate userId={userId} />
        </Container>
      </Grid>
    </Grid>
  );
}

export default Profile;
