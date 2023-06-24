import React, { useState, useRef } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { Form, InputGroup, Button, Container, Alert } from "react-bootstrap";
import _sodium from "libsodium-wrappers";
import { open } from "@tauri-apps/api/dialog";
import { readBinaryFile, writeBinaryFile, exists } from "@tauri-apps/api/fs";
import { ask } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import { getClient, Body, ResponseType } from "@tauri-apps/api/http";
import { fetch } from "@tauri-apps/api/http";

export default function ECDH() {
  const publicKeyRef = useRef();
  const privateKeyRef = useRef();
  const deleteRef = useRef(); //deleteRef.current.checked
  const [selectedFile, setSelectedFile] = useState("");
  const [fileToUpload, setFileToUpload] = useState("");
  const [variant, setVariant] = useState("primary");
  const [sharedSecretKey, setSharedSecretKey] = useState("");
  const [disableEncButton, setDisableEncButton] = useState(false);
  const [disableDecButton, setDisableDecButton] = useState(false);
  const [syslog, setSyslog] = useState(
    "Use your private key and the recipient's public key when encrypting a file, and employ the sender's public key along with your private key when decrypting a file."
  );

  const openFile = async () => {
    const selected = await open({
      multiple: false,
    });

    if (selected === null) {
      return;
    } else {
      if (selected.endsWith(".enc")) {
        setDisableEncButton(true);
        setDisableDecButton(false);
      } else {
        setDisableDecButton(true);
        setDisableEncButton(false);
      }

      setSelectedFile(selected);
    }
  };

  async function handleGetEncryptionKey(alicePublicKey, bobPrivateKey) {
    try {
      await _sodium.ready;
      const sodium = _sodium;
      const serverSharedSecret = sodium.crypto_kx_server_session_keys(
        sodium.crypto_scalarmult_base(sodium.from_hex(bobPrivateKey)),
        sodium.from_hex(bobPrivateKey),
        sodium.from_hex(alicePublicKey)
      );
      console.log(
        "Encryption Key: ",
        sodium.to_hex(serverSharedSecret.sharedRx)
      );
      setSharedSecretKey(sodium.to_hex(serverSharedSecret.sharedRx));
    } catch (error) {
      setVariant("danger");
      setSyslog(error.message);
    }
  }
  async function handleGetDecryptionKey(bobPublicKey, alicePrivateKey) {
    try {
      await _sodium.ready;
      const sodium = _sodium;
      const clientSharedSecret = sodium.crypto_kx_client_session_keys(
        sodium.crypto_scalarmult_base(sodium.from_hex(alicePrivateKey)),
        sodium.from_hex(alicePrivateKey),
        sodium.from_hex(bobPublicKey)
      );
      console.log(
        "Decryption Key: ",
        sodium.to_hex(clientSharedSecret.sharedTx)
      );
      setSharedSecretKey(sodium.to_hex(clientSharedSecret.sharedTx));
    } catch (error) {
      setVariant("danger");
      setSyslog(error.message);
    }
  }
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

  async function handleUpload() {
    const normalizedPath = fileToUpload.replace(/\\/g, "/");
    // Split the path by the forward slash '/'
    const pathSegments = normalizedPath.split("/");
    // Get the last segment which represents the file name
    const fileName = pathSegments[pathSegments.length - 1];

    try {
      const fileContent = await readBinaryFile(fileToUpload);

      const response = await fetch("https://api.filechan.org/upload", {
        headers: { "Content-Type": "multipart/form-data" },
        body: Body.form({
          fileData: {
            file: fileContent, // either a path or an array buffer of the file contents
          },
        }),
        method: "POST",
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <NavigationBar />
      <h3 className="text-center mt-4">Elliptic Curve Diffie Hellman</h3>
      <Container className="p-3">
        <div className="w-100">
          <Alert variant={variant}>{syslog}</Alert>
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
              <Form.Label>Public Key</Form.Label>
              <Form.Control ref={publicKeyRef} className="mb-3" />
              <Form.Label>Private Key</Form.Label>
              <Form.Control ref={privateKeyRef} className="mb-3" />
              <Form.Label>Shared Secret Key</Form.Label>
              <Form.Control
                readOnly
                className="mb-3"
                defaultValue={sharedSecretKey}
              />
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
              <Form.Label>Shareable Link</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control readOnly />
                <Button onClick={() => copyLink()}>Copy</Button>
              </InputGroup>
            </Form.Group>
          </Form>
        </div>
        <div className="mt-4">
          <Button
            onClick={() =>
              handleGetEncryptionKey(
                publicKeyRef.current.value,
                privateKeyRef.current.value
              )
            }
            style={{ marginRight: "10px", marginBottom: "10px" }}
            disabled={disableEncButton}
          >
            Get Encryption Key
          </Button>
          <Button
            onClick={() =>
              handleGetDecryptionKey(
                publicKeyRef.current.value,
                privateKeyRef.current.value
              )
            }
            style={{ marginRight: "10px", marginBottom: "10px" }}
            disabled={disableDecButton}
          >
            Get Decryption Key
          </Button>
          <Button
            onClick={() => handleEncrypt(sharedSecretKey)}
            style={{ marginRight: "10px", marginBottom: "10px" }}
            disabled={disableEncButton}
          >
            Encrypt
          </Button>
          <Button
            onClick={() => {
              handleDecrypt();
            }}
            style={{ marginRight: "10px", marginBottom: "10px" }}
            disabled={disableDecButton}
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
