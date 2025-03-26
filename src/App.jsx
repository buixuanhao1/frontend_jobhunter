import Header from "./components/client/layout/header";
import Footer from "./components/client/layout/footer";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
