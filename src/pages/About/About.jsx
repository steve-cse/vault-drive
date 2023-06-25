import React from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { Form, InputGroup, Button, Container, Alert } from "react-bootstrap";
import { HeartFill } from "react-bootstrap-icons";
export default function About() {
  return (
    <>
      <NavigationBar />
      <Container className="p-3">
        <h5>Preface</h5>
        <p>
          Vault Drive is a secure cloud storage platform with hybrid
          ChaCha20-ECC Encryption, available as a free and{" "}
          <a
            style={{ textDecoration: "none" }}
            href="https://github.com/steve-cse/vault-drive"
            target="_blank"
          >
            open-source
          </a>{" "}
          solution.
        </p>
        <h5>Key Features</h5>
        <ul>
          <li>ChaCha20 is utilized for symmetric encryption purposes.</li>
          <li>
            Elliptic Curve Diffie Hellman is employed for key exchange
            operations.
          </li>
          <li>
            Intuitive and user-friendly interface, simplifies the process of
            file encryption and management.
          </li>
          <li>
            Multi-platform support by being compatible with Windows, macOS, and
            Linux, due to the utilization of the Tauri toolkit.
          </li>
        </ul>
        <h5>Usage</h5>
        <ul>
          <li>
            <b>Symmetric Cryptography</b>
          </li>
          <p>
            To perform encryption or decryption in Vault Drive, navigate to the
            Central page and select the desired file. Enter the key and click
            the corresponding buttons. In the case of encryption, once the file
            is encrypted, it becomes the designated file for upload. Optionally,
            you can choose to change the file and then click the upload button.
          </p>
          <li>
            <b>File Management</b>
          </li>
          <p>
            The management page allows you to efficiently handle your files. To
            download a file, simply click the download button next to the
            respective file in the list. The file will be downloaded to the
            designated "downloads" directory on your machine. To delete a file,
            click on the delete button associated with it.
          </p>
          <li>
            <b>
              Elliptic Curve Diffie Hellman and Key Pair Generation (Asymmetric
              Cryptography)
            </b>
          </li>
          <p>
            For secure file sharing between two parties, Elliptic Curve Diffie
            Hellman (ECDH) can be utilized. ECDH relies on a public-private key
            pair, which can be generated from the Get Key Pair page. When
            encrypting a file, use your private key and the recipient's public
            key. Conversely, when decrypting a file, employ the sender's public
            key and your private key. This process generates a shared secret
            key. It is crucial to never disclose your private key to anyone.
            Only exchange public keys for secure communication.
          </p>
        </ul>
        <h5>Technologies Used</h5>
        <ul>
          <li>Tauri</li>
          <li>Vite+React</li>
          <li>libsodium.js</li>
          <li>Firebase</li>
          <li>transfer.sh</li>
        </ul>

        <footer className="w-100 text-center mt-4">
          <p>
            Crafted and engineered with{" "}
            <span style={{ color: "Tomato" }}>
              <HeartFill />
            </span>{" "}
            by{" "}
            <a
              style={{ textDecoration: "none" }}
              href="mailto:stevebobygeorge@gmail.com"
              target="_blank"
            >
              Steve Boby George
            </a>
          </p>
        </footer>
      </Container>
    </>
  );
}
