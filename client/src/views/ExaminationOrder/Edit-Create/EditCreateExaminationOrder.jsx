import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Modal, notification, Row, Select, Space, Table, Tooltip } from "antd";
import './EditCreateExaminationOrder.css'
import ExaminationOrderService from "../../../services/ExaminationOrderService";
import PatientService from "../../../services/PatientService";
import MedicService from "../../../services/MedicService";
import AnalysisService from "../../../services/AnalysisService";
import ExamService from "../../../services/ExamService";
import { DeleteFilled } from "@ant-design/icons";
import Notification from "../../../components/Notification/Notification";

const EditCreateExaminationOrder = ({ isModalOpen, handleSubmit, handleCancel, initialValues, action }) => {
  const [form]                              = Form.useForm();
  const [isEditing, setIsEditing]           = useState(false);
  const [error, setError]                   = useState(null);
  const [loading, setLoading]               = useState(false);
  const [api, contextHolder]                = notification.useNotification(); //Notification
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
      pageSizeOptions: [5, 10, 20, 50, 100],
      showQuickJumper: true,
      position: ["bottomRight"]
    },
  });
  // const [loadingSelect, setloadingSelect]   = useState(false);
  let response;
  let columns                         = [];
  const [dataPatient, setDataPatient]       = useState([]);
  const [PacientOptions, setPacientOptions] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');

  const [dataMedic, setDataMedic]       = useState([]);
  const [medicOptions, setMedicOptions] = useState('');
  const [selectedMedic, setSelectedMedic] = useState('');

  const [dataAnalysis, setDataAnalysis] = useState([]);
  const [AnalysisOptions, setAnalysisOptions] = useState('');
  const [selectedAnalisis, setSelectedAnalisis] = useState('');

  const [dataExam, setDataExam] = useState([]);
  const [examOptions, setExamOptions] = useState('');
  const [selectedExam, setSelectedExam] = useState('');

  const [examenesInitial, setExamenesInitial] = useState([]);
  const [examenesSeleccionados, setExamenesSeleccionados] = useState([]);
  const [dataLastID , setDataLastID] = useState([]);

  useEffect(() => {
    if (action==='Edit') {
      let nuevosExamenesSeleccionados = [];
      form.setFieldsValue(initialValues);
      setIsEditing(true);
      setSelectedPatient(initialValues.id_paciente)
      setSelectedMedic(initialValues.id_medico);
      getAnalysis(initialValues.especialidad);
      for (const analysis of initialValues.analisis) {
        for (const examen of analysis.examen) {
          nuevosExamenesSeleccionados.push({
            id: examen.id_realizar,
            id_paciente: initialValues.id_paciente,
            paciente: initialValues.paciente,
            id_medico: initialValues.id_medico,
            medico: initialValues.nombre_apellido,
            id_analisis: analysis.id_analisis,
            analisis: analysis.analisis,
            id_examen: examen.id_examen,
            examen: examen.examen,
          });
        }
      }
      setExamenesInitial(nuevosExamenesSeleccionados);
      setExamenesSeleccionados(nuevosExamenesSeleccionados);
    } 
    if (action==='Create'){
      form.resetFields();
      setIsEditing(false);
      setSelectedPatient('')
      setSelectedMedic('');
    }
    getPatients();
    getMedic();
    setDataLastID(getLastID());
  }, [isModalOpen, initialValues, form, action]);

  useEffect(() => {
    if (dataAnalysis.length) {
      setAnalysisOptions(dataAnalysis.map(item => ({
        value: item.id_analisis,
        label: item.analisis,
      })));
    }
  }, [dataAnalysis]);

  useEffect(() => {
    if (dataExam.length) {
      setExamOptions(dataExam.map(item => ({
        value: item.id_examen,
        label: item.examen,
      })));
    }
  }, [dataExam]);

  //Lógica de Pacientes
  const getPatients = async () => {
    // setloadingSelect(true);
    try {
      response = await PatientService.getPatients();
      const patients = response.data.pacientes.map(patient => ({
        value: patient.id_paciente,
        label: patient.cedula,
        paciente: patient.paciente
      }));
      setDataPatient(patients);
      setPacientOptions(patients);
    } catch (error) {
      setDataPatient('');
      setError(error);
    } finally {
      // setLoading(false);
    }
  }
  const filter = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const handlePatientChange = (value) => {
    setSelectedPatient(value);
    const selectedPatient = PacientOptions.find(option => option.value === value);
    form.setFieldsValue({
      paciente: selectedPatient ? selectedPatient.paciente : ''
    });
  };

  //Lógica de Médico
  const getMedic = async () => {
    // setloadingSelect(true);
    try {
      response = await MedicService.getMedics();
      const medics = response.data.medicos.map(medic => ({
        value: medic.id_medico,
        label: medic.cedula,
        nombre_apellido: medic.nombre_apellido,
        nombre: medic.nombre
      }));
      setDataMedic(medics);
      setMedicOptions(medics);
    } catch (error) {
      setDataMedic('');
      setError(error);
    } finally {
      // setLoading(false);
    }
  }
  const filterMedic = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const handleMedicChange = (value) => {
    setSelectedMedic(value);
    const selectedMedico = medicOptions.find(option => option.value === value);
    form.setFieldsValue({
      nombre_apellido: selectedMedico ? selectedMedico.nombre_apellido : ''
    });
    getAnalysis(selectedMedico.nombre); //Enviar a cargar los analisis
    setSelectedAnalisis('');
  };

  //Lógica de Analisis
  const getAnalysis = async (name) => {
    // setloadingSelect(true);
    try {
      response = await AnalysisService.getAnalysisMedic(name);
      (response.request.status === 200 && response.data.analisis.length) ? 
        setDataAnalysis(response.data.analisis) : 
        setSelectedMedic('');
    } catch (error) {
      setDataAnalysis('');
      setError(error);
    } finally {
      // setLoading(false);
    }
  }
  const filterAnalysis = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const handleAnalysisChange = (value) => {
    setSelectedAnalisis(value);
    getExam(value);
    setSelectedExam('');
  };

  //Lógica de Examen
  const getExam = async (id_analisis) => {
    // setloadingSelect(true);
    try {
      response = await ExamService.getExamAnalysis(id_analisis);
      (response.request.status === 200) ? setDataExam(response.data) : setSelectedAnalisis('');
    } catch (error) {
      setDataExam('');
      setError(error);
    } finally {
      // setLoading(false);
    }
  }
  const filterExam = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const handleExamChange = (value) => {
    setSelectedExam(value);
  };

  //Lógica de último registrado
  const getLastID = async () => {
    try {
      response = await ExaminationOrderService.lastExaminationOrder();
      setDataLastID(response.data.mantexamen);
    } catch (error) {
      setDataLastID([]);
      setError(error);
    }
  }

  //Lógica de obtener por ID
  const getExamID = async (id_paciente, id_examen, id_analisis) => {
    try {
      response = await ExaminationOrderService.getExamID(id_paciente, id_examen, id_analisis);
      return response.data.mantexamen;
    } catch (error) {
      setError(error);
      return [];
    }
  }

  const handleAgregarExamen = async () => {
    if (selectedAnalisis && selectedExam && selectedPatient) {
      //Busco las coincidencias
      const pacienteSeleccionado = dataPatient.find(a => a.value === parseInt(selectedPatient));
      const medicoSeleccionado = dataMedic.find(a => a.value === parseInt(selectedMedic));
      const analisisSeleccionado = dataAnalysis.find(a => a.id_analisis === parseInt(selectedAnalisis));
      const examenSeleccionado = dataExam.find(e => e.id_examen === parseInt(selectedExam));
      if (analisisSeleccionado && examenSeleccionado) {
        //Buscar duplicados en la base de datos
        const dataExamID = await getExamID(pacienteSeleccionado.value, analisisSeleccionado.id_analisis, examenSeleccionado.id_examen);
        //Buscar dupicados en el arreglo
        const isDuplicate = examenesSeleccionados.some(examen => 
          examen.id_paciente === pacienteSeleccionado.value &&
          examen.id_analisis === analisisSeleccionado.id_analisis &&
          examen.id_examen === examenSeleccionado.id_examen
        );
        if (!isDuplicate && !dataExamID.length) {
          let newId = dataLastID.length ? dataLastID[0].id_realizar + 1 : examenesSeleccionados.length + 1;
          setExamenesSeleccionados([
            ...examenesSeleccionados,
            { 
              id: newId.toString(),
              id_paciente: pacienteSeleccionado.value,
              paciente: pacienteSeleccionado.paciente,
              id_medico: medicoSeleccionado.value,
              medico: medicoSeleccionado.nombre_apellido,
              id_analisis: analisisSeleccionado.id_analisis,
              analisis: analisisSeleccionado.analisis,
              id_examen: examenSeleccionado.id_examen,
              examen: examenSeleccionado.examen
            }
          ]);
          setDataLastID([{ id_realizar: newId }]);
        } else {
          let axiosResponse = {
            status: 400,
            response: {
              data: {
                error: "El examen seleccionado ya ha sido registrado!"
              }
            }
          }
          Notification(api, axiosResponse);
        }
        setSelectedAnalisis('');
        setSelectedExam('');
      }
    }
  };

  const handleEliminarExamen = (index) => {
    const newExamenesSeleccionados = [...examenesSeleccionados];
    newExamenesSeleccionados.splice(index, 1);
    setExamenesSeleccionados(newExamenesSeleccionados);
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
      ellipsis: true,
    },
    {
      title: "Médico",
      dataIndex: "medico",
      sorter: {
        compare: (a, b) => a.medico.localeCompare(b.medico),
        multiple: 2,
      },
      ellipsis: true,
    },
    {
      title: "Análisis",
      dataIndex: "analisis",
      sorter: {
        compare: (a, b) => a.analisis.localeCompare(b.analisis),
        multiple: 3,
      },
      ellipsis: true,
    },
    {
      title: "Examen",
      dataIndex: "examen",
      align: "center",
      sorter: {
        compare: (a, b) => a.examen.localeCompare(b.examen),
        multiple: 4,
      },
      ellipsis: true,
    },
    {
      title: "Acción",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title='Eliminar'>
            <Button className="actions" onClick={() => handleEliminarExamen(record)}>
              <DeleteFilled className="delete-icon" />
            </Button>
          </Tooltip>
        </Space>
      ),
      width: 80,
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

  const clean = () => {
    setDataAnalysis([]);
    setDataExam([]);
    setAnalysisOptions([]);
    setExamOptions([])
    setExamenesSeleccionados([]);
    setExamenesInitial([]);
    setSelectedPatient('');
    setSelectedMedic('');
    setSelectedAnalisis('');
    setSelectedExam('');
    setDataLastID([]);
    form.resetFields();
  }

  const handleCancelModal = () => {
    clean();
    handleCancel();
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const examenesData = examenesSeleccionados.map(examen => ({
          id_paciente: examen.id_paciente,
          id_medico: examen.id_medico,
          id_analisis: examen.id_analisis,
          id_examen: examen.id_examen
        }));
      if (action==='Edit') {
        //Eliminar los examenes anteriores
        for (const examen of examenesInitial) {
          await ExaminationOrderService.deleteExaminationOrder(examen.id);
        }
        //Agregar los nuevos examenes
        for (const examen of examenesData) {
          response = await ExaminationOrderService.createExaminationOrder(examen);
        }
      }
      if (action==='Create') {
        for (const examen of examenesData) {
          response = await ExaminationOrderService.createExaminationOrder(examen);
        }
      }
    } catch (error) {
      setError(error);
    }finally {
      setLoading(false);
      if (response) {
        handleSubmit(response);
        clean();
      }
    }
  };

  return (
    <Modal
      title={isEditing ? "Editar Orden de Examen" : "Crear Orden de Examen"}
      open={isModalOpen}
      onCancel={handleCancelModal}
      centered
      maskClosable={false}
      footer={null}
      width={1000}
    >
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={onFinish} preserve={false}>
        <Row align={"middle"}>
          <Col span={8}>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Form.Item name="id_paciente" label="Cédula" rules={[{ required: true, message: 'Por favor ingrese un número de cédula!' }]}>
                {/* <Select loading={loadingSelect} options={analisisOptions} /> */}
                  <Select showSearch
                    disabled={isEditing}
                    value={selectedPatient}
                    filterOption={filter}
                    options={PacientOptions} 
                    onChange={handlePatientChange}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="paciente" label="Paciente" rules={[{ required: true, message: 'Por favor busque un paciente!' }]}>
                  <Input disabled/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Form.Item name="id_medico" label="Cédula" rules={[{ required: true, message: 'Por favor ingrese un número de cédula!' }]}>
                  {/* <Select loading={loadingSelect} options={analisisOptions} /> */}
                  <Select showSearch
                    disabled={isEditing}
                    value={selectedMedic}
                    filterOption={filterMedic}
                    options={medicOptions} 
                    onChange={handleMedicChange}/>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="nombre_apellido" label="Médico" rules={[{ required: true, message: 'Por favor busque un médico!' }]}>
                  <Input disabled/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name="id_analisis" label="Análisis">
                  <Select showSearch
                    filterOption={filterAnalysis}
                    options={AnalysisOptions}
                    value={selectedAnalisis}
                    onChange={handleAnalysisChange}
                    disabled={!selectedMedic}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name="id_examen" label="Exámenes">
                  <Select showSearch
                    filterOption={filterExam}
                    options={examOptions}
                    value={selectedExam}
                    onChange={handleExamChange}
                    disabled={!selectedAnalisis}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row justify={"center"}>
              <Col span={6}>
                <Button onClick={handleAgregarExamen} disabled={!selectedAnalisis || !selectedExam || !selectedPatient}>Agregar Examen</Button>
              </Col>
            </Row>
          </Col>
          <Col span={16}>
            <Table responsive
              columns={columns}
              dataSource={examenesSeleccionados}
              rowKey={"id"}
              pagination={tableParams.pagination}
              onChange={handleTableChange} />
          </Col>
        </Row>
        <Form.Item className="footer">
          <Button key="back" onClick={handleCancelModal} style={{marginRight:'15px'}}>
            Cancelar
          </Button>
          <Button htmlType="submit" style={{background: '#4096FF', color:'white'}} loading={loading} disabled={!examenesSeleccionados.length}>
            {isEditing ? "Editar" : "Crear"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCreateExaminationOrder;
