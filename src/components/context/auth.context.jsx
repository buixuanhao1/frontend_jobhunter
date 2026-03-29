import { createContext, useState } from "react";

export const AuthContext = createContext({
    email: "",
    name: "",
    id: ""
});

export const AuthWrapper = (props) => {
    const [user, setUser] = useState({
        email: "",
        name: "",
        id: ""
    });
    const [chatTarget, setChatTarget] = useState(null); // user muốn mở chat ngay

    return (
        <AuthContext.Provider value={{ user, setUser, chatTarget, setChatTarget }}>
            {props.children}
        </AuthContext.Provider>
    )

}
