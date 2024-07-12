import "./Rol.css";
import React, { useEffect, useState } from "react";
import { Space, Table, Button, notification, Input, Tooltip, Tag } from "antd";
import { DeleteFilled, EditFilled, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Notification from "../../components/Notification/Notification";
import RolService from "../../services/RolService";
import EditCreateRol from "./Edit-Create/EditCreateRol";
import DeleteRol from "./Delete/DeleteRol";

const Rol = () => {
  let columns                         = [];
  const [data, setData]               = useState([]);
  const [error, setError]             = useState(null);
  const [loading, setLoading]         = useState(false);
  const [searchText, setSearchText]   = useState('');
  const [api, contextHolder]          = notification.useNotification(); //Notification
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
      pageSizeOptions: [5, 10, 20, 50, 100],
      showQuickJumper: true,
      position: ["bottomRight"]
    },
  });
  const fetchRols = async () => {
    setLoading(true);
    try {
      const response = await RolService.getRols();
      setData(response.data.roles);
      console.log(response.data.roles);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRols();
  }, []);

  //Llenar columnas
  columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      sorter: {
        compare: (a, b) => a.nombre.localeCompare(b.nombre),
        multiple: 1,
      },
    },
    {
      title: "Permisos",
      dataIndex: "permisos",
      align: "center",
      render: (_, { permisos }) => (
        <>
          {permisos.map((permission) => 
            <Tag key={permission.id_permiso}>
              {permission.permiso_nombre}
            </Tag>
          )}
        </>
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
    fetchRols();
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
    fetchRols();
  };

  return (
    <div className="rol">
      <div className="header-content">
        <h3>Roles</h3>
        <div className="d-flex p-0 m-0 align-items-center">
          <div className="input-group d-flex border align-items-center me-3">
            <SearchOutlined className="mx-2"/>
            <Input className="rounded-pill"
              placeholder="Buscar rol"
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
        rowKey={"id_rol"}
        pagination={tableParams.pagination}
        onChange={handleTableChange} />
      <EditCreateRol
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        initialValues={currentItem}
        action={action} />
      <DeleteRol
        isDeleteModalOpen={isDeleteModalOpen}
        handleDelete={handleDelete}
        handleDeleteCancel={handleDeleteCancel}
        initialValues={currentItem} />
    </div>
  );
};

export default Rol;