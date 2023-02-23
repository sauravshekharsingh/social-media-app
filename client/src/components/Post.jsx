import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CommentIcon from "@mui/icons-material/Comment";
import { styled } from "@mui/material/styles";

import formatDate from "../utils/date";
import useAuthContext from "../hooks/useAuthContext";

import api from "../utils/api";
import { getAuthTokenFromLocalStorage } from "../utils/token";
import { useState } from "react";
import { Alert, Button, Collapse, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function Post({ post, posts, setPosts }) {
  const { state: user } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState("");

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    post.likes.map((like) => {
      if (like === user.id) {
        setIsLiked(true);
      }
      return null;
    });
  }, [post, user]);

  const handleDeletePost = async (postId) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.delete(`/post/remove/${post._id}`, {
        headers: {
          Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
        },
      });

      if (res.data.success) {
        setSuccess(res.data.message);

        setPosts((state) => {
          return {
            ...state,
            data: state.data.filter((post) => post._id !== postId),
          };
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

  const handleCreateLike = async () => {
    try {
      const res = await api.put(
        `/like/create/${post._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        }
      );

      if (res.data.success) {
        setPosts((state) => {
          setIsLiked((isLiked) => !isLiked);

          return {
            ...state,
            data: state.data.map((singlePost) => {
              if (singlePost._id === post._id) return res.data.data;

              return singlePost;
            }),
          };
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveLike = async () => {
    try {
      const res = await api.delete(`/like/remove/${post._id}`, {
        headers: {
          Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
        },
      });

      if (res.data.success) {
        setPosts((state) => {
          setIsLiked((isLiked) => !isLiked);

          return {
            ...state,
            data: state.data.map((singlePost) => {
              if (singlePost._id === post._id) return res.data.data;

              return singlePost;
            }),
          };
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateComment = async () => {
    try {
      const res = await api.put(
        `/comment/create/${post._id}`,
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        }
      );

      if (res.data.success) {
        setPosts((state) => {
          setComment("");
          return {
            ...state,
            data: state.data.map((post) => {
              if (post._id === res.data.data._id) return res.data.data;
              return post;
            }),
          };
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveComment = async (commentId) => {
    try {
      const res = await api.delete(`/comment/remove/${commentId}`, {
        headers: {
          Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
        },
      });

      if (res.data.success) {
        setPosts((state) => {
          return {
            ...state,
            data: state.data.map((post) => {
              if (post._id === res.data.data._id) return res.data.data;
              return post;
            }),
          };
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card sx={{ marginBottom: "1rem", boxShadow: 3 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      {!success && (
        <>
          <CardHeader
            avatar={
              <Avatar
                alt={post.createdBy.name[0]}
                src={post.createdBy.profilePhoto}
                aria-label="recipe"
              />
            }
            action={
              user.id === post.createdBy._id ? (
                <IconButton
                  aria-label="settings"
                  disabled={loading}
                  onClick={() => handleDeletePost(post._id)}
                  sx={{ color: "red" }}
                >
                  <DeleteForeverIcon />
                </IconButton>
              ) : null
            }
            title={
              <Link to={`/profile/${post.createdBy._id}`}>
                {post.createdBy.name}
              </Link>
            }
            subheader={formatDate(post.createdAt)}
          />
          {post.photo && (
            <CardMedia component="img" image={post.photo} alt={post.content} />
          )}
          <CardContent>
            <Typography variant="body2">{post.content}</Typography>
          </CardContent>
          <CardActions disableSpacing>
            <>
              {isLiked && (
                <IconButton
                  aria-label="add to favorites"
                  onClick={handleRemoveLike}
                >
                  <FavoriteIcon sx={{ color: "red" }} />
                </IconButton>
              )}
              {!isLiked && (
                <IconButton
                  aria-label="add to favorites"
                  onClick={handleCreateLike}
                >
                  <FavoriteIcon />
                </IconButton>
              )}
              <Typography variant="body1">{post.likes.length} Likes</Typography>
            </>

            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <CommentIcon />
            </ExpandMore>
            <Typography variant="body1">
              {post.comments.length} Comments
            </Typography>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Card>
              <CardContent sx={{ display: "flex" }}>
                <TextField
                  label="Comment"
                  variant="outlined"
                  name="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  size="small"
                  sx={{ flex: "1", marginRight: "1rem" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={handleCreateComment}
                >
                  Comment
                </Button>
              </CardContent>
              {post.comments.map((comment) => (
                <CardHeader
                  avatar={
                    <Avatar
                      alt={comment.createdBy.name}
                      src={comment.createdBy.profilePhoto}
                    ></Avatar>
                  }
                  title={
                    <>
                      <Link to={`/profile/${comment.createdBy._id}`}>
                        {comment.createdBy.name}
                      </Link>
                      &nbsp;• {formatDate(comment.createdAt)}
                    </>
                  }
                  subheader={comment.content}
                  key={comment._id}
                  action={
                    user.id === comment.createdBy._id ||
                    user.id === post.createdBy._id ? (
                      <IconButton
                        aria-label="settings"
                        disabled={loading}
                        onClick={() => handleRemoveComment(comment._id)}
                      >
                        <DeleteForeverIcon sx={{ color: "red" }} />
                      </IconButton>
                    ) : null
                  }
                />
              ))}
            </Card>
          </Collapse>
        </>
      )}
    </Card>
  );
}

export default Post;
