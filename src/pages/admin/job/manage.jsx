import React from 'react';
import { Tabs } from 'antd';
import JobPage from './job';
import SkillPage from './skill';

const ManagePage = () => {
    const items = [
        {
            key: 'jobs',
            label: 'Quản lý Jobs',
            children: <JobPage />,
        },
        {
            key: 'skills',
            label: 'Quản lý Skills',
            children: <SkillPage />,
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Tabs defaultActiveKey="jobs" items={items} />
        </div>
    );
};

export default ManagePage; 