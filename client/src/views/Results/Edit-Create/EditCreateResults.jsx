import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, notification, Row, Select, Space, Table, Tooltip, Upload } from "antd";
import './EditCreateResults.css';
import ResultService from '../../../services/ResultService';
import MedicService from "../../../services/MedicService";
import PatientService from "../../../services/PatientService";
import { CheckCircleOutlined, CloudUploadOutlined, UploadOutlined } from "@ant-design/icons";
import Notification from "../../../components/Notification/Notification";
import Uri from "../../../environment/environment";

const EditCreateEspecialty = ({ isModalOpen, handleSubmit, handleCancel, initialValues, action }) => {
  const [form]                    = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(false);
  let response = '';
  let columns                     = [];
  const [api, contextHolder]      = notification.useNotification(); //Notification
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
      pageSizeOptions: [5, 10, 20, 50, 100],
      showQuickJumper: true,
      position: ["bottomRight"]
    },
  });
  const [dataPatient, setDataPatient]       = useState([]);
  const [PacientOptions, setPacientOptions] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');

  const [dataMedic, setDataMedic]       = useState([]);
  const [medicOptions, setMedicOptions] = useState('');
  const [selectedMedic, setSelectedMedic] = useState('');

  const [examenesInitial, setExamenesInitial] = useState([]);

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (action=='Edit') {
      let nuevosExamenes = [];
      console.log(initialValues);
      form.setFieldsValue(initialValues);
      setIsEditing(true);
      setSelectedPatient(initialValues.id_paciente);
      setSelectedMedic(initialValues.id_medico);
      for (let examen of initialValues.examen) {
        nuevosExamenes.push({
          id: examen.id_resultado,
          resultado: examen.resultado,
          id_realizar: examen.id_realizar,
          id_analisis: examen.id_analisis,
          analisis: examen.analisis,
          id_examen: examen.id_examen,
          examen: examen.examen,
        });
      }
      setFile(null);
      setExamenesInitial(nuevosExamenes);
    } 
    if (action=='Create'){
      form.resetFields();
      setExamenesInitial([]);
      setFile(null);
      setIsEditing(false);
    }
    getPatients();
    getMedic();
  }, [isModalOpen, initialValues, form, action]);

  //Lógica de Pacientes
  const getPatients = async () => {
    // setloadingSelect(true);
    try {
      response = await PatientService.getPatients();
      const patients = response.data.pacientes.map(patient => ({
        value: patient.id_paciente,
        label: `${patient.cedula} (${patient.paciente})`,
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
    if(selectedMedic) getExamOrder(value, selectedMedic);
  };

  //Lógica de Médico
  const getMedic = async () => {
    // setloadingSelect(true);
    try {
      response = await MedicService.getMedics();
      const medics = response.data.medicos.map(medic => ({
        value: medic.id_medico,
        label: `${medic.cedula} (${medic.nombre_apellido})`,
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
    if(selectedPatient) getExamOrder(selectedPatient, value);
  };

  //Lógica de obtener examenes
  const getExamOrder = async (id_paciente, id_medico) => {
    // setloadingSelect(true);
    try {
      response = await ResultService.getResultPacientMedic(id_paciente, id_medico);
      console.log(response);
      // const medics = response.data.medicos.map(medic => ({
      //   value: medic.id_medico,
      //   label: `${medic.cedula} (${medic.nombre_apellido})`,
      //   nombre_apellido: medic.nombre_apellido,
      //   nombre: medic.nombre
      // }))
      setExamenesInitial(response.data.resultadosData);
      // setMedicOptions(medics);
    } catch (error) {
      setDataMedic('');
      setError(error);
    } finally {
      // setLoading(false);
    }
  }

  //Lógica para subir archivo
  const uploadFile = async (value) => {
    let axiosResponse;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id_realizar', value.id_realizar);
    console.log("Subiendo", formData);
    setUploading(true);
    const token = sessionStorage.getItem('token');
    try {
      response = await fetch(Uri+'resultado', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if(response.status >= 200 && response.status < 300){
        axiosResponse = {
          status: 200,
          data: {
            message: "El archivo fue subido!!"
          }
        }
      }else{
        axiosResponse = {
          status: 500,
          response: {
            data: {
              error: "Hubo un error al subir el archivo!!"
            }
          }
        }
      }
    } catch (error) {
      setError(error)
    } finally {
      Notification(api, axiosResponse);
      setUploading(false);
      setFile(null);
    }
  }
  const props = {
    onRemove: () => {
      setFile(null);
    },
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
  };

  //Llenar columnas
  columns = [
    {
      title: "Análisis",
      dataIndex: "analisis",
      sorter: {
        compare: (a, b) => a.analisis.localeCompare(b.analisis),
        multiple: 1,
      },
      ellipsis: true,
    },
    {
      title: "Examen",
      dataIndex: "examen",
      align: "center",
      sorter: {
        compare: (a, b) => a.examen.localeCompare(b.examen),
        multiple: 2,
      },
      ellipsis: true,
    },
    {
      title: "Acción",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Upload {...props} maxCount={1}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
          <Tooltip title='Subir resultados'>
            <Button className="actions" 
              onClick={() => uploadFile(record)} 
              disabled={!file}
              loading={uploading}>
              <CloudUploadOutlined className="download-icon"/>
            </Button>
          </Tooltip>
          {(isEditing && record.resultado!==null) && (
            <Tooltip title='Archivo subido'>
              <Button className="actions" disabled>
                <CheckCircleOutlined className="download-icon"/>
              </Button>
            </Tooltip>
          )}
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

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // if (action=='Edit') response = await SpecialtyService.editSpecialty(values.id_especialidad, values);
      // if (action=='Create') response = await SpecialtyService.createSpecialty(values);
    } catch (error) {
      setError(error);
    }finally {
      setLoading(false);
      if (response) {
        setUploading(false);
        handleSubmit(response);
        form.resetFields();
      }
    }
  };

  const handleCancelModal = () => {
    clean();
    handleCancel();
  };

  const clean = () => {
    setUploading(false);
    setExamenesInitial([]);
    setSelectedPatient('');
    setSelectedMedic('');
    setFile(null);
    form.resetFields();
  }

  return (
    <Modal
      title={isEditing ? "Editar Resultado" : "Crear Resultado"}
      open={isModalOpen}
      onCancel={handleCancelModal}
      centered
      maskClosable={false}
      footer={null}
      width={1000}
    >
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Form.Item name="id_paciente" label="Paciente" rules={[{ required: true, message: 'Por favor ingrese un paciente!' }]}>
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
              <Form.Item name="id_medico" label="Médico" rules={[{ required: true, message: 'Por favor ingrese un médico!' }]}>
                {/* <Select loading={loadingSelect} options={analisisOptions} /> */}
                <Select showSearch
                  disabled={isEditing}
                  value={selectedMedic}
                  filterOption={filterMedic}
                  options={medicOptions} 
                  onChange={handleMedicChange}/>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Table responsive
                columns={columns}
                dataSource={examenesInitial}
                rowKey={"id_realizar"}
                pagination={tableParams.pagination}
                onChange={handleTableChange} />
            </Col>
          </Row>
        </Row>
        <Form.Item className="footer">
          <Button key="back" onClick={handleCancelModal} style={{marginRight:'15px'}}>
            Cancelar
          </Button>
          <Button htmlType="submit" style={{background: '#4096FF', color:'white'}} loading={loading}>
            {isEditing ? "Editar" : "Crear"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCreateEspecialty;
