import React, { useState, useRef } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { Form, InputGroup, Button, Container, Alert } from "react-bootstrap";
import { readBinaryFile, writeBinaryFile, exists } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { ask } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import { useAuth } from "../../contexts/AuthContext";
import { storage } from "../../firebaseconfig/firebase";
import _sodium from "libsodium-wrappers";

export default function Upload() {
  const keyRef = useRef();
  const deleteRef = useRef(); //deleteRef.current.checked
  const [selectedFile, setSelectedFile] = useState("");
  const [fileToUpload, setFileToUpload] = useState("");
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

  const openFileToUpload = async () => {
    const selected = await open({
      multiple: false,
    });

    if (selected === null) {
      return;
    } else {
      setFileToUpload(selected);
    }
  };
  async function handleEncrypt(key) {
    console.log("Encryption!!!");
    if (key === "") {
      setVariant("danger");
      setSyslog("Please provide a key");
      return;
    }
    invoke("process_file", { fileName: selectedFile, filePassword: key }).then(
      (response) => {
        if (response.includes("SUCCESS")) {
          setVariant("success");
          setSyslog(response);
          setFileToUpload(selectedFile + ".enc");
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
      const userUID = currentUser.uid;
      // Normalize the file path to handle different separators
      const normalizedPath = fileToUpload.replace(/\\/g, "/");
      // Split the path by the forward slash '/'
      const pathSegments = normalizedPath.split("/");
      // Get the last segment which represents the file name
      const fileName = pathSegments[pathSegments.length - 1];

      // Check if the file extension is not ".enc"
      if (!fileName.endsWith(".enc")) {
        // Show a confirmation message
        const confirmed = await ask(
          "Are you sure you want to upload a file that is not encrypted?",
          {
            title: "Vault Drive",
            type: "warning",
          }
        );

        if (!confirmed) {
          // User canceled the upload
          return;
        }
      }
      setVariant("info");
      setSyslog("File uploading in progress...");
      const fileContent = await readBinaryFile(fileToUpload);
      // Create a reference to the file location in Firebase Storage
      const fileRef = storage.ref().child(`documents/${userUID}/${fileName}`);
      // Upload the file to Firebase Storage
      await fileRef.put(fileContent);

      // Check if deleteRef is checked and the file extension is ".enc"
      if (deleteRef.current.checked && fileName.endsWith(".enc")) {
        invoke("delete_file", { filePath: fileToUpload }).then((response) => {
          if (response.includes("ERROR")) {
            setVariant("danger");
            setSyslog(response);
          } else if (response.includes("SUCCESS")) {
            setVariant("success");
            setSyslog("File upload and deletion successful");
          }
          console.log(response);
        });
      } else {
        setVariant("success");
        setSyslog("File upload successful");
      }
    } catch (err) {
      setVariant("danger");
      setSyslog(err.message);
    }
  }
  async function handleDecrypt() {
    await _sodium.ready;
    const sodium = _sodium;

    const keyPair = sodium.crypto_kx_keypair();
    let keys = {
      publicKey: sodium.to_base64(keyPair.publicKey),
      privateKey: sodium.to_base64(keyPair.privateKey),
    };

    console.log(keys.privateKey);
    console.log(keys.publicKey);

    // Convert the base64-encoded keys to binary
    const privateKey = sodium.from_base64(keys.privateKey);
    const publicKey = sodium.from_base64(keys.publicKey);

    const cpublicKey = sodium.crypto_scalarmult_base(
      sodium.from_base64(keys.privateKey)
    );
    // Generate the secret key from the private and public keys
    const secretKey = sodium.crypto_kx_client_session_keys(
      privateKey,
      publicKey,
      cpublicKey
    );
    let skeys = {
      tx: sodium.to_base64(secretKey.sharedTx),
      rx: sodium.to_base64(secretKey.sharedRx),
    };
    console.log(skeys.rx);
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
                  defaultValue={fileToUpload}
                />
                <InputGroup.Text
                  onClick={() => openFileToUpload()}
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
          <Button
            onClick={() => {
              handleDecrypt();
            }}
            style={{ marginRight: "10px", marginBottom: "10px" }}
          >
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
