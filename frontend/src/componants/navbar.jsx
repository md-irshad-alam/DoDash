import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { Button, Divider, Drawer } from "@mui/material";
import { motion } from "framer-motion";

const navTabItem = [
  { to: "/book-ride", label: "Book Ride" },
  { to: "/profile", label: "Profile" },
  { to: "/driver-list", label: "Drivers" },
];
function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
    alert("User logged out");
  };
  const handleClickProfile = () => {
    handleClose();
    navigate("/profile");
  };
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    )
      return;
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      className="bg-gradient-to-br from-gray-900 to-black text-white h-full"
    >
      <Typography variant="h6" className="p-4 font-bold">
        Do Dash
      </Typography>
      <Divider />
      {["Book Ride", "Profile", "Drivers"].map((text, index) => (
        <Link
          key={index}
          to={`/${text.toLowerCase().replace(" ", "-")}`}
          className="block px-4 py-2 text-sm hover:bg-gray-800 transition-colors duration-200"
        >
          {text}
        </Link>
      ))}
      <div className="px-4 mt-4">
        <Button
          fullWidth
          variant="outlined"
          color="error"
          onClick={handleLogout}
          className="text-red-400 border-red-500 hover:bg-red-900 hover:text-white"
        >
          Logout
        </Button>
      </div>
    </Box>
  );

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <AppBar
        position="static"
        className="bg-gradient-to-r from-black via-gray-900 to-black shadow-lg"
      >
        <Toolbar
          sx={{
            maxWidth: "1280px",
            width: "100%",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
          }}
        >
          {/* Left: Hamburger + Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ display: { xs: "inline-flex", sm: "none" } }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              component="div"
              className="font-bold text-yellow-400"
            >
              Ride Sharing
            </Typography>
          </Box>

          <Box className="flex justify-between">
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                gap: 4,
                alignItems: "center",
                justifyContent: "center",
                flexGrow: 1,
              }}
            >
              {navTabItem.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.to}
                    className="text-white hover:text-yellow-300 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <button
                onClick={handleLogout}
                className="pl-5 pr-5  h-[36px] m-auto border-2 border-blue-300 text-white"
              >
                logout
              </button>
            </Box>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              className="hover:text-yellow-300 transition-colors"
            >
              <AccountCircle fontSize="large" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </motion.div>
  );
}

export default Navbar;
