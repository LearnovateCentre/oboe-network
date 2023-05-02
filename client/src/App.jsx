import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useMemo } from "react";

import EmployeeProfile from "./components/EmployeeProfile";

function App() {
  //const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <CssBaseline />
        <Routes>
          <Route path="/employee/:id" element={<EmployeeProfile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
