import "./Analysis.css";
import React, { useEffect, useState } from "react";
import { Space, Table, Button, notification, Input, Tooltip } from "antd";
import EditCreateAnalysis from "./Edit-Create/EditCreateAnalysis";
import { DeleteFilled, EditFilled, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Notification from "../../components/Notification/Notification";
import DeleteAnalysis from "./Delete/DeleteAnalysis";
import moment from 'moment';
import AnalysisService from "../../services/AnalysisService";

const Analysis = () => {
  let columns                         = [];
  let filterSpecialty                 = [];
  let uniqueSpecialty                 = new Set();
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
      const response = await AnalysisService.getAnalysis();
      setData(response.data.analisis);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAnalysis();
  }, []);

  //Llenar filtros
  data.forEach(element => {
    if (!uniqueSpecialty.has(element.nombre)) {
      uniqueSpecialty.add(element.nombre);
      filterSpecialty.push({
        text: element.nombre,
        value: element.nombre,
      });
    }
  });

  //Llenar columnas
  columns = [
    {
      title: "Especialidad",
      dataIndex: "nombre",
      sorter: {
        compare: (a, b) => a.nombre.localeCompare(b.nombre),
        multiple: 1,
      },
      filters: filterSpecialty,
      onFilter: (value, data) => data.nombre.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Nombre",
      dataIndex: "analisis",
      sorter: {
        compare: (a, b) => a.analisis.localeCompare(b.analisis),
        multiple: 2,
      },
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      align: "center",
      sorter: {
        compare: (a, b) => new Date(a.fecha) - new Date(b.fecha),
        multiple: 3,
      },
      render: (text) => moment(text).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Acciones",
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
    item.analisis.toLowerCase().includes(searchText.toLowerCase()) || 
    item.fecha.toLowerCase().includes(searchText.toLowerCase())
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
    <div className="analisis">
      <div className="header-content">
        <h3>Análisis</h3>
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
        rowKey={"id_analisis"}
        pagination={tableParams.pagination}
        onChange={handleTableChange} />
      <EditCreateAnalysis
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        initialValues={currentItem}
        action={action} />
      <DeleteAnalysis 
        isDeleteModalOpen={isDeleteModalOpen}
        handleDelete={handleDelete}
        handleDeleteCancel={handleDeleteCancel}
        initialValues={currentItem} />
    </div>
  );
};

export default Analysis;