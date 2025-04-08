import { useState, useEffect } from 'react';
import { Form, Input, Modal, message, InputNumber, Select } from 'antd';
import { callCreateJob, callUpdateJob, fetchAllSkillAPI } from '../../../services/api.service';

const ModalJob = (props) => {
    const { openModal, setOpenModal, dataInit, setDataInit, reloadTable } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        fetchSkills();
    }, []);

    useEffect(() => {
        if (dataInit) {
            // Transform the skills data for the form
            const initialValues = {
                ...dataInit,
                skills: dataInit.skills?.map(skill => skill.id) || []
            };
            form.setFieldsValue(initialValues);
        }
    }, [dataInit, form]);

    const fetchSkills = async () => {
        try {
            const res = await fetchAllSkillAPI('page=0&size=100');
            if (res && res.data) {
                const skillsList = res.data.result.content || [];
                setSkills(skillsList);
            }
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setDataInit?.(null);
        form.resetFields();
    }

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Transform skills array to use objects with id property
            const transformedValues = {
                ...values,
                skills: values.skills.map(skillId => ({
                    id: skillId
                }))
            };

            if (dataInit?.id) {
                const res = await callUpdateJob(dataInit.id, transformedValues);
                if (res.data) {
                    message.success('Cập nhật job thành công');
                    handleCloseModal();
                    reloadTable();
                } else {
                    message.error(res.message);
                }
            } else {
                const res = await callCreateJob(transformedValues);
                if (res.data) {
                    message.success('Thêm mới job thành công');
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
            title={dataInit?.id ? "Cập nhật Job" : "Tạo mới Job"}
            open={openModal}
            onCancel={handleCloseModal}
            onOk={() => form.submit()}
            confirmLoading={loading}
            maskClosable={false}
            width="60vw"
        >
            <Form
                name="basic"
                initialValues={dataInit ?? { active: true }}
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Form.Item
                    label="Tên Job"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên job!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Skills"
                    name="skills"
                    rules={[{ required: true, message: 'Vui lòng chọn skills!' }]}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Chọn skills"
                        options={skills.map(skill => ({
                            label: skill.name,
                            value: skill.id
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Level"
                    name="level"
                    rules={[{ required: true, message: 'Vui lòng chọn level!' }]}
                >
                    <Select
                        placeholder="Chọn level"
                        options={[
                            { label: 'INTERN', value: 'INTERN' },
                            { label: 'FRESHER', value: 'FRESHER' },
                            { label: 'JUNIOR', value: 'JUNIOR' },
                            { label: 'MIDDLE', value: 'MIDDLE' },
                            { label: 'SENIOR', value: 'SENIOR' },
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label="Mức lương"
                    name="salary"
                    rules={[{ required: true, message: 'Vui lòng nhập mức lương!' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        placeholder="Nhập mức lương"
                    />
                </Form.Item>

                <Form.Item
                    label="Mô tả công việc"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả công việc!' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    label="Trạng thái"
                    name="active"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select
                        placeholder="Chọn trạng thái"
                        options={[
                            { label: 'ACTIVE', value: true },
                            { label: 'INACTIVE', value: false },
                        ]}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ModalJob; 