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
  const [dataPatient, setDataPatient]     = useState([]);
  let response = '';

  useEffect(() => {
    if (action=='Edit') {
      form.setFieldsValue(initialValues);
      setIsEditing(true);
    } 
    if (action=='Create'){
      form.resetFields();
      setIsEditing(false);
    }
    console.log(initialValues);
    getPatients();
  }, [isModalOpen, initialValues, form, action]);

  const getPatients = async () => {
    // setloadingSelect(true);
    try {
      response = await PatientService.getPatients();
      setDataPatient(response.data.pacientes);
    } catch (error) {
      setDataPatient('');
      setError(error);
    } finally {
      // setLoading(false);
    }
  }

  const PacientOptions = dataPatient.map(item => ({
    value: item.id_paciente,
    label: item.paciente,
    cedula: item.cedula
  }));

  const handlePatientChange = (value) => {
    const selectedPatient = PacientOptions.find(option => option.value === value);
    form.setFieldsValue({
      cedula: selectedPatient ? selectedPatient.cedula : ''
    });
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (action=='Edit') response = await ExaminationOrderService.editPatient(values.cedula, values);
      if (action=='Create') response = await ExaminationOrderService.createPatient(values);
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
        <Form.Item name="id_paciente" label="Paciente" rules={[{ required: true, message: 'Por favor seleccione un paciente!' }]}>
          {/* <Select loading={loadingSelect} options={analisisOptions} /> */}
          <Select options={PacientOptions} onChange={handlePatientChange}/>
        </Form.Item>
        <Form.Item name="cedula" label="Cédula" rules={[{ required: true, message: 'Por favor ingrese la cédula!' }]}>
          <Input disabled/>
        </Form.Item>
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
