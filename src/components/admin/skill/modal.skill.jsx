import { useState } from 'react';
import { Form, Input, Modal, message } from 'antd';
import { callCreateSkill, callUpdateSkill } from '../../../services/api.service';

const ModalSkill = (props) => {
    const { openModal, setOpenModal, dataInit, setDataInit, reloadTable } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleCloseModal = () => {
        setOpenModal(false);
        setDataInit?.(null);
        form.resetFields();
    }

    const onFinish = async (values) => {
        setLoading(true);
        try {
            if (dataInit?.id) {
                const res = await callUpdateSkill(dataInit.id, values);
                if (res.data) {
                    message.success('Cập nhật skill thành công');
                    handleCloseModal();
                    reloadTable();
                } else {
                    message.error(res.message);
                }
            } else {
                const res = await callCreateSkill(values);
                if (res.data) {
                    message.success('Thêm mới skill thành công');
                    handleCloseModal();
                    reloadTable();
                } else {
                    message.error(res.message);
                }
            }
        } catch (error) {
            console.error(error);
            message.error('Có lỗi xảy ra');
        }
        setLoading(false);
    };

    return (
        <Modal
            title={dataInit?.id ? "Cập nhật Skill" : "Tạo mới Skill"}
            open={openModal}
            onCancel={handleCloseModal}
            onOk={() => form.submit()}
            confirmLoading={loading}
            maskClosable={false}
            width="500px"
        >
            <Form
                name="basic"
                initialValues={dataInit ?? { active: true }}
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Form.Item
                    label="Tên Skill"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên skill!' },
                        { min: 3, message: 'Tên skill phải có ít nhất 3 ký tự!' }
                    ]}
                >
                    <Input placeholder="Nhập tên skill" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Nhập mô tả về skill"
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalSkill; 