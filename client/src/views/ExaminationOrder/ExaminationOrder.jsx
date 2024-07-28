import "./ExaminationOrder.css";
import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Button, notification, Input, Tooltip } from "antd";
import EditCreateExaminationOrder from "./Edit-Create/EditCreateExaminationOrder";
import ExaminationOrderService from "../../services/ExaminationOrderService";
import { DeleteFilled, EditFilled, FilePdfOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Notification from "../../components/Notification/Notification";
import DeleteExaminationOrder from "./Delete/DeleteExaminationOrder";
import moment from 'moment';
import PDFExaminationOrder from "../../components/PDF/PDFExaminationOrder";

const ExaminationOrder = () => {
  let columns                         = [];
  let filterMedic                     = [];
  let uniqueMedic                     = new Set();
  const [data, setData]               = useState([]);
  const [error, setError]             = useState(null);
  const [loading, setLoading]         = useState(false);
  const [searchText, setSearchText]   = useState('');
  const [api, contextHolder]          = notification.useNotification(); //Notification
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 4,
      pageSizeOptions: [4, 10, 20, 50, 100],
      showQuickJumper: true,
      position: ["bottomRight"]
    },
  });
  const fetchExaminationOrder = async () => {
    setLoading(true);
    try {
      const response = await ExaminationOrderService.getExaminationOrder();
      setData(response.data.mantexamen);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchExaminationOrder();
  }, []);

  //Llenar filtros
  data.forEach(element => {
    if (!uniqueMedic.has(element.nombre_apellido)) {
      uniqueMedic.add(element.nombre_apellido);
      filterMedic.push({
        text: element.nombre_apellido,
        value: element.nombre_apellido,
      });
    }
  });

  const generatePDF = (data) => {
    PDFExaminationOrder(data)
  };

  //Llenar columnas
  columns = [
    {
      title: "Paciente",
      dataIndex: "paciente",
      sorter: {
        compare: (a, b) => a.paciente.localeCompare(b.paciente),
        multiple: 1,
      },
    },
    {
      title: "Cédula",
      dataIndex: "paciente_cedula",
      sorter: {
        compare: (a, b) => a.paciente_cedula.localeCompare(b.paciente_cedula),
        multiple: 2,
      },
    },
    {
      title: "Médico",
      dataIndex: "nombre_apellido",
      sorter: {
        compare: (a, b) => a.nombre_apellido.localeCompare(b.nombre_apellido),
        multiple: 3,
      },
      filters: filterMedic,
      onFilter: (value, data) => data.nombre_apellido.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Especialidad",
      dataIndex: "especialidad",
      align: "center",
      sorter: {
        compare: (a, b) => a.especialidad.localeCompare(b.especialidad),
        multiple: 4,
      },
    },
    {
      title: "Análisis",
      dataIndex: "analisis",
      align: "center",
      render: (_, { analisis }) => (
        <>
          {analisis.map((analysis) => 
            <Tag key={analysis.id_analisis}>
              {analysis.analisis}
            </Tag>
          )}
        </>
      ),
    },
    {
      title: "Examen",
      dataIndex: "examen",
      align: "center",
      render: (_, { analisis }) => (
        <>
          {analisis.map((analysis) => 
              analysis.examen.map((exam) => (
                <Tag key={exam.id_examen}>
                  {exam.examen}
                </Tag>
              )
            ))
          }
        </>
      ),
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      align: "center",
      sorter: {
        compare: (a, b) => new Date(a.fecha) - new Date(b.fecha),
        multiple: 5,
      },
      render: (text) => moment(text).format('DD-MM-YYYY HH:mm:ss'),
    },
    {
      title: "Acciones",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title='Descargar orden'>
            <Button className="actions" onClick={() => generatePDF(record)}>
              <FilePdfOutlined className="download-icon"/>
            </Button>
          </Tooltip>
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
    item.paciente.toLowerCase().includes(searchText.toLowerCase()) ||
    item.nombre_apellido.toLowerCase().includes(searchText.toLowerCase()) ||
    item.paciente_cedula.toLowerCase().includes(searchText.toLowerCase()) ||
    item.especialidad.toLowerCase().includes(searchText.toLowerCase())
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
    fetchExaminationOrder();
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
    fetchExaminationOrder();
  };

  return (
    <div className="paciente">
      <div className="header-content">
        <h3>Orden de examenes</h3>
        <div className="d-flex p-0 m-0 align-items-center">
          <div className="input-group d-flex border align-items-center me-3">
            <SearchOutlined className="mx-2"/>
            <Input className="rounded-pill"
              placeholder="Buscar paciente"
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
        rowKey={"id"}
        pagination={tableParams.pagination}
        onChange={handleTableChange} />
      {isModalOpen && (
        <EditCreateExaminationOrder
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit}
          initialValues={currentItem}
          action={action} />
      )}
      {isDeleteModalOpen && (
        <DeleteExaminationOrder 
          isDeleteModalOpen={isDeleteModalOpen}
          handleDelete={handleDelete}
          handleDeleteCancel={handleDeleteCancel}
          initialValues={currentItem} />
      )}
    </div>
  );
};

export default ExaminationOrder;
