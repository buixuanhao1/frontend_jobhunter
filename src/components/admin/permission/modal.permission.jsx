import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message, notification } from "antd";
import { callCreatePermission, callUpdatePermission } from "../../../services/api.service";
import { ALL_MODULES } from "../../../config/permissions";

const ModalPermission = (props) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue(dataInit);
        }
    }, [dataInit]);

    const submitPermission = async (valuesForm) => {
        const { name, apiPath, method, module } = valuesForm;
        if (dataInit?.id) {
            //update
            const permission = {
                name,
                apiPath,
                method,
                module
            };

            const res = await callUpdatePermission(permission, dataInit.id);
            if (res && res.data) {
                message.success("Cập nhật permission thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.error
                });
            }
        } else {
            //create
            const permission = {
                name,
                apiPath,
                method,
                module
            };
            const res = await callCreatePermission(permission);
            if (res && res.data) {
                message.success("Thêm mới permission thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    };

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    };

    return (
        <Modal
            title={dataInit?.id ? "Cập nhật Permission" : "Tạo mới Permission"}
            open={openModal}
            onOk={() => {
                form.submit();
            }}
            onCancel={() => handleReset()}
            okText={dataInit?.id ? "Cập nhật" : "Tạo mới"}
            cancelText="Hủy"
            width={900}
            maskClosable={false}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={submitPermission}
                initialValues={dataInit?.id ? dataInit : {}}
            >
                <Form.Item
                    label="Tên Permission"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng không bỏ trống' },
                    ]}
                >
                    <Input placeholder="Nhập name" />
                </Form.Item>

                <Form.Item
                    label="API Path"
                    name="apiPath"
                    rules={[
                        { required: true, message: 'Vui lòng không bỏ trống' },
                    ]}
                >
                    <Input placeholder="Nhập path" />
                </Form.Item>

                <Form.Item
                    name="method"
                    label="Method"
                    rules={[{ required: true, message: 'Vui lòng chọn method!' }]}
                >
                    <Select placeholder="Please select a method">
                        <Select.Option value="GET">GET</Select.Option>
                        <Select.Option value="POST">POST</Select.Option>
                        <Select.Option value="PUT">PUT</Select.Option>
                        <Select.Option value="PATCH">PATCH</Select.Option>
                        <Select.Option value="DELETE">DELETE</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="module"
                    label="Thuộc Module"
                    rules={[{ required: true, message: 'Vui lòng chọn module!' }]}
                >
                    <Select placeholder="Please select a module">
                        {Object.entries(ALL_MODULES).map(([key, value]) => (
                            <Select.Option key={key} value={key}>{value}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalPermission;
