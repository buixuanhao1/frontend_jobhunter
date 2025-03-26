
import { message, notification, Popconfirm, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import UserUpdate from "./user.update";
import UserDrawer from "./user.drawer";
import { deleteUserAPI } from "../../services/api.service";

const UserTable = (props) => {
    const { dataSource, FetchAllUser } = props;
    //drawer
    const [open, setOpen] = useState(false);
    const [dataDetails, setDataDetails] = useState();
    //--Model
    const [isModalUpdate, setIsModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);


    const confirm = async (id) => {
        const res = await deleteUserAPI(id);
        if (res.status === 200) {
            notification.success({
                message: "Delete success!",
                description: "Delete user thành công!"
            })
            FetchAllUser();
        } else {
            notification.error({
                message: "Delete failed!",
                description: res.error
            })
        }

    };
    const cancel = () => {
        message.error('Click on No');
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <a onClick={() => { setDataDetails(record), setOpen(true) }}>{text}</a>,
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
                        <a style={{ color: "red" }}>
                            <Popconfirm
                                title="Delete the task"
                                description="Are you sure to delete this task?"
                                onConfirm={() => { confirm(record.id) }}
                                onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                            >
                                <DeleteOutlined />
                            </Popconfirm>
                        </a>
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
            <UserDrawer
                open={open}
                setOpen={setOpen}
                dataDetails={dataDetails}
                setDataDetails={setDataDetails}
            />

        </>
    )
}

export default UserTable;