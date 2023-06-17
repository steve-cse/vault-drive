import React, { useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { Form, InputGroup, Button } from "react-bootstrap";
import { readBinaryFile, writeBinaryFile, exists } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";

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
  async function handleEncrypt(filePath, key) {
    console.log("Encryption!!!");
    // const inputFile = await readBinaryFile(filePath);
    // const cipher = crypto.createCipher('chacha20', key);

    // const encryptedData = Buffer.concat([cipher.update(inputFile), cipher.final()]);

    // const outputPath = filePath + '.enc';
    // await writeBinaryFile(outputPath, encryptedData);
    invoke("process_file", {fileName: selectedFile,filePassword:key})
      // `invoke` returns a Promise
      .then((response) => console.log(response));
  }
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

        <Button onClick={() => handleEncrypt(selectedFile, "test")}>
          Encrypt
        </Button>
      </Form>
      <Button>Upload</Button>
    </>
  );
}
