import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { FooterToolbar, ModalForm, ProCard, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, ConfigProvider, Form, Modal, Row, Upload, message, notification } from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { callCreateCompany, callUpdateCompany, callUploadSingleFile } from "../../services/api.service";
import { v4 as uuidv4 } from "uuid";
import enUS from "antd/lib/locale/en_US";

const ModalCompany = ({ openModal, setOpenModal, dataInit, setDataInit, reloadTable }) => {
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [dataLogo, setDataLogo] = useState([]);
    const [value, setValue] = useState("");
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit) {
            setValue(dataInit.description || "");
            form.setFieldsValue({ name: dataInit.name, address: dataInit.address });
            setDataLogo(dataInit.logo ? [{ name: dataInit.logo, uid: uuidv4() }] : []);
        }
    }, [dataInit]);

    const submitCompany = async (values) => {
        if (!dataLogo.length) {
            message.error("Vui lòng upload ảnh Logo");
            return;
        }

        const payload = { ...values, description: value, logo: dataLogo[0].name };
        const res = dataInit?.id ? await callUpdateCompany(dataInit.id, payload) : await callCreateCompany(payload);

        if (res.data) {
            message.success(dataInit?.id ? "Cập nhật thành công" : "Thêm mới thành công");
            handleReset();
            reloadTable();
        } else {
            notification.error({ message: "Có lỗi xảy ra", description: res.message });
        }
    };

    const handleReset = () => {
        form.resetFields();
        setValue("");
        setDataInit(null);
        setOpenModal(false);
    };

    const handleUploadFileLogo = async ({ file, onSuccess, onError }) => {
        const res = await callUploadSingleFile(file, "company");
        if (res?.data) {
            setDataLogo([{ name: res.data.fileName, uid: uuidv4() }]);
            onSuccess?.("ok");
        } else {
            onError?.(new Error(res.message));
        }
    };

    return (
        <ModalForm
            title={dataInit?.id ? "Cập nhật Company" : "Tạo mới Company"}
            open={openModal}
            onFinish={submitCompany}
            form={form}
            modalProps={{ onCancel: handleReset }}
            submitter={{ submitButtonProps: { icon: <CheckSquareOutlined /> } }}
        >
            <Row gutter={16}>
                <Col span={24}>
                    <ProFormText label="Tên công ty" name="name" rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]} />
                </Col>
                <Col span={8}>
                    <Form.Item label="Ảnh Logo">
                        <ConfigProvider locale={enUS}>
                            <Upload
                                listType="picture-card"
                                maxCount={1}
                                customRequest={handleUploadFileLogo}
                            >
                                {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                            </Upload>
                        </ConfigProvider>
                    </Form.Item>
                </Col>
                <Col span={16}>
                    <ProFormTextArea label="Địa chỉ" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]} />
                </Col>
                <ProCard title="Miêu tả" headerBordered>
                    <ReactQuill theme="snow" value={value} onChange={setValue} />
                </ProCard>
            </Row>
        </ModalForm>
    );
};

export default ModalCompany;
