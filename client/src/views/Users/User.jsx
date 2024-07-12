import "./User.css";
import React, { useEffect, useState } from "react";
import { Space, Table, Button, notification, Input, Tooltip } from "antd";
import EditCreateUser from "./Edit-Create/EditCreateUser";
import { DeleteFilled, EditFilled, FilePdfOutlined, FormOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import DeleteUser from "./Delete/DeleteUser";
import Notification from "../../components/Notification/Notification";
import UserService from "../../services/UserService";
import jsPDF from "jspdf";
import PasswordUser from "./Password/PasswordUser";

const User = () => {
  let columns                         = [];
  let filterRol                       = [];
  let uniqueRol                       = new Set();
  const [data, setData]               = useState([]);
  const [error, setError]             = useState(null);
  const [loading, setLoading]         = useState(false);
  const [searchText, setSearchText]   = useState('');
  const [api, contextHolder]          = notification.useNotification(); //Notification
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 6,
      pageSizeOptions: [6, 10, 20, 50, 100],
      showQuickJumper: true,
      position: ["bottomRight"]
    },
  });
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await UserService.getUsers();
      setData(response.data.users);
      console.log(response);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  //Llenar filtros
  data.forEach(element => {
    if (!uniqueRol.has(element.rol)) {
      uniqueRol.add(element.rol);
      filterRol.push({
        text: element.rol,
        value: element.rol,
      });
    }
  });

  //Llenar columnas
  columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      sorter: {
        compare: (a, b) => a.paciente.localeCompare(b.paciente),
        multiple: 1,
      },
    },
    {
      title: "Cédula",
      dataIndex: "cedula",
      align: "center",
      sorter: {
        compare: (a, b) => a.cedula.localeCompare(b.cedula),
        multiple: 2,
      },
    },
    {
      title: "E-mail",
      dataIndex: "correo_electronico",
      align: "center",
    },
    {
      title: "Rol",
      dataIndex: "rol",
      align: "center",
      sorter: {
        compare: (a, b) => a.rol.localeCompare(b.rol),
        multiple: 4,
      },
      filters: filterRol,
      onFilter: (value, data) => data.rol.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Contraseña",
      key: "password",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title='Cambiar contraseña'>
            <Button className="actions" onClick={() => showModifyModal(record)}>
              <FormOutlined className="edit-icon"/>
            </Button>
          </Tooltip>
        </Space>
      ),
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
    item.cedula.toLowerCase().includes(searchText.toLowerCase()) || 
    item.nombre.toLowerCase().includes(searchText.toLowerCase())
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
    fetchUsers();
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
    fetchUsers();
  };

  //Modify Password
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const showModifyModal = (item) => {
    setCurrentItem(item);
    setIsModifyModalOpen(true);
  };
  const handleModifyCancel = () => {
    setIsModifyModalOpen(false);
  };
  const handleModify = (axiosResponse) => {
    Notification(api, axiosResponse);
    setIsModifyModalOpen(false);
    fetchUsers();
  };

  //Crear Reporte PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(20, 20, 'Reporte de Usuarios');
    const usersData = data.map(user => [user.nombre, user.cedula, user.correo_electronico, user.rol]);
    doc.autoTable({
      head: [['Nombre', 'Cédula', 'Correo Electrónico', 'Rol']],
      body: usersData,
    });
    doc.save('reporte_usuarios.pdf');
  };

  return (
    <div className="usuario">
      <div className="header-content">
        <h3>Usuarios</h3>
        <div className="d-flex p-0 m-0 align-items-center">
          <div className="input-group d-flex border align-items-center me-2">
            <SearchOutlined className="mx-2"/>
            <Input className="rounded-pill"
              placeholder="Buscar usuario"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </div>
          <Button className="rounded-pill me-2" type="primary" onClick={generatePDF}>
            <FilePdfOutlined /> Reporte
          </Button>
          <Button className="rounded-pill" type="primary" onClick={() => showEditCreateModal(null, 'Create')}>
            <PlusCircleOutlined /> Crear
          </Button>
        </div>
      </div>
      {contextHolder}
      <Table responsive
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        rowKey={"cedula"}
        pagination={tableParams.pagination}
        onChange={handleTableChange} />
      <PasswordUser 
        isModifyModalOpen={isModifyModalOpen}
        handleModify={handleModify}
        handleModifyCancel={handleModifyCancel}
        initialValues={currentItem} />
      <EditCreateUser
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        initialValues={currentItem}
        action={action} />
      <DeleteUser 
        isDeleteModalOpen={isDeleteModalOpen}
        handleDelete={handleDelete}
        handleDeleteCancel={handleDeleteCancel}
        initialValues={currentItem} />
    </div>
  );
};

export default User;