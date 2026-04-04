import { useEffect, useState } from 'react';
import { Col, Collapse, Row, Select, Slider, Button, Form, Divider } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import styles from '../../styles/client.module.scss';
import JobCard from '../../components/client/card/job.card';
import { fetchAllSkillAPI } from '../../services/api.service';

const { Panel } = Collapse;
const { Option } = Select;

const LEVELS = ['INTERN', 'FRESHER', 'JUNIOR', 'MIDDLE', 'SENIOR'];

const JobPage = () => {
    const [skills, setSkills] = useState([]);
    const [query, setQuery] = useState("");
    const [form] = Form.useForm();

    useEffect(() => {
        fetchAllSkillAPI('page=1&size=100').then(res => {
            const result = res?.data?.result ?? res?.data ?? [];
            setSkills(Array.isArray(result) ? result : []);
        });
    }, []);

    const handleFilter = (values) => {
        const params = new URLSearchParams();
        if (values.minSalary != null) params.append('minSalary', values.minSalary);
        if (values.maxSalary != null) params.append('maxSalary', values.maxSalary);
        if (values.level) params.append('level', values.level);
        if (values.location) params.append('location', values.location);
        if (values.skillId) params.append('skillId', values.skillId);
        setQuery(params.toString());
    };

    const handleClear = () => {
        form.resetFields();
        setQuery("");
    };

    return (
        <div style={{ background: "#f5f7fa", minHeight: "100vh", paddingBottom: 60 }}>
        <div className={styles["container"]} style={{ paddingTop: 40 }}>
            <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1677ff", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 }}>
                    💼 Cơ hội nghề nghiệp
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#1a1a2e" }}>Việc làm dành cho bạn</div>
            </div>
            <Row gutter={[20, 20]}>
                {/* Filter panel */}
                <Col span={24}>
                    <Collapse
                        bordered={false}
                        style={{ background: "#fafafa", borderRadius: 8, marginBottom: 12 }}
                        items={[{
                            key: '1',
                            label: <span><FilterOutlined /> Bộ lọc tìm kiếm nâng cao</span>,
                            children: (
                                <Form form={form} layout="inline" onFinish={handleFilter}
                                    style={{ flexWrap: 'wrap', gap: 12 }}>

                                    <Form.Item name="minSalary" label="Lương tối thiểu (đ)">
                                        <Select style={{ width: 160 }} allowClear placeholder="Không giới hạn">
                                            {[3, 5, 8, 10, 15, 20, 30].map(v => (
                                                <Option key={v} value={v * 1_000_000}>{v} triệu</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item name="maxSalary" label="Lương tối đa (đ)">
                                        <Select style={{ width: 160 }} allowClear placeholder="Không giới hạn">
                                            {[5, 10, 15, 20, 30, 50, 100].map(v => (
                                                <Option key={v} value={v * 1_000_000}>{v} triệu</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item name="level" label="Cấp độ">
                                        <Select style={{ width: 140 }} allowClear placeholder="Tất cả">
                                            {LEVELS.map(l => <Option key={l} value={l}>{l}</Option>)}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item name="location" label="Địa điểm">
                                        <Select style={{ width: 160 }} allowClear placeholder="Tất cả">
                                            {["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng"].map(l => (
                                                <Option key={l} value={l}>{l}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item name="skillId" label="Kỹ năng">
                                        <Select style={{ width: 180 }} allowClear showSearch
                                            placeholder="Tất cả kỹ năng"
                                            filterOption={(input, opt) => opt.children.toLowerCase().includes(input.toLowerCase())}>
                                            {skills.map(s => <Option key={s.id} value={s.id}>{s.name}</Option>)}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>
                                            Lọc
                                        </Button>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button onClick={handleClear} icon={<ClearOutlined />}>
                                            Xóa bộ lọc
                                        </Button>
                                    </Form.Item>
                                </Form>
                            )
                        }]}
                    />
                </Col>

                <Divider style={{ margin: 0 }} />

                <Col span={24}>
                    <JobCard showPagination={true} query={query} />
                </Col>
            </Row>
        </div>
        </div>
    );
};

export default JobPage;
