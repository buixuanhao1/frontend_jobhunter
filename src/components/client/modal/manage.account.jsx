import { Modal, Tabs, Table } from 'antd';
import { isMobile } from 'react-device-detect';
import { useEffect, useState } from 'react';
import { callFetchResumeByUser } from '../../../services/api.service';
import dayjs from 'dayjs';

const UserResume = () => {
    const [listCV, setListCV] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const init = async () => {
            setIsFetching(true);
            const res = await callFetchResumeByUser();
            if (res && res.data) {
                setListCV(res.data.result)
            }
            setIsFetching(false);
        }
        init();
    }, [])

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1)}
                    </>)
            }
        },
        {
            title: 'Công Ty',
            dataIndex: "companyName",
        },
        {
            title: 'Job title',
            dataIndex: ["job", "name"],
        },
        {
            title: 'Trạng thái',
            dataIndex: "status",
        },
        {
            title: 'Ngày rải CV',
            dataIndex: "createdAt",
            render(value, record) {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
        },
        {
            title: '',
            dataIndex: "",
            render(value, record) {
                return (
                    <a
                        href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${record?.url}`}
                        target="_blank"
                    >Chi tiết</a>
                )
            },
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={listCV}
                loading={isFetching}
                pagination={false}
            />
        </div>
    )
}

const ManageAccount = (props) => {
    const { open, onClose } = props;

    const onChange = (key) => {
        console.log(key);
    };

    const items = [
        {
            key: 'user-resume',
            label: `Lịch sử ứng tuyển`,
            children: <UserResume />,
        },
        {
            key: 'email-by-skills',
            label: `Nhận Jobs qua Email`,
            children: <div>Job By Email Component</div>,
        },
        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <div>User Update Info Component</div>,
        },
        {
            key: 'user-password',
            label: `Thay đổi mật khẩu`,
            children: <div>Change Password Component</div>,
        },
    ];

    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width={isMobile ? "100%" : "1000px"}
            >
                <div style={{ minHeight: 400 }}>
                    <Tabs
                        defaultActiveKey="user-resume"
                        items={items}
                        onChange={onChange}
                    />
                </div>
            </Modal>
        </>
    )
}

export default ManageAccount;
