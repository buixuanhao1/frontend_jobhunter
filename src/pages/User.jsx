import { useEffect, useState } from "react";
import UserForm from "../components/user/user.form";
import UserTable from "../components/user/user.table";
import { fetchAllUserAPI } from "../services/api.service";


const UserPage = () => {

    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        FetchAllUser();
    }, []);

    const FetchAllUser = async () => {
        const res = await fetchAllUserAPI();
        setDataSource(res.data.result)
    }
    return (
        <>
            <UserForm FetchAllUser={FetchAllUser} />
            <UserTable
                dataSource={dataSource}
                FetchAllUser={FetchAllUser}
            />
        </>
    )
}

export default UserPage;