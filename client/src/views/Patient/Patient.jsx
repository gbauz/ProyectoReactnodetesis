import "./Patient.css";
import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Button, notification, Input, Tooltip } from "antd";
import EditCreatePacient from "./Edit-Create/EditCreatePatient";
import PatienteService from "../../services/PatientService";
import { DeleteFilled, EditFilled, FilePdfOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Notification from "../../components/Notification/Notification";
import DeletePatient from "./Delete/DeletePatient";
import moment from 'moment';
import jsPDF from "jspdf";


const Patient = () => {
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
      pageSize: 7,
      pageSizeOptions: [7, 10, 20, 50, 100],
      showQuickJumper: true,
      position: ["bottomRight"]
    },
  });
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await PatienteService.getPatients();
      setData(response.data.pacientes);
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
      title: "Cédula",
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
      title: "Teléfono",
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

  //Crear Reporte PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(20, 20, 'Reporte de Pacientes');
    const usersData = data.map(pacientes => [pacientes.paciente, pacientes.cedula, pacientes.edad, pacientes.sexo, pacientes.celular, pacientes.fecha]);
    doc.autoTable({
      head: [['Nombre', 'Cédula', 'Edad', 'Sexo', 'Celular', 'Fecha de Ingreso']],
      body: usersData,
    });
    doc.save('reporte_pacientes.pdf');
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
        rowKey={"id_paciente"}
        pagination={tableParams.pagination}
        onChange={handleTableChange} 
        scroll={{ x: 'max-content' }}
        className="table-responsive"/>
      <EditCreatePacient
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        initialValues={currentItem}
        action={action} />
      <DeletePatient 
        isDeleteModalOpen={isDeleteModalOpen}
        handleDelete={handleDelete}
        handleDeleteCancel={handleDeleteCancel}
        initialValues={currentItem} />
    </div>
  );
};

export default Patient;