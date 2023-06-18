import React, { useState, useRef } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { Form, InputGroup, Button, Container, Alert } from "react-bootstrap";
import { readBinaryFile, writeBinaryFile, exists } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import { useAuth } from "../../contexts/AuthContext";
import { storage } from "../../firebaseconfig/firebase";
export default function Upload() {
  const keyRef = useRef();
  const deleteRef = useRef(); //deleteRef.current.checked
  const [selectedFile, setSelectedFile] = useState("");
  const [variant, setVariant] = useState("primary");
  const [syslog, setSyslog] = useState("All Systems Operational");
  const { currentUser } = useAuth();

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
  async function handleUpload() {
    try {
      setVariant("info");
      setSyslog("File uploading in progress...");
      const userUID = currentUser.uid;
      // Normalize the file path to handle different separators
      const normalizedPath = selectedFile.replace(/\\/g, '/');
      // Split the path by the forward slash '/'
      const pathSegments = normalizedPath.split('/');
      // Get the last segment which represents the file name
      const fileName = pathSegments[pathSegments.length - 1];
      const fileContent = await readBinaryFile(selectedFile)
      // Create a reference to the file location in Firebase Storage
      const fileRef = storage.ref().child(`documents/${userUID}/${fileName}`);
      // Upload the file to Firebase Storage
      await fileRef.put(fileContent);
     
      setVariant("success");
      setSyslog("File upload successful");
    } catch (err) {
      setVariant("danger");
      setSyslog(err.message);
    }
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
              <Form.Label>File to Encrypt</Form.Label>
              <InputGroup className="mb-3">
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
              <Form.Label>File to Upload</Form.Label>
              <InputGroup className="mb-3 ">
                <Form.Control
                  className="pe-none"
                  readOnly
                  defaultValue={selectedFile}
                />
                <InputGroup.Text
                  onClick={() => openFile()}
                  style={{ cursor: "pointer" }}
                >
                  Pick Another File
                </InputGroup.Text>
              </InputGroup>

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
          <Button
            onClick={() => {
              handleUpload();
            }}
            style={{ marginRight: "10px", marginBottom: "10px" }}
          >
            Upload
          </Button>
        </div>
      </Container>
    </>
  );
}
