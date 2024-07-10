import React, { useState } from 'react';
import './Password.css';
import { Form, Input } from 'antd';

const Password = ({ isModifyModalOpen, handleModify, handleModifyCancel, initialValues }) => {
  const [form]                      = Form.useForm();
  const [isEditing, setIsEditing]   = useState(false);
  const [error, setError]           = useState(null);
  const [loading, setLoading]       = useState(false);
  // const [loadingSelect, setloadingSelect]   = useState(false);
  const [dataRol, setDataRol]       = useState([]);
  const [rolOptions, setRolOptions] = useState('');
  let response;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // response = await UserService.deleteUser(initialValues.cedula);
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

  return (
    <Modal
      title='Cambiar contraseña'
      open={isModifyModalOpen}
      onCancel={handleModifyCancel}
      centered
      maskClosable={false}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* <Form.Item name="id" hidden>
          <Input />
        </Form.Item> */}
        <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="cedula" label="Cédula" rules={[{ required: true, message: 'Por favor ingrese la cédula!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="correo_electronico" label="Correo electrónico" rules={[{ required: true, message: 'Por favor ingrese su correo electrónico!' }]}>
          <Input />
        </Form.Item>
        {/* {action === 'Create' && (
          <Form.Item name="contraseña" label="Contraseña" rules={[{ required: true, message: 'Por favor ingrese su contraseña!' }]}>
            <Password />
          </Form.Item>
        )} */}
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
}

export default Password;