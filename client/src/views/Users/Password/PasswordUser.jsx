import React, { useState } from 'react';
import './PasswordUser.css';
import { Button, Form, Modal } from 'antd';
import Password from "antd/es/input/Password";
import UserService from '../../../services/UserService';

const PasswordUser = ({ isModifyModalOpen, handleModify, handleModifyCancel, initialValues }) => {
  const [form]                      = Form.useForm();
  const [error, setError]           = useState(null);
  const [loading, setLoading]       = useState(false);
  let response;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      response = await UserService.changePassword(initialValues.cedula, values);
    } catch (error) {
      setError(error);
    }finally {
      setLoading(false);
      if (response) {
        handleModify(response);
        form.resetFields();
      }
    }
  };

  const onCancel = () => {
    form.resetFields();
    handleModifyCancel();
  };

  const validateConfPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('nuevaContraseña') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Las contraseñas no coinciden!'));
    },
  });

  return (
    <Modal
      title='Cambiar contraseña'
      open={isModifyModalOpen}
      onCancel={onCancel}
      centered
      maskClosable={false}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* <Form.Item name="id" hidden>
          <Input />
        </Form.Item> */}
        <Form.Item name="nuevaContraseña" label="Nueva contraseña" rules={[{ required: true, message: 'Por favor ingrese su contraseña!' }]}>
          <Password />
        </Form.Item>
        <Form.Item name="confirmarContraseña" 
          label="Confirmar contraseña" 
          rules={[{ required: true, message: 'Por favor ingrese nuevamente su contraseña!' }, validateConfPassword]}
          dependencies={['nuevaContraseña']}>
          <Password />
        </Form.Item>
        <Form.Item className="footer">
          <Button key="back" onClick={handleModifyCancel} style={{marginRight:'15px'}}>
            Cancelar
          </Button>
          <Button htmlType="submit" style={{background: '#4096FF', color:'white'}} loading={loading}>
            Cambiar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default PasswordUser;