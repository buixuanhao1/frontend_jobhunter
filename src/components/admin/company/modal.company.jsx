import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Modal, Form, Input, message, Upload, ConfigProvider } from "antd";
import { useState } from "react";
import { callCreateCompany, callUpdateCompany, callUploadSingleFile } from "../../../services/api.service";
import enUS from 'antd/lib/locale/en_US';

const ModalCompany = ({ openModal, setOpenModal, dataInit, setDataInit, reloadTable }) => {
    const [form] = Form.useForm();
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [dataLogo, setDataLogo] = useState([]);

    const handleSubmit = async (values) => {
        if (!dataLogo.length) {
            message.error("Vui lòng upload ảnh Logo");
            return;
        }

        const payload = { ...values, logo: dataLogo[0].name };
        const res = dataInit?.id
            ? await callUpdateCompany(dataInit.id, payload)
            : await callCreateCompany(payload);

        if (res.data) {
            message.success(dataInit?.id ? "Cập nhật thành công" : "Thêm mới thành công");
            handleReset();
            reloadTable();
        } else {
            message.error("Có lỗi xảy ra");
        }
    };

    const handleReset = () => {
        form.resetFields();
        setDataLogo([]);
        setDataInit(null);
        setOpenModal(false);
    };

    const handleUploadFileLogo = async ({ file, onSuccess, onError }) => {
        setLoadingUpload(true);
        try {
            const res = await callUploadSingleFile(file, "company");
            if (res?.data) {
                setDataLogo([{ name: res.data.fileName }]);
                onSuccess?.("ok");
            } else {
                onError?.(new Error(res.message));
            }
        } catch (error) {
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
            title={dataInit?.id ? "Cập nhật Company" : "Tạo mới Company"}
            open={openModal}
            onOk={() => form.submit()}
            onCancel={handleReset}
            okText="Lưu"
            cancelText="Hủy"
        >
            <Form
                form={form}
                onFinish={handleSubmit}
                initialValues={dataInit}
                layout="vertical"
            >
                <Form.Item
                    label="Tên công ty"
                    name="name"
                    rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Ảnh Logo"
                    required
                    rules={[{ required: true, message: "Vui lòng upload ảnh Logo" }]}
                >
                    <ConfigProvider locale={enUS}>
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            customRequest={handleUploadFileLogo}
                            beforeUpload={beforeUpload}
                            defaultFileList={dataInit?.logo ? [{
                                uid: '-1',
                                name: dataInit.logo,
                                status: 'done',
                                url: `${import.meta.env.VITE_BACKEND_URL}/storage/company/${dataInit.logo}`
                            }] : []}
                        >
                            {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                        </Upload>
                    </ConfigProvider>
                </Form.Item>

                <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                >
                    <Input.TextArea />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCompany;
