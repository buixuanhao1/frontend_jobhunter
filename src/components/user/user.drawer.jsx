import { Button, Drawer } from "antd";
import { useEffect, useState } from "react";

const UserDrawer = (props) => {
    const { open, setOpen, dataDetails } = props;
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    useEffect(() => {
        if (dataDetails) {
            setId(dataDetails.id);
            setName(dataDetails.name);
            setEmail(dataDetails.email);
            setAge(dataDetails.age);
            setGender(dataDetails.gender);
            setAddress(dataDetails.address);
        }
    }, [dataDetails])

    return (<>
        <Button type="primary" onClick={() => { setOpen(true) }}>
            Open
        </Button>
        <Drawer title="User Details" onClose={() => { setOpen(false) }} open={open}>
            <p>Id : {id}</p>
            <p>Name : {name}</p>
            <p>Email : {email}</p>
            <p>Age : {age}</p>
            <p>Gender : {gender}</p>
            <p>Address : {address}</p>
        </Drawer>
    </>)
}

export default UserDrawer;