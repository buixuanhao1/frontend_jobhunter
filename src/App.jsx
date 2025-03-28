import Header from "./components/client/layout/header";
import Footer from "./components/client/layout/footer";
import { Outlet } from "react-router-dom";
import { getAccount } from "./services/api.service";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";

function App() {
  const { setUser } = useContext(AuthContext);
  console.log("alo dcmm");
  useEffect(() => {
    GetAccount();
  }, []);

  const GetAccount = async () => {
    const res = await getAccount();
    if (res.data) {
      setUser(res.data.user);
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
