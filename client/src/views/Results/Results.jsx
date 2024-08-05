import "./Results.css";
import React, { useEffect, useState } from "react";
import { Space, Table, Button, notification, Input, Tooltip, Tag } from "antd";
import EditCreateEspecialty from "./Edit-Create/EditCreateResults";
import { DeleteFilled, EditFilled, FilePdfOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Notification from "../../components/Notification/Notification";
import DeleteSpecialty from "./Delete/DeleteResults";
import SpecialtyService from "../../services/SpecialtyService";
import ResultService from "../../services/ResultService";
import apiClient from "../../services/AxiosAPI";

const Resultados = () => {
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
  const fetchResult = async () => {
    setLoading(true);
    try {
      const response = await ResultService.getResults();
      setData(response.data.resultadosData);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchResult();
  }, []);

  //Llenar columnas
  columns = [
    {
      title: "Cédula paciente",
      dataIndex: "paciente_cedula",
    },
    {
      title: "Paciente",
      dataIndex: "paciente",
      sorter: {
        compare: (a, b) => a.paciente.localeCompare(b.paciente),
        multiple: 1,
      },
    },
    {
      title: "Médico",
      dataIndex: "nombre_apellido",
      sorter: {
        compare: (a, b) => a.nombre_medico.localeCompare(b.nombre_medico),
        multiple: 2,
      },
    },
    {
      title: "Resultado",
      dataIndex: "resultado",
      align: "center",
      render: (_, { examen }) => (
        <Space size="middle">
          {examen.map((exam) => 
            <Tooltip title={exam.examen} key={exam.id_realizar}>
              <Button className="actions" onClick={() => downloadFile(exam)} disabled={(exam.id_resultado===null)?true:false}>
                <FilePdfOutlined className={(exam.id_resultado===null)? "":"download-icon"} />
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
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
    item.paciente_cedula.toLowerCase().includes(searchText.toLowerCase()) ||
    item.paciente.toLowerCase().includes(searchText.toLowerCase())        ||
    item.nombre_apellido.toLowerCase().includes(searchText.toLowerCase())
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
    fetchResult();
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
    fetchResult();
  };

  const downloadFile = async (value) => {
    console.log(value);
    const filePath = value.resultado;
    try {
      const response = await apiClient.get(filePath, {
        responseType: 'blob', // Importante para recibir el archivo como un blob
      });
      console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filePath.split('\\').pop());
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Liberar la URL del blob después de la descarga
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  }

  return (
    <div className="specialty">
      <div className="header-content">
        <h3>Resultados de examen</h3>
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
        rowKey={"id"}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
        className="table-responsive" />
      {isModalOpen && (
        <EditCreateEspecialty
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          initialValues={currentItem}
          action={action} />
      )}
      {isDeleteModalOpen && (
        <DeleteSpecialty 
          isDeleteModalOpen={isDeleteModalOpen}
          handleDelete={handleDelete}
          handleDeleteCancel={handleDeleteCancel}
          initialValues={currentItem} />
      )}
    </div>
  );
}

export default Resultados;