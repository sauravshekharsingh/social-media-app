import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert, CircularProgress, Input, InputLabel } from "@mui/material";
import { useState } from "react";
import api from "./../utils/api";
import { validateEmail } from "../utils/validators";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!name || !email || !username || !password || !confirmPassword) {
      setError("Please fill in all the fields.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Incorrect email.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password does not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password should be atleast 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post(
        "/auth/signup",
        {
          name,
          email,
          username,
          password,
          file,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        setSuccess(res.data.message);
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
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="confirm_password"
                label="Confirm Password"
                type="password"
                id="confirm_password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Upload profile photo</InputLabel>
              <Input
                type="file"
                fullWidth
                label="Choose profile photo"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress /> : "Sign Up"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;
