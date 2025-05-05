import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { Button, Drawer } from "@mui/material";

function Navbar() {
  const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const navigate = useNavigate();

  const handleClickProfile = () => {
    setAnchorEl(null);
    navigate("/profile");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  let token = sessionStorage.getItem("token");
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
    window.alert("user logged out");
  };
  React.useEffect(() => {}, [token]);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Typography variant="h6" sx={{ p: 2 }}>
        Menu
      </Typography>
      <Link
        to="/book-ride"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <Typography variant="body1" sx={{ p: 2 }}>
          Book Ride
        </Typography>
      </Link>
      <Link to="/profile" style={{ textDecoration: "none", color: "inherit" }}>
        <Typography variant="body1" sx={{ p: 2 }}>
          Edit Profile
        </Typography>
      </Link>
      <Box className="ml-4">
        <Button variant="outlined" color="primary">
          Log out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            Photos
          </Typography>

          <div className="flex items-center justify-between gap-x-4  ">
            <div className="hidden sm:flex items-center gap-x-4">
              <Link to="/book-ride">
                <Typography variant="">Book Ride</Typography>
              </Link>
              <Link to="/profile">
                <Typography variant="">Edit Profile</Typography>
              </Link>
            </div>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClickProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout} className="hover:text-red-400">
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <React.Fragment>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {drawerContent}
        </Drawer>
      </React.Fragment>
    </Box>
  );
}

export default Navbar;
