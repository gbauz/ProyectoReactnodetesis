import "./Pacient.css";
import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Button, notification, Input } from "antd";
import EditCreatePacient from "./Edit-Create/EditCreatePacient";
import PacienteService from "../../services/PacientService";
import { DeleteFilled, EditFilled, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Notification from "../Notification/Notification";
import DeletePacient from "./Delete/DeletePacient";
import moment from 'moment';

const Paciente = () => {
  let columns                         = [];
  let filterSexo                      = [];
  let uniqueSexos                     = new Set();
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
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await PacienteService.getPatients();
      setData(response.data.users);
      // console.log(response);
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
    if (!uniqueSexos.has(element.sexo)) {
      uniqueSexos.add(element.sexo);
      filterSexo.push({
        text: element.sexo,
        value: element.sexo,
      });
    }
  });

  //Llenar columnas
  columns = [
    {
      title: "Nombre",
      dataIndex: "paciente",
      sorter: {
        compare: (a, b) => a.paciente.localeCompare(b.paciente),
        multiple: 1,
      },
    },
    {
      title: "Cedula",
      dataIndex: "cedula",
      align: "center",
      sorter: {
        compare: (a, b) => a.cedula - b.cedula,
        multiple: 2,
      },
    },
    {
      title: "Edad",
      dataIndex: "edad",
      align: "center",
      sorter: {
        compare: (a, b) => a.edad - b.edad,
        multiple: 3,
      },
    },
    {
      title: "Sexo",
      dataIndex: "sexo",
      sorter: {
        compare: (a, b) => a.sexo.localeCompare(b.sexo),
        multiple: 4,
      },
      filters: filterSexo,
      onFilter: (value, data) => data.sexo.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Telefono",
      dataIndex: "celular",
      align: "center",
    },
    {
      title: "Fecha de ingreso",
      dataIndex: "fecha_de_ingreso",
      align: "center",
      sorter: {
        compare: (a, b) => new Date(a.fecha_de_ingreso) - new Date(b.fecha_de_ingreso),
        multiple: 5,
      },
      render: (text) => moment(text).format('DD-MM-YYYY'),
    },
    // {
    //   title: "Tags",
    //   key: "tags",
    //   dataIndex: "tags",
    //   align: "center",
    //   render: (_, { tags }) => (
    //     <>
    //       {tags.map((tag) => {
    //         let color = tag.length > 5 ? "geekblue" : "green";
    //         if (tag === "loser") {
    //           color = "volcano";
    //         }
    //         return (
    //           <Tag color={color} key={tag}>
    //             {tag.toUpperCase()}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button className="actions" onClick={() => showEditCreateModal(record, 'Edit')}>
            <EditFilled className="edit-icon"/>
          </Button>
          <Button className="actions" onClick={() => showDeleteModal(record)}>
            <DeleteFilled className="delete-icon" />
          </Button>
        </Space>
      ),
    },
  ];

  //Propiedades de la tabla
  const handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination)
    console.log(filters)
    console.log(sorter)
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
  };
  const filteredData = data.filter(item => 
    item.paciente.toLowerCase().includes(searchText.toLowerCase()) || 
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
    <div className="paciente">
      <div className="header-content">
        <h3>Paciente</h3>
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
        rowKey={"cedula"}
        pagination={tableParams.pagination}
        onChange={handleTableChange} />
      <EditCreatePacient
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

export default Paciente;