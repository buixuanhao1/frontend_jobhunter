import React from 'react';
import { Tabs } from 'antd';
import JobPage from './job';
import SkillPage from './skill';
import '../../../components/admin/admin.page.css';

const ManagePage = () => (
    <div className="admin-page">
        <div className="admin-page-header">
            <div>
                <div className="admin-page-title">Quản lý việc làm</div>
                <div className="admin-page-sub">Quản lý tin tuyển dụng và kỹ năng</div>
            </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,.04)" }}>
            <Tabs
                defaultActiveKey="jobs"
                style={{ padding: "0 16px" }}
                items={[
                    { key: 'jobs',   label: '📋 Danh sách Jobs',   children: <JobPage /> },
                    { key: 'skills', label: '🛠️ Kỹ năng',          children: <SkillPage /> },
                ]}
            />
        </div>
    </div>
);

export default ManagePage;
