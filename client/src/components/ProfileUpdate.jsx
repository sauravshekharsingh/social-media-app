import {
  Alert,
  Button,
  CircularProgress,
  InputLabel,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import api from "../utils/api";
import { getAuthTokenFromLocalStorage } from "../utils/token";

function ProfileUpdate({ userId }) {
  const { state: user } = useAuthContext();

  const [state, setState] = useState({
    loading: false,
    profileInfo: null,
  });

  const [name, setName] = useState("");
  const [file, setFile] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

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

        if (res.data.success) {
          setSuccess(res.data.message);
          setState((state) => {
            setName(res.data.data.name);
            return { loading: false, profileInfo: res.data.data };
          });
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        console.log(err);
      }
    }

    setState((state) => {
      return { ...state, loading: true };
    });
    fetchProfile();
  }, [user.id, userId]);

  const handleProfileUpdate = async () => {
    setError("");
    setSuccess("");
    setUpdating(true);

    if (!name) {
      setError("Name cannot be empty");
      return;
    }

    try {
      const res = await api.patch(
        "/profile/update",
        {
          name,
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
        setSuccess(res.data.message);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response.data.message);
      console.log(err);
    }

    setUpdating(false);
  };

  const { loading } = state;

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Paper elevation={3} sx={{ margin: "1rem", padding: "1rem" }}>
        <Typography component="div" variant="h6">
          Update Profile
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: "1" }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <TextField
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ margin: "1rem 0" }}
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
            sx={{ marginTop: "1rem" }}
            onClick={handleProfileUpdate}
            disabled={updating}
          >
            Update Profile
          </Button>
        </Box>
      </Paper>
    </>
  );
}

export default ProfileUpdate;
