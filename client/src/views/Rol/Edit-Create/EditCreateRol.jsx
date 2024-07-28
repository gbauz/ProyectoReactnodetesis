import React, { useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Modal, Select, Table } from "antd";
import './EditCreateRol.css';
import RolService from "../../../services/RolService";
import PermissionService from "../../../services/PermissionService";

const EditCreateRol = ({ isModalOpen, handleSubmit, handleCancel, initialValues, action }) => {
  const [form]                                        = Form.useForm();
  const [isEditing, setIsEditing]                     = useState(false);
  const [error, setError]                             = useState(null);
  const [loading, setLoading]                         = useState(false);
  const [loadingPermission, setLoadingPermission]     = useState(false);
  const [dataPermission, setDataPermission]           = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 4,
      defaultCurrent: 1,
      pageSizeOptions: [4, 10, 20, 50, 100],
      showQuickJumper: true,
      position: ["bottomRight"]
    },
  });
  let response;

  useEffect(() => {
    if (action=='Edit') {
      form.setFieldsValue(initialValues);
      setIsEditing(true);
      setSelectedPermissions(initialValues.permisos.map(permiso => permiso.id_permiso));
    } 
    if (action=='Create'){
      form.resetFields();
      setIsEditing(false);
      setSelectedPermissions([]);
    }
    getPermission();
  }, [isModalOpen, initialValues, form, action]);

  const getPermission = async () => {
    setLoading(true);
    try {
      response = await PermissionService.getPermissions();
      setDataPermission(response.data.permisos);
    } catch (error) {
      setDataPermission([]);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const onFinish = async (values) => {
    setLoadingPermission(true);
    try {
      const formattedValue = {
        ...values,
        permisos: selectedPermissions.map(id_permiso => ({ id_permiso }))
      };
      // console.log(formattedValue);
      if (action=='Edit') response = await RolService.editRol(initialValues.id_rol, formattedValue);
      if (action=='Create') response = await RolService.createRol(formattedValue);
    } catch (error) {
      setError(error);
    }finally {
      setLoadingPermission(false);
      if (response) {
        handleSubmit(response);
        form.resetFields();
        resetTableParams();
      }
    }
  };

  const handleModalCancel = () => {
    handleCancel();
    setSelectedPermissions([]);
    form.resetFields();
    resetTableParams();
  };

  const columns = [
    {
      title: 'Categoría',
      dataIndex: 'categoria',
      key: 'categoria',
    },
    {
      title: 'Permiso',
      dataIndex: 'nombre_permiso',
      key: 'nombre_permiso',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
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
  const resetTableParams = () => {
    setTableParams({
      pagination: {
        current: 1,
        pageSize: 4,
        defaultCurrent: 1,
        pageSizeOptions: [4, 10, 20, 50, 100],
        showQuickJumper: true,
        position: ["bottomCenter"]
      },
    });
  };
  const rowSelection = {
    selectedRowKeys: selectedPermissions,
    onChange: (selectedRowKeys) => {
      setSelectedPermissions(selectedRowKeys);
    },
  };

  return (
    <Modal
      title={isEditing ? "Editar Rol" : "Crear Rol"}
      open={isModalOpen}
      onCancel={handleModalCancel}
      centered
      maskClosable={false}
      footer={null}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* <Form.Item name="id" hidden>
          <Input />
        </Form.Item> */}
        <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre!' }]}>
          <Input />
        </Form.Item>
        <Table responsive
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          loading={loadingPermission}
          rowKey="id_permiso"
          columns={columns}
          dataSource={dataPermission}
          pagination={tableParams.pagination}
          onChange={handleTableChange} />
        <Form.Item className="footer">
          <Button key="back" onClick={handleModalCancel} style={{marginRight:'15px'}}>
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

export default EditCreateRol;
