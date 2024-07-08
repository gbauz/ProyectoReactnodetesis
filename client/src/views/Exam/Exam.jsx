import "./Exam.css";
import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Button, notification, Input, Tooltip } from "antd";
import EditCreateExam from "./Edit-Create/EditCreateExam";
import { DeleteFilled, EditFilled, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Notification from "../../components/Notification/Notification";
import DeleteExam from "./Delete/DeleteExam";
import moment from 'moment';
import ExamService from "../../services/ExamService";

const Exam = () => {
  let columns                         = [];
  let filterAnalysis                  = [];
  let uniqueAnalysis                  = new Set();
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
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await ExamService.getExam();
      setData(response.data.examenes);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPatients();
  }, []);

  //Llenar filtros
  data.forEach(element => {
    if (!uniqueAnalysis.has(element.analisis)) {
      uniqueAnalysis.add(element.analisis);
      filterAnalysis.push({
        text: element.analisis,
        value: element.analisis,
      });
    }
  });

  //Llenar columnas
  columns = [
    {
      title: "Análisis",
      dataIndex: "analisis",
      sorter: {
        compare: (a, b) => a.analisis.localeCompare(b.analisis),
        multiple: 1,
      },
      filters: filterAnalysis,
      onFilter: (value, data) => data.analisis.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Examen",
      dataIndex: "examen",
      sorter: {
        compare: (a, b) => a.examen.localeCompare(b.examen),
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
    item.analisis.toLowerCase().includes(searchText.toLowerCase()) || 
    item.examen.toLowerCase().includes(searchText.toLowerCase())   ||
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
    fetchPatients();
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
    fetchPatients();
  };

  return (
    <div className="exam">
      <div className="header-content">
        <h3>Examen</h3>
        <div className="d-flex p-0 m-0 align-items-center">
          <div className="input-group d-flex border align-items-center me-3">
            <SearchOutlined className="mx-2"/>
            <Input className="rounded-pill"
              placeholder="Buscar examen"
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
        rowKey={"id_examen"}
        pagination={tableParams.pagination}
        onChange={handleTableChange} />
      <EditCreateExam
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        initialValues={currentItem}
        action={action} />
      <DeleteExam 
        isDeleteModalOpen={isDeleteModalOpen}
        handleDelete={handleDelete}
        handleDeleteCancel={handleDeleteCancel}
        initialValues={currentItem} />
    </div>
  );
};

export default Exam;