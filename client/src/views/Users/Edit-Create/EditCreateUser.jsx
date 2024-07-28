import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import './EditCreateUser.css';
import UserService from "../../../services/UserService";
import RolService from "../../../services/RolService";
import Password from "antd/es/input/Password";

const EditCreateUser = ({ isModalOpen, handleSubmit, handleCancel, initialValues, action }) => {
  const [form]                      = Form.useForm();
  const [isEditing, setIsEditing]   = useState(false);
  const [error, setError]           = useState(null);
  const [loading, setLoading]       = useState(false);
  // const [loadingSelect, setloadingSelect]   = useState(false);
  const [dataRol, setDataRol]       = useState([]);
  const [rolOptions, setRolOptions] = useState('');
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
    getRol();
  }, [isModalOpen, initialValues, form, action]);

  const getRol = async () => {
    // setloadingSelect(true);
    try {
      response = await RolService.getRols();
      const rols = response.data.roles.map(rol => ({
        ...rol,
        rol_id: rol.id_rol,
      }));
      setDataRol(rols);
      setRolOptions(dataRol.map(item => ({
        value: item.rol_id,
        label: item.nombre
      })));
    } catch (error) {
      setDataRol('');
      setError(error);
    } finally {
      // setLoading(false);
    }
  }
  const filterSpecialty = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (action==='Edit') response = await UserService.editUser(values.cedula, values);
      if (action==='Create') response = await UserService.createUser(values);
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
      title={isEditing ? "Editar Usuario" : "Crear Usuario"}
      open={isModalOpen}
      onCancel={handleCancel}
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
        {action === 'Create' && (
          <Form.Item name="contraseña" label="Contraseña" rules={[{ required: true, message: 'Por favor ingrese su contraseña!' }]}>
            <Password />
          </Form.Item>
        )}
        <Form.Item name="rol_id" label="Rol" rules={[{ required: true, message: 'Por favor seleccione el rol!' }]}>
          {/* <Select loading={loadingSelect} options={analisisOptions} /> */}
          <Select options={rolOptions} showSearch filterOption={filterSpecialty}/>
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

export default EditCreateUser;
