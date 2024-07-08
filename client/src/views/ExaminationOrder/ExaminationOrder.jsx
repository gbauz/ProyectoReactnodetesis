import "./ExaminationOrder.css";
import React, { useEffect, useState } from "react";
import { Space, Table, Tag, Button, notification, Input, Tooltip } from "antd";
import EditCreateExaminationOrder from "./Edit-Create/EditCreateExaminationOrder";
import ExaminationOrderService from "../../services/ExaminationOrderService";
import { DeleteFilled, EditFilled, FilePdfOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Notification from "../../components/Notification/Notification";
import DeleteExaminationOrder from "./Delete/DeleteExaminationOrder";
import moment from 'moment';

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
      pageSize: 7,
      pageSizeOptions: [7, 10, 20, 50, 100],
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
    element.medico.forEach(medic => {
      if (!uniqueMedic.has(medic.nombre_apellido)) {
        uniqueMedic.add(medic.nombre_apellido);
        filterMedic.push({
          text: medic.nombre_apellido,
          value: medic.nombre_apellido,
        });
      }
    })
  });

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
      title: "Médico",
      dataIndex: "medico",
      align: "center",
      render: (_, { medico }) => (
        <>
          {medico.map((medic) => {
            return (
              <Tag key={medic.id_medico}>
                 {medic.nombre_apellido} ({medic.especialidad})
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Análisis",
      dataIndex: "analisis",
      align: "center",
      render: (_, { medico }) => (
        <>
          {medico.map((medic) => 
            medic.analisis.map((analysis) => (
              <Tag key={analysis.id_analisis}>
                {analysis.analisis}
              </Tag>
            ))
          )}
        </>
      ),
    },
    {
      title: "Examen",
      dataIndex: "examen",
      align: "center",
      render: (_, { medico }) => (
        <>
          {medico.map((medic) => 
            medic.analisis.map((analysis) => 
              analysis.examen.map((exam) => (
                <Tag key={exam.id_examen}>
                  {exam.examen}
                </Tag>
              )
            ))
          )}
        </>
      ),
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      align: "center",
      sorter: {
        compare: (a, b) => new Date(a.fecha) - new Date(b.fecha),
        multiple: 6,
      },
      render: (text) => moment(text).format('DD-MM-YYYY HH:mm:ss'),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title='Descargar orden'>
            <Button className="actions" onClick={() => downloadOrder(record)}>
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
    item.paciente.toLowerCase().includes(searchText.toLowerCase())
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

  //Descargar Orden
  const downloadOrder = (data) => {
    console.log(data);
  }

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
        rowKey={"id_realizar"}
        pagination={tableParams.pagination}
        onChange={handleTableChange} />
      <EditCreateExaminationOrder
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        initialValues={currentItem}
        action={action} />
      <DeleteExaminationOrder 
        isDeleteModalOpen={isDeleteModalOpen}
        handleDelete={handleDelete}
        handleDeleteCancel={handleDeleteCancel}
        initialValues={currentItem} />
    </div>
  );
};

export default ExaminationOrder;

// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import DataTable from 'react-data-table-component';
// import RealizarExamen from './realizarExamen'; // Import the RealizarExamen component
// import EditarExamenModal from './EditarExamenModal'; // Import the EditarExamenModal component
// import Uri from '../../environment/environment';

// const ExaminationOrder = () => {
//   const [examenes, setExamenes] = useState([]);
//   const [filteredExamenes, setFilteredExamenes] = useState([]);
//   const [userPermissions, setUserPermissions] = useState([]);
//   const [search, setSearch] = useState('');
//   const [showRealizarExamen, setShowRealizarExamen] = useState(false);
//   const [showEditarExamen, setShowEditarExamen] = useState(false);
//   const [selectedExamen, setSelectedExamen] = useState(null);
//   const [error, setError] = useState(null); // Error general de la tabla
//   const [modalError, setModalError] = useState(null); // Error específico del modal

//   const fetchSession = async () => {
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         setError('Token no encontrado en sessionStorage');
//         return;
//       }

//       const sessionResponse = await fetch(Uri+'session', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (sessionResponse.ok) {
//         const sessionData = await sessionResponse.json();
//         setUserPermissions(sessionData.user.permissions);
//       } else {
//         setError('Error al obtener la sesión del usuario.');
//       }
//     } catch (error) {
//       console.error('Error al obtener la sesión del usuario:', error);
//       setError('Error al obtener la sesión del usuario.');
//     }
//   };

//   const fetchExamenes = async () => {
//     try {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         console.error('Token no encontrado en sessionStorage');
//         return;
//       }

//       const examenesResponse = await fetch(Uri+'mantenexamenes', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (examenesResponse.ok) {
//         const examenesData = await examenesResponse.json();
//         setExamenes(examenesData.mantexamen);
//         setFilteredExamenes(examenesData.mantexamen);
//       } else {
//         console.error('Error fetching examenes:', examenesResponse.statusText);
//       }
//     } catch (error) {
//       console.error('Error fetching examenes:', error);
//     }
//   };

//   useEffect(() => {
//     fetchSession();
//     fetchExamenes();
//   }, []);

//   useEffect(() => {
//     // const result = examenes.filter(examen =>
//     //   examen.cedula_paciente.toLowerCase().includes(search.toLowerCase()) ||
//     //   examen.paciente.toLowerCase().includes(search.toLowerCase()) ||
//     //   examen.nombre_medico.toLowerCase().includes(search.toLowerCase())
//     // );
//     // setFilteredExamenes(result);
//   }, [search, examenes]);

//   const handleOpenRealizarExamen = () => {
//     setShowRealizarExamen(true);
//     setModalError(null);
//   };

//   const handleCloseRealizarExamen = () => {
//     setShowRealizarExamen(false);
//     setModalError(null);
//   };

//   const handleOpenEditarExamen = (examen) => {
//     setSelectedExamen(examen);
//     setShowEditarExamen(true);
//     setModalError(null);
//   };

//   const handleCloseEditarExamen = () => {
//     setShowEditarExamen(false);
//     setSelectedExamen(null);
//     setModalError(null);
//   };

//   // Columnas para la tabla de exámenes realizados
//   const columns = [
//     {
//       name: 'Cédula Paciente',
//       selector: row => row.cedula,
//       sortable: true,
//     },
//     {
//       name: 'Paciente',
//       selector: row => row.paciente,
//       sortable: true,
//     },
//     {
//       name: 'Médico',
//       selector: row => row.nombre_apellido,
//       sortable: true,
//     },
//     {
//       name: 'Fecha',
//       selector: row => row.fecha,
//       sortable: true,
//     },
//     {
//       name: 'Acciones',
//       cell: row => (
//         <>
//           <button title="Editar" className="btn btn-primary btn-sm mr-2 action-button" onClick={() => handleOpenEditarExamen(row)}>
//             <i className="fas fa-edit"></i>
//           </button>
//         </>
//       ),
//     },
//   ];

//   if (showRealizarExamen) {
//     return <RealizarExamen onClose={handleCloseRealizarExamen} />;
//   }

//   return (
//     <div className="container mt-4">
//       <h4>Mantenimiento de Exámenes</h4>
//       <div className="d-flex justify-content-end mb-3">
//         <input
//           type="text"
//           className="form-control w-25 mr-2"
//           placeholder="Buscar..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <button className="btn btn-success" onClick={handleOpenRealizarExamen}>
//           <i className="fas fa-plus"></i> Nuevo
//         </button>
//       </div>
//       {modalError && (
//         <div className="alert alert-danger mt-3" role="alert">
//           {modalError}
//         </div>
//       )}
//       <DataTable
//         columns={columns}
//         data={filteredExamenes}
//         pagination
//         highlightOnHover
//         pointerOnHover
//         responsive
//         customStyles={{
//           headCells: {
//             style: {
//               backgroundColor: '#135ea9',
//               color: '#ffffff',
//               border: '1px solid #ccc',
//             },
//           },
//         }}
//       />
//       {showEditarExamen && (
//         <EditarExamenModal
//           examen={selectedExamen}
//           onClose={handleCloseEditarExamen}
//         />
//       )}
//     </div>
//   );
// };

// export default ExaminationOrder;