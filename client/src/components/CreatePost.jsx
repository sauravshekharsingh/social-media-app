import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Alert, InputLabel, Paper } from "@mui/material";
import { useState } from "react";

import api from "../utils/api";
import { getAuthTokenFromLocalStorage } from "../utils/token";
import useAuthContext from "../hooks/useAuthContext";

function CreatePost({ posts, setPosts }) {
  const { state: user } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    if (!content) {
      setError("Please write something to post.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(
        "/post/create",
        {
          content,
          file,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        }
      );

      if (res.data.success) {
        const newPost = res.data.data;
        newPost.createdBy = {
          ...user,
          _id: user.id,
        };

        setSuccess(res.data.message);
        setContent("");
        setPosts((state) => {
          return { ...state, data: [newPost, ...state.data] };
        });
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response.data.message);
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <Paper elevation={3} sx={{ padding: "1rem", marginBottom: "1rem" }}>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TextField
        multiline
        rows={3}
        id="outlined-basic"
        label="What's happening?"
        variant="outlined"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      <div>
        <InputLabel>Upload a photo</InputLabel>
        <input
          type="file"
          label="Choose profile photo"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        sx={{ marginTop: "1rem" }}
      >
        Post
      </Button>
    </Paper>
  );
}

export default CreatePost;
