import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import './EditCreateExaminationOrder.css'
import ExaminationOrderService from "../../../services/ExaminationOrderService";
import PatientService from "../../../services/PatientService";

const EditCreateExaminationOrder = ({ isModalOpen, handleSubmit, handleCancel, initialValues, action }) => {
  const [form]                              = Form.useForm();
  const [isEditing, setIsEditing]           = useState(false);
  const [error, setError]                   = useState(null);
  const [loading, setLoading]               = useState(false);
  // const [loadingSelect, setloadingSelect]   = useState(false);
  const [dataPatient, setDataPatient]       = useState([]);
  const [PacientOptions, setPacientOptions] = useState('');
  let response;

  useEffect(() => {
    if (action==='Edit') {
      form.setFieldsValue(initialValues);
      setIsEditing(true);
    } 
    if (action==='Create'){
      form.resetFields();
      setIsEditing(false);
    }
    console.log(initialValues);
    getPatients();
  }, [isModalOpen, initialValues, form, action]);

  //Lógica de Pacientes
  const getPatients = async () => {
    // setloadingSelect(true);
    try {
      response = await PatientService.getPatients();
      const patients = response.data.pacientes.map(patient => ({
        ...patient,
        paciente_cedula: patient.cedula,
      }));
      setDataPatient(patients);
      setPacientOptions(dataPatient.map(item => ({
        value: item.id_paciente,
        label: item.paciente_cedula,
        paciente: item.paciente
      })));
    } catch (error) {
      setDataPatient('');
      setError(error);
    } finally {
      // setLoading(false);
    }
  }
  const filterPatient = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const handlePatientChange = (value) => {
    const selectedPatient = PacientOptions.find(option => option.value === value);
    form.setFieldsValue({
      paciente: selectedPatient ? selectedPatient.paciente : ''
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (action==='Edit') response = await ExaminationOrderService.editPatient(values.cedula, values);
      if (action==='Create') response = await ExaminationOrderService.createPatient(values);
    } catch (error) {
      setError(error);
    }finally {
      setLoading(false);
      if (response) {
        handleSubmit(response);
        form.resetFields();
      }
    }
  };

  return (
    <Modal
      title={isEditing ? "Editar Orden de Examen" : "Crear Orden de Examen"}
      open={isModalOpen}
      onCancel={handleCancel}
      centered
      maskClosable={false}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="id_paciente" label="Cédula del paciente" rules={[{ required: true, message: 'Por favor ingrese un número de cédula!' }]}>
          {/* <Select loading={loadingSelect} options={analisisOptions} /> */}
          <Select showSearch 
            filterOption={filterPatient}
            options={PacientOptions} 
            onChange={handlePatientChange}/>
        </Form.Item>
        <Form.Item name="paciente" label="Paciente" rules={[{ required: true, message: 'Por favor busque un paciente!' }]}>
          <Input disabled/>
        </Form.Item>
        {/* <Form.Item name="id_medico" label="Cédula del médico" rules={[{ required: true, message: 'Por favor ingrese un número de cédula!' }]}>
          <Select loading={loadingSelect} options={analisisOptions} />
          <Select showSearch 
            filterOption={filterPatient}
            options={PacientOptions} 
            onChange={handlePatientChange}/>
        </Form.Item>
        <Form.Item name="nombre_apellido" label="Médico" rules={[{ required: true, message: 'Por favor busque un médico!' }]}>
          <Input disabled/>
        </Form.Item> */}
        <Form.Item name="edad" label="Edad" rules={[{ required: true, message: 'Por favor ingrese la edad!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="sexo" label="Sexo" rules={[{ required: true, message: 'Por favor seleccione el sexo!' }]}>
          <Select options={[
            { value: 'Masculino', label: <span>Masculino</span> },
            { value: 'Femenino', label: <span>Femenino</span> }
          ]} />
        </Form.Item>
        <Form.Item name="celular" label="Teléfono" rules={[{ required: true, message: 'Por favor ingrese el teléfono!' }]}>
          <Input />
        </Form.Item>
        <Form.Item className="footer">
          <Button key="back" onClick={handleCancel} style={{marginRight:'15px'}}>
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

export default EditCreateExaminationOrder;
