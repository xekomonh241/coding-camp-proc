import React, { useState } from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { Worker } from "@react-pdf-viewer/core";

import "./App.css";
import { Col, Layout, Row, Space, Button, Form, Input } from "antd";
import md5 from "md5";

export const App: React.FC = () => {

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileError, setPdfFileError] = useState("");
  const [viewPdf, setViewPdf] = useState(null);

  const fileType = ["application/pdf"];
  const handlePdfFileChange = (e: any) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        fileHash(selectedFile, md5, function (x: any) {
          console.log(x);
        });
        // let reader = new FileReader();
        // reader.readAsDataURL(selectedFile);
        // reader.onloadend = (e) => {
        //   setPdfFile(e.target.result);
        //   setPdfFileError("");
        // };
      } else {
        setPdfFile(null);
        setPdfFileError("Please select valid pdf file");
      }
    } else {
      console.log("select your file");
    }
  };

  function fileHash(file: File, hasher: any, callback: any) {
    var reader = new FileReader();
    reader.onloadend = function (e: any) {
      var hash = hasher(e.target.result);
      setPdfFile(e.target.result);
      callback(hash);
    };
    reader.readAsDataURL(file);
  }
  // form submit
  const handlePdfFileSubmit = (e: any) => {
    e.preventDefault();
    if (pdfFile !== null) {
      setViewPdf(pdfFile);
    } else {
      setViewPdf(null);
    }
  };

  return (
    <Layout className="container">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Form className="form-group" onSubmitCapture={handlePdfFileSubmit}>
              <Input
                style={{
                  width: "calc(20%)",
                }}
                type="file"
                required
                onChange={handlePdfFileChange}
              />
              <br />
              {pdfFileError && <div className="error-msg">{pdfFileError}</div>}
              <Button type="primary" htmlType="submit">
                UPLOAD
              </Button>
            </Form>
          </Space>
        </Col>
      </Row>
      <br />
      <Row>
        <Col span={24}>
          {viewPdf && (
            <>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.1.81/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={viewPdf}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </Worker>
            </>
          )}
          {!viewPdf && <>No pdf file selected</>}
        </Col>
      </Row>
    </Layout>
  );
};

export default App;
