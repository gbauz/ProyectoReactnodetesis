import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import './EditCreateExam.css';
import ExamService from "../../../services/ExamService";
import AnalysisService from "../../../services/AnalysisService";

const EditCreateExam = ({ isModalOpen, handleSubmit, handleCancel, initialValues, action }) => {
  const [form]                                = Form.useForm();
  const [isEditing, setIsEditing]             = useState(false);
  const [error, setError]                     = useState(null);
  const [loading, setLoading]                 = useState(false);
  // const [loadingSelect, setloadingSelect]   = useState(false);
  const [dataAnalysis, setDataAnalysis]       = useState([]);
  const [analisisOptions, setAnalisisOptions] = useState('');
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
    getAnalysis();
  }, [isModalOpen, initialValues, form, action]);

  const getAnalysis = async () => {
    // setloadingSelect(true);
    try {
      response = await AnalysisService.getAnalysis();
      setDataAnalysis(response.data.analisis);
      setAnalisisOptions(dataAnalysis.map(item => ({
        value: item.id_analisis,
        label: item.analisis
      })));
    } catch (error) {
      setDataAnalysis('');
      setError(error);
    } finally {
      // setLoading(false);
    }
  }
  const filterAnalysis = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (action==='Edit') response = await ExamService.editExam(values.id_examen, values);
      if (action==='Create') response = await ExamService.createExam(values);
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
      title={isEditing ? "Editar Examen" : "Crear Examen"}
      open={isModalOpen}
      onCancel={handleCancel}
      centered
      maskClosable={false}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="id_examen" hidden>
          <Input />
        </Form.Item>
        
        <Form.Item name="id_analisis" label="Análisis" rules={[{ required: true, message: 'Por favor seleccione el análisis!' }]}>
          {/* <Select loading={loadingSelect} options={analisisOptions} /> */}
          <Select options={analisisOptions} showSearch filterOption={filterAnalysis}/>
        </Form.Item>
        <Form.Item name="examen" label="Nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre!' }]}>
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

export default EditCreateExam;
