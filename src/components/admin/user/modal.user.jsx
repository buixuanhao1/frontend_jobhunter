import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Modal, Form, Input, message, Upload, ConfigProvider, Select, InputNumber } from "antd";
import { useState } from "react";
import { callCreateUser, callUpdateUser, callUploadSingleFile } from "../../../services/api.service";
import enUS from 'antd/lib/locale/en_US';

const ModalUser = ({ openModal, setOpenModal, dataInit, setDataInit, reloadTable }) => {
    const [form] = Form.useForm();
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [dataAvatar, setDataAvatar] = useState([]);

    const handleSubmit = async (values) => {
        if (!dataAvatar.length && !dataInit?.id) {
            message.error("Vui lòng upload ảnh Avatar");
            return;
        }

        const payload = dataAvatar.length > 0 ?
            { ...values, avatar: dataAvatar[0].name } :
            { ...values };

        const res = dataInit?.id
            ? await callUpdateUser(dataInit.id, payload)
            : await callCreateUser(payload);

        if (res.data) {
            message.success(dataInit?.id ? "Cập nhật thành công" : "Thêm mới thành công");
            handleReset();
            reloadTable();
        } else {
            message.error(res.message || "Có lỗi xảy ra");
        }
    };

    const handleReset = () => {
        form.resetFields();
        setDataAvatar([]);
        setDataInit(null);
        setOpenModal(false);
    };

    const handleUploadFileAvatar = async ({ file, onSuccess, onError }) => {
        setLoadingUpload(true);
        try {
            const res = await callUploadSingleFile(file, "user");
            if (res?.data) {
                setDataAvatar([{ name: res.data.fileName }]);
                onSuccess?.("ok");
            } else {
                onError?.(new Error(res.message));
            }
        } catch (_) {
            onError?.(new Error('Upload failed'));
        } finally {
            setLoadingUpload(false);
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Chỉ chấp nhận file JPG/PNG!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Kích thước file phải nhỏ hơn 2MB!');
            return false;
        }
        return true;
    };

    return (
        <Modal
            title={dataInit?.id ? "Cập nhật User" : "Tạo mới User"}
            open={openModal}
            onOk={() => form.submit()}
            onCancel={handleReset}
            okText="Lưu"
            cancelText="Hủy"
            width={600}
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
                initialValues={dataInit}
            >
                <Form.Item
                    label="Tên hiển thị"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên hiển thị" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: 'email', message: "Email không hợp lệ" }
                    ]}
                >
                    <Input disabled={dataInit?.id} />
                </Form.Item>

                <Form.Item
                    label="Tuổi"
                    name="age"
                    rules={[
                        { required: true, message: "Vui lòng nhập tuổi" },
                        { type: 'number', min: 16, message: "Tuổi phải lớn hơn hoặc bằng 16" }
                    ]}
                >
                    <InputNumber min={16} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                >
                    <Select>
                        <Select.Option value="MALE">Nam</Select.Option>
                        <Select.Option value="FEMALE">Nữ</Select.Option>
                        <Select.Option value="OTHER">Khác</Select.Option>
                    </Select>
                </Form.Item>

                {!dataInit?.id && (
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu" },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                )}

                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại" },
                        { pattern: /^[0-9]+$/, message: "Số điện thoại không hợp lệ" }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: "Vui lòng chọn role" }]}
                >
                    <Select
                        options={[
                            { label: "Admin", value: "ADMIN" },
                            { label: "User", value: "USER" },
                            { label: "HR", value: "HR" }
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label="Avatar"
                    required={!dataInit?.id}
                >
                    <ConfigProvider locale={enUS}>
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            customRequest={handleUploadFileAvatar}
                            beforeUpload={beforeUpload}
                            defaultFileList={dataInit?.avatar ? [{
                                uid: '-1',
                                name: dataInit.avatar,
                                status: 'done',
                                url: `${import.meta.env.VITE_BACKEND_URL}/storage/user/${dataInit.avatar}`
                            }] : []}
                        >
                            {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                        </Upload>
                    </ConfigProvider>
                </Form.Item>

                <Form.Item
                    label="Địa chỉ"
                    name="address"
                >
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalUser;
