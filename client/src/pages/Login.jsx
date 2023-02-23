import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert } from "@mui/material";
import { useState } from "react";

import api from "../utils/api";
import useAuthContext from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (!username || !password) {
      setError("Please fill in all the fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      if (res.data.success) {
        setSuccess(res.data.message);

        localStorage.setItem("token", res.data.token);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });
        navigate("/");
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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {success && (
            <Alert severity="success" sx={{ mb: 1 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
