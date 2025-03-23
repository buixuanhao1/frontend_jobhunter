import { useState } from "react";
import { createUserAPI } from "../../services/api.service";
import { Button, Input, Modal, notification } from "antd";

const UserForm = (props) => {
    const { FetchAllUser } = props;
    const [name, setName] = useState("");
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [address, setAddress] = useState();
    const [age, setAge] = useState();

    //--Model
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = async () => {
        const res = await createUserAPI(name, email, password, address, age);
        if (res.data) {
            notification.success({
                message: "Create success!",
                description: "Tạo user thành công!"
            })
            FetchAllUser();
            ResetModal();
        } else {
            notification.error({
                message: "Create failed!",
                description: res.message
            })
        }

        setIsModalOpen(false);
    };

    const ResetModal = () => {
        setIsModalOpen(false);
        setName("");
        setEmail("");
        setPassword("");
        setAddress("");
        setAge("");

    }


    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", margin: 20 }}>
                <span>Table User</span>
                <Button type='primary' onClick={() => { setIsModalOpen(true) }}> Create user </Button>
            </div>
            <Modal title="Create User"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={ResetModal}
                okText="Add"
                maskClosable={false}
            >
                <div>
                    <span>Name</span>
                    <Input placeholder="Name" value={name} onChange={(event) => { setName(event.target.value) }} />
                    <span>Email</span>
                    <Input placeholder="Email" value={email} onChange={(event) => { setEmail(event.target.value) }} />
                    <span>Password</span>
                    <Input.Password placeholder="Password" value={password} onChange={(event) => { setPassword(event.target.value) }} />
                    <span>Address</span>
                    <Input placeholder="Address" value={address} onChange={(event) => { setAddress(event.target.value) }} />
                    <span>Age</span>
                    <Input placeholder="Age" value={age} onChange={(event) => { setAge(event.target.value) }} />
                </div>
            </Modal>
        </>
    );
}

export default UserForm;