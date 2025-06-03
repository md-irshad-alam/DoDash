import "@mui/material/styles";
import "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import AllRoutess from "./routes/allRoutes";
import Parent from "./componants/assign/Parent";
function App() {
  return (
    <div className="bg-[#33312a]">
      <ToastContainer />
      <AllRoutess />
    </div>
  );
}

export default App;
