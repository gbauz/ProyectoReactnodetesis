import "./Pacient.css";
import React, { useState } from "react";
import { Space, Table, Tag, Button, notification } from "antd";
import EditCreatePacient from "./Edit-Create/EditCreatePacient";
import PacienteService from "../../services/PacientService";
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons";
import Notification from "../Notification/Notification";
import DeletePacient from "./Delete/DeletePacient";

const Paciente = () => {
  let data = [];
  let columns = [];
  let filter = [];
  const [api, contextHolder] = notification.useNotification(); //Notification
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 6,
      pageSizeOptions: [6, 10, 20, 50, 100],
      showQuickJumper: true,
      position: ["bottomRight"]
    },
  });
  
  //Cargar data
  // data = [
  //   {
  //     id: "1",
  //     name: "John Brown",
  //     chinese: 98,
  //     math: 60,
  //     english: 22,
  //     tags: ["nice", "developer"],
  //   },
  //   {
  //     id: "2",
  //     name: "Jim Green",
  //     chinese: 98,
  //     math: 60,
  //     english: 40,
  //     tags: ["loser"],
  //   },
  //   {
  //     id: "3",
  //     name: "Joe Black",
  //     chinese: 98,
  //     math: 90,
  //     english: 10,
  //     tags: ["cool", "teacher"],
  //   },
  //   {
  //     id: "4",
  //     name: "Jim Red",
  //     chinese: 88,
  //     math: 99,
  //     english: 89,
  //     tags: ["nice", "developer"],
  //   },
  // ];

  //Data de prueba
  for (let i = 0; i < 100; i++) {
    data.push({
      id: i,
      name: "John Brown",
      chinese: 98,
      math: 60,
      english: 22,
      tags: ["nice", "developer"],
    });
  }

  //Llenar filtros
  data.forEach(element => {
    filter.push({
      text: element.name,
      value: element.name,
    })
  });

  //Llenar columnas
  columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: {
        compare: (a, b) => a.name - b.name,
        multiple: 4,
      },
      filters: filter,
      onFilter: (value, record) => record.name.startsWith(value),
      filterSearch: true,
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Chinese Score",
      dataIndex: "chinese",
      align: "center",
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: "Math Score",
      dataIndex: "math",
      align: "center",
      sorter: {
        compare: (a, b) => a.math - b.math,
        multiple: 2,
      },
    },
    {
      title: "English Score",
      dataIndex: "english",
      align: "center",
      sorter: {
        compare: (a, b) => a.english - b.english,
        multiple: 1,
      },
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      align: "center",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
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
  const handleSubmit = (response, message, description) => {
    Notification(api, response, message, description);
    setIsModalOpen(false);
    //Aqui refrescar datos
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
  const handleDelete = (response) => {
    Notification(api, 'Exito', 'Exito', 'Has eliminado el paciente!');
    setIsDeleteModalOpen(false);
  };

  const tetsUsers = ()=> {
    PacienteService.getPatients();
  }

  return (
    <div className="paciente">
      <div className="header-content">
        <h3>Paciente</h3>
        <Button type="primary" onClick={() => showEditCreateModal(null, 'Create')}>
          <PlusCircleOutlined /> Crear
        </Button>
      </div>
      {contextHolder}
      <Table 
        columns={columns}
        dataSource={data}
        rowKey={"id"}
        pagination={tableParams.pagination}
        onChange={handleTableChange} />
      <EditCreatePacient
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        initialValues={currentItem}
        action={action}
      />
      <DeletePacient 
        isDeleteModalOpen={isDeleteModalOpen}
        handleDelete={handleDelete}
        handleDeleteCancel={handleDeleteCancel}
        initialValues={currentItem}
      />
      <Button onClick={() => tetsUsers()}>TestLlamadaAPI</Button>
    </div>
  );
};

export default Paciente;