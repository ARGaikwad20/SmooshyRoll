import "./App.css";
import { HomePage, ShowDetails } from "@pages";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/show/:id" element={<ShowDetails />} />
    </Routes>
  );
}

export default App;
