import "./ExamDetail.css";
import React, { useEffect, useState } from "react";
import { Space, Table, Button, notification, Input, Tooltip } from "antd";
import EditCreateExamDetail from "./Edit-Create/EditCreateExamDetail";
import { DeleteFilled, EditFilled, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Notification from "../../components/Notification/Notification";
import DeleteExamDetail from "./Delete/DeleteExamDetail";
import ExamDetailService from "../../services/ExamDetailService";

const ExamDetail = () => {
  let columns                         = [];
  const [data, setData]               = useState([]);
  const [error, setError]             = useState(null);
  const [loading, setLoading]         = useState(false);
  const [searchText, setSearchText]   = useState('');
  const [api, contextHolder]          = notification.useNotification(); //Notification
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 7,
      pageSizeOptions: [7, 10, 20, 50, 100],
      showQuickJumper: true,
      position: ["bottomRight"]
    },
  });
  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const response = await ExamDetailService.getExamDetails();
      setData(response.data.detalles);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAnalysis();
  }, []);

  //Llenar columnas
  columns = [
    {
      title: "Examen",
      dataIndex: "examen",
      sorter: {
        compare: (a, b) => a.examen.localeCompare(b.examen),
        multiple: 1,
      },
    },
    {
      title: "Detalle",
      dataIndex: "detalle",
      sorter: {
        compare: (a, b) => a.detalle.localeCompare(b.detalle),
        multiple: 2,
      },
    },
    {
      title: "Unidad",
      dataIndex: "unidad",
      align: "center",
    },
    {
      title: "Referencia",
      dataIndex: "valor_referencia",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title='Editar'>
            <Button className="actions" onClick={() => showEditCreateModal(record, 'Edit')}>
              <EditFilled className="edit-icon"/>
            </Button>
          </Tooltip>
          <Tooltip title='Eliminar'>
            <Button className="actions" onClick={() => showDeleteModal(record)}>
              <DeleteFilled className="delete-icon" />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  //Propiedades de la tabla
  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
  };
  const filteredData = data.filter(item => 
    item.examen.toLowerCase().includes(searchText.toLowerCase()) ||
    item.detalle.toLowerCase().includes(searchText.toLowerCase())
  );

  //Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [action, setAction] = useState(null);
  //Edit-Create
  const showEditCreateModal = (item, action) => {
    setAction(action);
    setCurrentItem(item);
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = (axiosResponse) => {
    Notification(api, axiosResponse);
    setIsModalOpen(false);
    fetchAnalysis();
  };
  
  //Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const showDeleteModal = (item) => {
    setCurrentItem(item);
    setIsDeleteModalOpen(true);
  };
  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };
  const handleDelete = (axiosResponse) => {
    Notification(api, axiosResponse);
    setIsDeleteModalOpen(false);
    fetchAnalysis();
  };

  return (
    <div className="specialty">
      <div className="header-content">
        <h3>Detalles de examenes</h3>
        <div className="d-flex p-0 m-0 align-items-center">
          <div className="input-group d-flex border align-items-center me-3">
            <SearchOutlined className="mx-2"/>
            <Input className="rounded-pill"
              placeholder="Buscar análisis"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <Button className="rounded-pill" type="primary" onClick={() => showEditCreateModal(null, 'Create')}>
            <PlusCircleOutlined /> Crear
          </Button>
        </div>
      </div>
      {contextHolder}
      <Table
        responsive
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        rowKey={"id_detalle"}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
        className="table-responsive" />
      <EditCreateExamDetail
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        initialValues={currentItem}
        action={action} />
      <DeleteExamDetail 
        isDeleteModalOpen={isDeleteModalOpen}
        handleDelete={handleDelete}
        handleDeleteCancel={handleDeleteCancel}
        initialValues={currentItem} />
    </div>
  );
};

export default ExamDetail;