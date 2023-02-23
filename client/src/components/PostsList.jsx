import * as React from "react";
import { CircularProgress, Paper } from "@mui/material";

import api from "../utils/api";
import { useEffect } from "react";
import Post from "./Post";
import { getAuthTokenFromLocalStorage } from "../utils/token";
import { Box } from "@mui/system";

function PostsList({ userId, posts, setPosts }) {
  const { loading, data } = posts;

  useEffect(() => {
    async function fetchPosts() {
      try {
        const url = userId ? `/post/${userId}` : `/post`;

        const res = await api.get(url, {
          headers: {
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        });

        setPosts({ loading: false, data: res.data.data });
      } catch (err) {
        console.log(err);
      }
    }

    setPosts((state) => {
      return { ...state, loading: true };
    });

    fetchPosts();
  }, [userId, setPosts]);

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={0}>
      {!loading &&
        data.map((post) => (
          <Post key={post._id} post={post} posts={posts} setPosts={setPosts} />
        ))}
    </Paper>
  );
}

export default PostsList;
