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

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {props.children}
        </AuthContext.Provider>
    )

}
