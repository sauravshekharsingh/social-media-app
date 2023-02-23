import { Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import { useState } from "react";
import CreatePost from "../components/CreatePost";
import PostsList from "../components/PostsList";
import ProfileInfo from "../components/ProfileInfo";
import "./styles.css";

function Home() {
  const [posts, setPosts] = useState({
    data: [],
    loading: false,
  });

  return (
    <>
      <Grid container spacing={2} id="flex-md">
        <Grid container justifyContent="center" item md={7} id="flex-md-1">
          <Container maxWidth="sm" sx={{ margin: "1rem" }}>
            <CreatePost posts={posts} setPosts={setPosts} />
            <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
              Feed
            </Typography>
            <PostsList posts={posts} setPosts={setPosts} />
          </Container>
        </Grid>
        <Grid item md={5}>
          <Container justifyContent="center">
            <ProfileInfo />
          </Container>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
