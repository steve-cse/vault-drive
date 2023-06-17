import React, { useState, useRef } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { Form, InputGroup, Button, Container, Alert } from "react-bootstrap";
import { readBinaryFile, writeBinaryFile, exists } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";

export default function Upload() {
  const keyRef = useRef();
  const deleteRef = useRef(); //deleteRef.current.checked
  const [selectedFile, setSelectedFile] = useState("");
  const [variant, setVariant] = useState("primary");
  const [syslog, setSyslog] = useState("All Systems Operational");

  const openFile = async () => {
    const selected = await open({
      multiple: false,
    });

    if (selected === null) {
      return;
    } else {
      setSelectedFile(selected);
    }
  };
  async function handleEncrypt(key) {
    console.log("Encryption!!!");

    invoke("process_file", { fileName: selectedFile, filePassword: key }).then(
      (response) => {
        if (response.includes("SUCCESS")) {
          setVariant("success");
          setSyslog(response);
        } else if (response.includes("ERROR")) {
          setVariant("danger");
          setSyslog(response);
        }
        console.log(response);
      }
    );
  }

  return (
    <>
      <NavigationBar />
      <h3 className="text-center mt-4">
        Securely Safeguard and Ascend Files to the Cloud
      </h3>
      <Container className="p-3">
        <div className="w-100">
          <Form>
            <Form.Group>
              <InputGroup className="mb-3 mt-3">
                <InputGroup.Text
                  onClick={() => openFile()}
                  style={{ cursor: "pointer" }}
                >
                  Choose File
                </InputGroup.Text>
                <Form.Control
                  className="pe-none"
                  readOnly
                  defaultValue={selectedFile}
                />
              </InputGroup>
              <Form.Label>Key</Form.Label>
              <Form.Control ref={keyRef} type="password" className="mb-3" />
              <Form.Check
                type="switch"
                className="mb-3"
                label="Delete encrypted file after upload"
                ref={deleteRef}
              />
            </Form.Group>
          </Form>

          <Alert variant={variant}>{syslog}</Alert>
        </div>
        <div className="mt-4">
          <Button
            onClick={() => handleEncrypt(keyRef.current.value)}
            style={{ marginRight: "10px", marginBottom: "10px" }}
          >
            Encrypt
          </Button>
          <Button style={{ marginRight: "10px", marginBottom: "10px" }}>
            Decrypt
          </Button>
          <Button style={{ marginRight: "10px", marginBottom: "10px" }}>
            Upload
          </Button>
        </div>
      </Container>
    </>
  );
}
