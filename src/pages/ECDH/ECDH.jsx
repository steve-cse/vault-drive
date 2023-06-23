import React, { useState, useRef } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { Form, InputGroup, Button, Container, Alert } from "react-bootstrap";
import _sodium from "libsodium-wrappers";

export default function ECDH() {
  const publicKeyRef = useRef();
  const privateKeyRef = useRef();
  const deleteRef = useRef(); //deleteRef.current.checked
  const [selectedFile, setSelectedFile] = useState("");
  const [fileToUpload, setFileToUpload] = useState("");
  const [variant, setVariant] = useState("primary");
  const [sharedSecretKey, setSharedSecretKey] = useState("");
  const [syslog, setSyslog] = useState(
    "Use your private key and the recipient's public key when encrypting a file, and employ the sender's public key along with your private key when decrypting a file."
  );
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

  async function handleSharedSecret() {
    await _sodium.ready;
    const sodium = _sodium;
    const privateKeyInput=privateKeyRef.current.value
    const publicKeyInput=publicKeyRef.current.value
    const clientKeyPair = {
      publicKey: sodium.crypto_scalarmult_base(
        sodium.from_hex(privateKeyInput)
      ),
      privateKey: sodium.from_hex(privateKeyInput),
    };
    const serverKeyPair = {
      publicKey: sodium.from_hex(publicKeyInput),
    };
    const secretKey = sodium.crypto_kx_client_session_keys(
      clientKeyPair.publicKey,
      clientKeyPair.privateKey,
      serverKeyPair.publicKey
    );
    // console.log(publicKeyRef.current.value);
    // console.log(privateKeyRef.current.value);

    console.log(sodium.to_hex(secretKey.sharedRx));
    console.log(sodium.to_hex(secretKey.sharedTx));
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
              <Form.Label>Secret Key</Form.Label>
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
            onClick={() => handleSharedSecret()}
            style={{ marginRight: "10px", marginBottom: "10px" }}
          >
            Generate Shared Secret Key
          </Button>
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
