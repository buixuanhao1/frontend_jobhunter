import { Modal, Tabs, Table, Form, Row, Col, Select, Button, message, notification } from 'antd';
import { isMobile } from 'react-device-detect';
import { useEffect, useState, useContext } from 'react';
import { callFetchResumeByUser, fetchAllSkillAPI, callCreateSubscriber, callGetSubscriberSkills, callUpdateSubscriber } from '../../../services/api.service';
import dayjs from 'dayjs';
import { MonitorOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/auth.context";


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


// Job by email
const JobByEmail = () => {
    const [form] = Form.useForm();
    const [optionsSkills, setOptionsSkills] = useState([]);
    const [subscriber, setSubscriber] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const init = async () => {
            console.log("init");
            await fetchSkill();
            const res = await callGetSubscriberSkills();
            if (res && res.data) {
                setSubscriber(res.data);
                const d = res.data.skills;
                const arr = d.map((item) => {
                    return {
                        label: item.name,
                        value: item.id + ""
                    }
                });
                form.setFieldValue("skills", arr);
            }
        }
        init();
    }, [])

    const fetchSkill = async () => {
        let query = `page=1&size=100&sort=createdAt,desc`;

        const res = await fetchAllSkillAPI(query);
        if (res && res.data) {
            const arr = res?.data?.result?.content?.map(item => {
                return {
                    label: item.name,
                    value: item.id + ""
                }
            }) ?? [];
            setOptionsSkills(arr);
        }
    }

    const onFinish = async (values) => {
        if (!user) {
            message.error("Vui lòng đăng nhập để sử dụng tính năng này");
            return;
        }

        const { skills } = values;

        const arr = skills?.map((item) => {
            if (item?.id) return { id: item.id };
            return { id: item }
        });

        if (!subscriber?.id) {
            //create subscriber
            const data = {
                email: user.email,
                name: user.name,
                skills: arr
            }

            const res = await callCreateSubscriber(data);
            if (res.data) {
                message.success("Cập nhật thông tin thành công");
                setSubscriber(res.data);
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //update subscriber
            const data = {
                id: subscriber.id,
                email: user.email,
                name: user.name,
                skills: arr
            }

            const res = await callUpdateSubscriber(data);
            if (res.data) {
                message.success("Cập nhật thông tin thành công");
                setSubscriber(res.data);
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    return (
        <>
            <Form
                onFinish={onFinish}
                form={form}
            >
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <Form.Item
                            label={"Kỹ năng"}
                            name={"skills"}
                            rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 skill!' }]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                suffixIcon={null}
                                style={{ width: '100%' }}
                                placeholder={
                                    <>
                                        <MonitorOutlined /> Tìm theo kỹ năng...
                                    </>
                                }
                                optionLabelProp="label"
                                options={optionsSkills}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Button onClick={() => form.submit()}>Cập nhật</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

const UserUpdateInfo = () => {
    return (
        <div>
            //todo
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
            children: <JobByEmail />,
        }
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
