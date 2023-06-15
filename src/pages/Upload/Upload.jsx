import React, { useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { Form, InputGroup, Button } from "react-bootstrap";
import { readBinaryFile, writeBinaryFile, exists } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
export default function Upload() {
  const [selectedFile, setSelectedFile] = useState("");
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
  return (
    <>
      <NavigationBar />
      <div>Your at the upload page</div>
      <Form>
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

        <Button>Encrypt</Button>
      </Form>
      <Button>Upload</Button>
    </>
  );
}
