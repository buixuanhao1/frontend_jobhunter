import React, { useEffect, useState } from "react";
import { Table, Space, Popconfirm, message, Button } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { fetchAllCompanyAPI, deleteCompanyAPI } from "../../services/api.service";
import ModalCompany from "../../components/admin/company/modal.company";

const CompanyTable = () => {
    const [companies, setCompanies] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0 });

    // State để mở Modal
    const [openModal, setOpenModal] = useState(false);
    const [dataInit, setDataInit] = useState(null); // Lưu thông tin công ty khi chỉnh sửa

    useEffect(() => {
        FetchAllCompanies();
    }, []);

    const FetchAllCompanies = async () => {
        setIsFetching(true);
        const res = await fetchAllCompanyAPI();
        if (res.data) {
            setCompanies(res.data.result);
            setMeta({
                page: res.data.page || 1,
                pageSize: res.data.pageSize || 10,
                total: res.data.total || 0,
            });
        } else {
            message.error("Lỗi khi tải danh sách công ty");
        }
        setIsFetching(false);
    };

    const handleDeleteCompany = async (id) => {
        if (id) {
            const res = await deleteCompanyAPI(id);
            if (res && +res.data.statusCode === 202) {
                message.success("Xóa Company thành công");
                FetchAllCompanies();
            } else {
                message.error("Có lỗi xảy ra khi xóa Company");
            }
        }
    };

    const columns = [
        {
            title: "STT",
            key: "index",
            width: 50,
            align: "center",
            render: (text, record, index) => (
                <>{(index + 1) + (meta.page - 1) * meta.pageSize}</>
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Address",
            dataIndex: "address",
        },
        {
            title: "CreatedAt",
            dataIndex: "createdAt",
            render: (text) => text ? dayjs(text).format("DD-MM-YYYY HH:mm:ss") : "",
        },
        {
            title: "UpdatedAt",
            dataIndex: "updatedAt",
            render: (text) => text ? dayjs(text).format("DD-MM-YYYY HH:mm:ss") : "",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    {/* Nút Edit */}
                    <EditOutlined
                        style={{ fontSize: 20, color: "#ffa500", cursor: "pointer" }}
                        onClick={() => {
                            setDataInit(record); // Set dữ liệu khi sửa
                            setOpenModal(true); // Mở modal
                        }}
                    />
                    {/* Nút Delete */}
                    <Popconfirm
                        title="Xác nhận xóa company"
                        onConfirm={() => handleDeleteCompany(record.id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <DeleteOutlined
                            style={{ fontSize: 20, color: "#ff4d4f", cursor: "pointer" }}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            {/* Nút Thêm Mới */}
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                    setDataInit(null); // Xóa dữ liệu cũ
                    setOpenModal(true); // Mở modal
                }}
                style={{ marginBottom: 16 }}
            >
                Thêm Công Ty
            </Button>

            {/* Bảng danh sách công ty */}
            <Table
                rowKey="id"
                columns={columns}
                dataSource={companies}
                loading={isFetching}
                pagination={{
                    current: meta.page,
                    pageSize: meta.pageSize,
                    total: meta.total,
                    showSizeChanger: true,
                }}
            />

            {/* Modal */}
            <ModalCompany
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={FetchAllCompanies}
            />
        </>
    );
};

export default CompanyTable;
