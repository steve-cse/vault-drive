import React, { useState } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { Form, InputGroup, Button, Container, Alert } from "react-bootstrap";
import { writeText } from "@tauri-apps/api/clipboard";
import _sodium from "libsodium-wrappers";

export default function KeyGen() {
  const [privateKeyText, setPrivateKey] = useState('');
  const [publicKeyText, setPublicKey] = useState('');
  const [variant, setVariant] = useState("warning");
  const [syslog, setSyslog] = useState(
    "Do not disclose your private key to anyone! Only exchange public keys."
  );
  async function copyPrivateKey() {
    try {
      await writeText(privateKeyText);
      setVariant("success");
      setSyslog("Private key copied to clipboard");
    } catch (error) {
      setVariant("danger");
      setSyslog(error);
    }
  }
  async function copyPublicKey() {
    try {
      await writeText(publicKeyText);
      setVariant("success");
      setSyslog("Public key copied to clipboard");
    } catch (error) {
      setVariant("danger");
      setSyslog(error);
    }
  }
  async function genKey() {
    await _sodium.ready;
    const sodium = _sodium;

    const keyPair = sodium.crypto_kx_keypair();
    

    setPrivateKey(sodium.to_hex(keyPair.privateKey));
    setPublicKey(sodium.to_hex(keyPair.publicKey));
    console.log("Keys generated");
   
  }
  return (
    <>
      <NavigationBar />

      <h3 className="text-center mt-4">
        Generate Keys for Asymmetric Cryptography
      </h3>
      <Container className="p-3">
        <div className="w-100">
          <Form>
            <Form.Group>
              <Form.Label>Public Key</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control readOnly defaultValue={publicKeyText} />
                <Button onClick={() => copyPublicKey()}>Copy</Button>
              </InputGroup>
              <Form.Label>Private Key</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  
                  readOnly
                  defaultValue={privateKeyText}
                />
                <Button onClick={() => copyPrivateKey()}>Copy</Button>
              </InputGroup>
            </Form.Group>
          </Form>
        </div>
        <Alert variant={variant}>{syslog}</Alert>
        <div className="w-100 text-center mt-4">
          <Button onClick={() => genKey()}>Generate Keys</Button>
        </div>
      </Container>
    </>
  );
}
