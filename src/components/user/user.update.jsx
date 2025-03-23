import { useEffect, useState } from "react";
import { createUserAPI, updateUserAPI } from "../../services/api.service";
import { Button, Input, Modal, notification } from "antd";

const UserUpdate = (props) => {
    const { FetchAllUser, isModalUpdate, setIsModalUpdate, dataUpdate, setDataUpdate } = props;
    const [name, setName] = useState("");
    const [address, setAddress] = useState();
    const [age, setAge] = useState();
    const [id, setId] = useState();
    const [gender, setGender] = useState();
    console.log(dataUpdate);
    //--Model
    useEffect(() => {
        if (dataUpdate) {
            setId(dataUpdate.id)
            setName(dataUpdate.name);
            setAddress(dataUpdate.address);
            setAge(dataUpdate.age);
            setGender(dataUpdate.gender)
        }
    }, [dataUpdate])

    const handleOk = async () => {
        const res = await updateUserAPI(id, name, address, age, gender);
        if (res.data) {
            notification.success({
                message: "Update success!",
                description: "Update user thành công!"
            })
            ResetModal();
            FetchAllUser();

        } else {
            notification.error({
                message: "Update failed!",
                description: res.message
            })
            setIsModalUpdate(false);
        }


    };

    const ResetModal = () => {
        setIsModalUpdate(false);
        setName("");
        setAddress("");
        setAge("");
        setId("");
        setGender("");
        setDataUpdate(null);

    }


    return (
        <>

            <Modal title="Update User"
                open={isModalUpdate}
                onOk={handleOk}
                onCancel={ResetModal}
                okText="Save"
                maskClosable={false}
            >
                <div>
                    <span>Id</span>
                    <Input value={id} disabled />
                    <span>Name</span>
                    <Input placeholder="Name" value={name} onChange={(event) => { setName(event.target.value) }} />
                    <span>Address</span>
                    <Input placeholder="Address" value={address} onChange={(event) => { setAddress(event.target.value) }} />
                    <span>Age</span>
                    <Input placeholder="Age" value={age} onChange={(event) => { setAge(event.target.value) }} />
                    <span>Gender</span>
                    <Input placeholder="Gender" value={gender} onChange={(event) => { setGender(event.target.value) }} />

                </div>
            </Modal>
        </>
    );
}

export default UserUpdate;