
import { Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import UserUpdate from "./user.update";

const UserTable = (props) => {
    const { dataSource, FetchAllUser } = props;

    //--Model
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <>
                    <div style={{ display: "flex", gap: "20px" }}>
                        <a style={{ color: "orange" }} ><EditOutlined onClick={() => { setDataUpdate(record); setIsModalUpdate(true) }} /></a>
                        <a style={{ color: "red" }}><DeleteOutlined /></a>
                    </div>
                </>
            ),
        },
    ];
    return (
        <>
            <Table dataSource={dataSource} columns={columns} rowKey={"id"} />
            <UserUpdate
                isModalUpdate={isModalUpdate}
                setIsModalUpdate={setIsModalUpdate}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                FetchAllUser={FetchAllUser}
            />
        </>
    )
}

export default UserTable;