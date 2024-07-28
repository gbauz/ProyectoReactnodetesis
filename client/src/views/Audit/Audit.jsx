import "./Audit.css";
import React, { useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import { FilePdfOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import AuditService from "../../services/AuditService";
import PDFAudit from "../../components/PDF/PDFAudit";

const Audit = () => {
  let columns                         = [];
  const [data, setData]               = useState([]);
  const [error, setError]             = useState(null);
  const [loading, setLoading]         = useState(false);
  const [searchText, setSearchText]   = useState("");
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 7,
      pageSizeOptions: [7, 10, 20, 50, 100],
      showQuickJumper: true,
      position: ["bottomRight"],
    },
  });
  const fetchAudit = async () => {
    setLoading(true);
    try {
      const response = await AuditService.getAudit();
      setData(response.data.auditoria);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  //Llenar columnas
  columns = [
    {
      title: "Usuario",
      dataIndex: "usuario_nombre",
      sorter: {
        compare: (a, b) => a.usuario_nombre.localeCompare(b.usuario_nombre),
        multiple: 1,
      },
    },
    {
      title: "IP usuario",
      dataIndex: "ip_usuario",
      align: "center",
      sorter: {
        compare: (a, b) => a.ip_usuario - b.ip_usuario,
        multiple: 2,
      },
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      align: "center",
      sorter: {
        compare: (a, b) => new Date(a.fecha) - new Date(b.fecha),
        multiple: 3,
      },
      render: (text) => moment(text).format("DD-MM-YYYY HH:mm:ss"),
    },
    {
      title: "Acción",
      dataIndex: "accion",
      align: "center",
      sorter: {
        compare: (a, b) => a.accion.localeCompare(b.accion),
        multiple: 4,
      },
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
  const filteredData = data.filter(
    (item) =>
      item.usuario_nombre.toLowerCase().includes(searchText.toLowerCase()) ||
      item.ip_usuario.toLowerCase().includes(searchText.toLowerCase())   ||
      item.accion.toLowerCase().includes(searchText.toLowerCase()) ||
      item.fecha.toLowerCase().includes(searchText.toLowerCase())
  );

  const generatePDF = () => {
    PDFAudit(data);
  };

  return (
    <div className="audit">
      <div className="header-content">
        <h3>Auditoría</h3>
        <div className="d-flex p-0 m-0 align-items-center">
          <div className="input-group d-flex border align-items-center me-3">
            <SearchOutlined className="mx-2" />
            <Input
              className="rounded-pill"
              placeholder="Buscar paciente"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Button className="rounded-pill" type="primary" onClick={generatePDF}>
            <FilePdfOutlined /> Reporte
          </Button>
        </div>
      </div>
      <Table
        responsive
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        rowKey={"id"}
        pagination={tableParams.pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Audit;
