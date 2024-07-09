import "./Medic.css";
import React, { useEffect, useState } from "react";
import { Space, Table, Button, notification, Input, Tooltip } from "antd";
import EditCreateMedic from "./Edit-Create/EditCreateMedic";
import { DeleteFilled, EditFilled, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Notification from "../../components/Notification/Notification";
import DeletePacient from "./Delete/DeleteMedic";
import MedicService from "../../services/MedicService";

const Medic = () => {
  let columns                         = [];
  let filterEspecialidad              = [];
  let uniqueEspecialidad              = new Set();
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
  const fetchMedics = async () => {
    setLoading(true);
    try {
      const response = await MedicService.getMedics();
      setData(response.data.medicos);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMedics();
  }, []);

  //Llenar filtros
  data.forEach(element => {
    if (!uniqueEspecialidad.has(element.nombre)) {
      uniqueEspecialidad.add(element.nombre);
      filterEspecialidad.push({
        text: element.nombre,
        value: element.nombre,
      });
    }
  });

  //Llenar columnas
  columns = [
    {
      title: "Nombre",
      dataIndex: "nombre_apellido",
      sorter: {
        compare: (a, b) => a.nombre_apellido.localeCompare(b.nombre_apellido),
        multiple: 1,
      },
    },
    {
      title: "Cédula",
      dataIndex: "cedula",
      align: "center",
      sorter: {
        compare: (a, b) => a.cedula - b.cedula,
        multiple: 2,
      },
    },
    {
      title: "Especialidad",
      dataIndex: "nombre",
      align: "center",
      sorter: {
        compare: (a, b) => a.nombre.localeCompare(b.nombre),
        multiple: 3,
      },
      filters: filterEspecialidad,
      onFilter: (value, data) => data.nombre.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Teléfono",
      dataIndex: "celular",
      align: "center",
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      align: "center",
      sorter: {
        compare: (a, b) => a.direccion.localeCompare(b.direccion),
        multiple: 4,
      },
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
    item.nombre_apellido.toLowerCase().includes(searchText.toLowerCase()) || 
    item.cedula.toLowerCase().includes(searchText.toLowerCase())
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
    fetchMedics();
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
    fetchMedics();
  };

  return (
    <div className="medic">
      <div className="header-content">
        <h3>Médico</h3>
        <div className="d-flex p-0 m-0 align-items-center">
          <div className="input-group d-flex border align-items-center me-3">
            <SearchOutlined className="mx-2"/>
            <Input className="rounded-pill"
              placeholder="Buscar médico"
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
        rowKey={"id_medico"}
        pagination={tableParams.pagination}
        onChange={handleTableChange} />
      <EditCreateMedic
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        initialValues={currentItem}
        action={action} />
      <DeletePacient 
        isDeleteModalOpen={isDeleteModalOpen}
        handleDelete={handleDelete}
        handleDeleteCancel={handleDeleteCancel}
        initialValues={currentItem} />
    </div>
  );
};

export default Medic;