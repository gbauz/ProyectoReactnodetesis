import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import './EditCreateExamDetail.css';
import ExamDetailService from "../../../services/ExamDetailService";
import ExamService from "../../../services/ExamService";

const EditCreateExamDetail = ({ isModalOpen, handleSubmit, handleCancel, initialValues, action }) => {
  const [form]                                  = Form.useForm();
  const [isEditing, setIsEditing]               = useState(false);
  const [error, setError]                       = useState(null);
  const [loading, setLoading]                   = useState(false);
  // const [loadingSelect, setloadingSelect]   = useState(false);
  const [dataExam, setDataExam]       = useState([]);
  const [examOptions, setExamOptions] = useState('');
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
    getExam();
  }, [isModalOpen, initialValues, form, action]);

  const getExam = async () => {
    // setloadingSelect(true);
    try {
      response = await ExamService.getExam();
      setDataExam(response.data.examenes);
      setExamOptions(dataExam.map(item => ({
        value: item.id_examen,
        label: item.examen
      })));
    } catch (error) {
      setDataExam('');
      setError(error);
    } finally {
      // setLoading(false);
    }
  }
  const filterSpecialty = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (action==='Edit') response = await ExamDetailService.editExamDetail(initialValues.id_detalle, values);
      if (action==='Create') response = await ExamDetailService.createExamDetail(values);
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
      title={isEditing ? "Editar Detalles de examenes" : "Crear Detalles de examenes"}
      open={isModalOpen}
      onCancel={handleCancel}
      centered
      maskClosable={false}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="id_examen" label="Examen" rules={[{ required: true, message: 'Por favor seleccione un exámen!' }]}>
          {/* <Select loading={loadingSelect} options={analisisOptions} /> */}
          <Select options={examOptions} showSearch filterOption={filterSpecialty}/>
        </Form.Item>
        <Form.Item name="detalle" label="Detalle" rules={[{ required: true, message: 'Por favor ingrese el detalle!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="unidad" label="Unidad" rules={[{ required: true, message: 'Por favor ingrese la unidad!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="valor_referencia" label="Valor de referencia" rules={[{ required: true, message: 'Por favor ingrese el valor de referencia!' }]}>
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

export default EditCreateExamDetail;
