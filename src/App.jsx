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
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser({
        email: "",
        name: "",
        id: ""
      });
      return;
    }

    try {
      const res = await getAccount();
      if (res.data) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Error getting account:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("access_token");
        setUser({
          email: "",
          name: "",
          id: ""
        });
      }
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
