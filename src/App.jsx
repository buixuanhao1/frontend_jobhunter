import Header from "./components/client/layout/header";
import Footer from "./components/client/layout/footer";
import { Outlet } from "react-router-dom";
import { getAccount } from "./services/api.service";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";

function App() {
  const { setUser } = useContext(AuthContext);
  useEffect(() => {
    GetAccount();
  }, []);

  const GetAccount = async () => {
    try {
      const res = await getAccount();
      if (res.data) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Error getting account:", error);
      // Let axios handle the error and refresh token if needed
    }
  }

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
