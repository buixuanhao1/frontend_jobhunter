import React from 'react';
import { Badge, Descriptions, Drawer, Image } from 'antd';
import dayjs from 'dayjs';

const ViewDetailUser = (props) => {
    const { onClose, open, dataInit, setDataInit } = props;

    return (
        <Drawer
            title="Thông Tin Chi Tiết Người Dùng"
            placement="right"
            onClose={() => { onClose(false); setDataInit(null) }}
            open={open}
            width={"40vw"}
            maskClosable={false}
        >
            <Descriptions title="" bordered column={2} layout="vertical">
                <Descriptions.Item label="Tên hiển thị">{dataInit?.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{dataInit?.email}</Descriptions.Item>

                <Descriptions.Item label="Giới Tính">{dataInit?.gender}</Descriptions.Item>
                <Descriptions.Item label="Tuổi">{dataInit?.age}</Descriptions.Item>

                <Descriptions.Item label="Vai trò" span={2}>
                    <Badge
                        status="processing"
                        text={dataInit?.role?.name || 'N/A'}
                        color={
                            dataInit?.role?.name === 'ADMIN' ? 'red' :
                                dataInit?.role?.name === 'USER' ? 'blue' :
                                    dataInit?.role?.name === 'HR' ? 'green' : 'default'
                        }
                    />
                </Descriptions.Item>

                <Descriptions.Item label="Địa chỉ" span={2}>{dataInit?.address}</Descriptions.Item>

                <Descriptions.Item label="Avatar" span={2}>
                    {dataInit?.avatar ? (
                        <Image
                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/user/${dataInit.avatar}`}
                            alt="avatar"
                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '50%' }}
                        />
                    ) : (
                        'Chưa có avatar'
                    )}
                </Descriptions.Item>

                <Descriptions.Item label="Ngày tạo">
                    {dataInit?.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày cập nhật">
                    {dataInit?.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default ViewDetailUser; 