import { ModalForm, ProFormText, ProFormDigit, ProFormSelect, ProFormTextArea } from "@ant-design/pro-components";
import { Col, Row, Form, message, notification } from "antd";
import { useEffect, useState } from "react";
import { callCreateUser, callUpdateUser, fetchAllRoleAPI } from "../../../services/api.service";
import { isMobile } from "react-device-detect";

const ModalUser = ({ openModal, setOpenModal, dataInit, setDataInit, reloadTable }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?.id) {
            form.setFieldsValue(dataInit);
        }
    }, [dataInit]);

    const handleReset = () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    };

    const handleSubmit = async (values) => {
        try {
            const payload = {
                ...values,
                role: {
                    id: values.roleId
                }
            };
            delete payload.roleId;

            let res;
            if (dataInit?.id) {
                res = await callUpdateUser(dataInit.id, payload);
            } else {
                res = await callCreateUser(payload);
            }

            if (res?.data) {
                message.success(dataInit?.id ? "Cập nhật thành công" : "Tạo mới thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res?.message || "Vui lòng thử lại",
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: "Không thể kết nối đến máy chủ",
            });
        }
    };


    return (
        <ModalForm
            title={dataInit?.id ? "Cập nhật User" : "Tạo mới User"}
            form={form}
            open={openModal}
            onFinish={handleSubmit}
            modalProps={{
                onCancel: handleReset,
                afterClose: handleReset,
                destroyOnClose: true,
                width: isMobile ? "100%" : 900,
                okText: dataInit?.id ? "Cập nhật" : "Tạo mới",
                cancelText: "Hủy"
            }}
            initialValues={dataInit || {}}
        >
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <ProFormText
                        label="Tên hiển thị"
                        name="name"
                        placeholder="Nhập tên"
                        rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                    />
                </Col>

                <Col xs={24} sm={12}>
                    <ProFormText
                        label="Email"
                        name="email"
                        placeholder="Nhập email"
                        disabled={!!dataInit?.id}
                        rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: "email", message: "Email không hợp lệ" }
                        ]}
                    />
                </Col>

                {!dataInit?.id && (
                    <Col xs={24} sm={12}>
                        <ProFormText.Password
                            label="Mật khẩu"
                            name="password"
                            placeholder="Nhập mật khẩu"
                            rules={[
                                { required: true, message: "Vui lòng nhập mật khẩu" },
                                { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự" }
                            ]}
                        />
                    </Col>
                )}

                <Col xs={24} sm={12}>
                    <ProFormDigit
                        label="Tuổi"
                        name="age"
                        min={16}
                        placeholder="Nhập tuổi"
                        rules={[{ required: true, message: "Vui lòng nhập tuổi" }]}
                    />
                </Col>

                <Col xs={24} sm={12}>
                    <ProFormText
                        label="Số điện thoại"
                        name="phone"
                        placeholder="Nhập số điện thoại"
                        rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại" },
                            { pattern: /^[0-9]+$/, message: "Chỉ nhập số" }
                        ]}
                    />
                </Col>

                <Col xs={24} sm={12}>
                    <ProFormSelect
                        label="Giới tính"
                        name="gender"
                        valueEnum={{
                            MALE: "Nam",
                            FEMALE: "Nữ",
                            OTHER: "Khác"
                        }}
                        placeholder="Chọn giới tính"
                        rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                    />
                </Col>

                <Col xs={24} sm={12}>
                    <ProFormSelect
                        label="Role"
                        name="roleId"
                        request={async () => {
                            // Giả sử bạn có API lấy danh sách role
                            const res = await fetchAllRoleAPI(); // [{ id: 1, name: "ADMIN" },...]
                            return res.data.result.map(role => ({
                                label: role.name,
                                value: role.id
                            }));
                        }}
                        placeholder="Chọn role"
                        rules={[{ required: true, message: "Vui lòng chọn role" }]}
                    />

                </Col>

                <Col xs={24}>
                    <ProFormTextArea
                        label="Địa chỉ"
                        name="address"
                        placeholder="Nhập địa chỉ"
                        allowClear
                        autoSize={{ minRows: 2, maxRows: 4 }}
                    />
                </Col>
            </Row>
        </ModalForm>
    );
};

export default ModalUser;
