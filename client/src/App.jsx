import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { theme } from "./theme";

import EmployeeProfile from "./pages/EmployeeProfile";
import Network from "./pages/Network";

function App() {
  //const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/employee/:id" element={<EmployeeProfile />} />
            <Route path="/network/:id" element={<Network />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
