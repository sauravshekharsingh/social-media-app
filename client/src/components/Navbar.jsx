import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import useAuthContext from "../hooks/useAuthContext";
import { Link } from "react-router-dom";
import { Badge } from "@mui/material";

const pagesAuthenticated = [
  {
    text: "Home",
    path: "/",
  },
  {
    text: "Profile",
    path: "/profile",
  },
];

const pagesNotAuthenticated = [
  {
    text: "Login",
    path: "/login",
  },
  {
    text: "Signup",
    path: "/signup",
  },
];

const settings = [
  {
    text: "Profile",
    path: "/profile",
  },
  {
    text: "Logout",
    path: "/logout",
  },
];

function Navbar({ notifications }) {
  const { state: user } = useAuthContext();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            SOCIAL MEDIA
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {user &&
                pagesAuthenticated.map((page) => (
                  <MenuItem
                    component={Link}
                    to={
                      page.path === "/profile"
                        ? `/profile/${user?.id}`
                        : page.path
                    }
                    key={page.text}
                    onClick={handleCloseNavMenu}
                  >
                    <Typography textAlign="center">{page.text}</Typography>
                  </MenuItem>
                ))}
              {!user &&
                pagesNotAuthenticated.map((page) => (
                  <MenuItem
                    component={Link}
                    to={
                      page.path === "/profile"
                        ? `/profile/${user?.id}`
                        : page.path
                    }
                    key={page.text}
                    onClick={handleCloseNavMenu}
                  >
                    <Typography textAlign="center">{page.text}</Typography>
                  </MenuItem>
                ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            SOCIAL MEDIA
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {user &&
              pagesAuthenticated.map((page) => (
                <Button
                  component={Link}
                  to={
                    page.path === "/profile"
                      ? `/profile/${user?.id}`
                      : page.path
                  }
                  key={page.text}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.text}
                </Button>
              ))}
            {!user &&
              pagesNotAuthenticated.map((page) => (
                <Button
                  component={Link}
                  to={
                    page.path === "/profile"
                      ? `/profile/${user?.id}`
                      : page.path
                  }
                  key={page.text}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.text}
                </Button>
              ))}
          </Box>

          {user && (
            <>
              <Box sx={{ flexGrow: 0 }}>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                  sx={{ marginRight: "1rem" }}
                  component={Link}
                  to="/notifications"
                >
                  <Badge
                    badgeContent={
                      notifications.filter((notification) => !notification.read)
                        .length
                    }
                    color="error"
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.name} src={user?.profilePhoto} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      component={Link}
                      to={
                        setting.path === "/profile"
                          ? `/profile/${user?.id}`
                          : setting.path
                      }
                      key={setting.text}
                      onClick={handleCloseUserMenu}
                    >
                      <Typography textAlign="center">{setting.text}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
