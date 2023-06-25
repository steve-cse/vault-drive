import React, { useState, useEffect, useRef } from "react";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import { storage } from "../../firebaseconfig/firebase";
import { Button, Container, Alert } from "react-bootstrap";
import { Download, Trash3Fill } from "react-bootstrap-icons";
import { getClient, ResponseType } from "@tauri-apps/api/http";
import {
  createDir,
  writeBinaryFile,
  exists,
  BaseDirectory,
} from "@tauri-apps/api/fs";
import { downloadDir } from "@tauri-apps/api/path";
import { ask } from "@tauri-apps/api/dialog";
import { useAuth } from "../../contexts/AuthContext";

export default function Management() {
  const [fileData, setFileData] = useState(() => {
    const storedData = sessionStorage.getItem("myData");
    return storedData ? JSON.parse(storedData) : [];
  });
  const [downloadPath, setDownloadPath] = useState("");
  const shouldLog = useRef(true);
  const [syslog, setSyslog] = useState("All Systems Operational");
  const [variant, setVariant] = useState("primary");
  const [userUID, setuserUID] = useState("");
  const [disableRefreshButton, setDisableRefreshButton] = useState(false);
  const [disableFileButtons, setDisableFileButtons] = useState(false);
  const { currentUser } = useAuth();
  useEffect(() => {
    sessionStorage.setItem("myData", JSON.stringify(fileData));
  }, [fileData]);

  useEffect(() => {
    async function getDownloadDirectory() {
      try {
        const downloadDirPath = await downloadDir();
        const folderName = "vault-downloads";
        const folderPath = `${downloadDirPath}${folderName}`;

        const directoryExists = await exists(folderName, {
          dir: BaseDirectory.Download,
        });

        if (directoryExists) {
          setDownloadPath(folderPath);
        } else {
          await createDir(folderName, {
            dir: BaseDirectory.Download,
            recursive: true,
          });

          setVariant("success");
          setSyslog(`Created ${folderPath}`);
          setDownloadPath(folderPath);
        }
      } catch (err) {
        setVariant("danger");
        setSyslog("Failed to create vault-downloads folder:", err);
      }
    }

    if (shouldLog.current) {
      shouldLog.current = false;
      getDownloadDirectory();
      setuserUID(currentUser.uid);
    }
  }, []);
  const listItem = async () => {
    setDisableRefreshButton(true);
    try {
      setVariant("info");
      setSyslog("Contacting storage...");
      const res = await storage.ref().child(`documents/${userUID}/`).listAll();
      const newData = [];
      res.items.forEach((item) => {
        newData.push(item.name);
      });
      setFileData(newData);
      setVariant("success");
      setSyslog("File list refreshed");
    } catch (err) {
      setVariant("danger");
      setSyslog(err.message);
    }
    setDisableRefreshButton(false);
  };
  const handleDownload = async (name) => {
    setDisableRefreshButton(true);
    setDisableFileButtons(true);
    try {
      setVariant("info");
      setSyslog(`Download in progress...`);
      const fileRef = storage.ref().child(`documents/${userUID}/${name}`);
      const downloadUrl = await fileRef.getDownloadURL();
      const client = await getClient();
      const response = await client.get(downloadUrl, {
        responseType: ResponseType.Binary,
      });
      const data = response.data;
      await writeBinaryFile(`${downloadPath}/${name}`, data);
      setVariant("success");
      setSyslog(`Downloaded ${name}`);
    } catch (err) {
      setVariant("danger");
      setSyslog(err.message);
    }
    setDisableRefreshButton(false);
    setDisableFileButtons(false);
  };
  const handleDelete = async (fileName) => {
    const confirmed = await ask(
      `Are you sure you want to delete ${fileName}?`,
      {
        title: "Vault Drive",
        type: "warning",
      }
    );

    if (!confirmed) {
      // User canceled deletion
      return;
    }

    try {
      setDisableRefreshButton(true);
      setDisableFileButtons(true);
      setVariant("info");
      setSyslog(`File deletion in progress...`);
      await storage.ref().child(`documents/${userUID}/${fileName}`).delete();
      setFileData((prevData) => prevData.filter((file) => file !== fileName));
      setVariant("success");
      setSyslog(`Deleted ${fileName}`);
    } catch (err) {
      setVariant("danger");
      setSyslog(err.message);
    }
    setDisableRefreshButton(false);
    setDisableFileButtons(false);
  };
  return (
    <>
      <NavigationBar />
      <h3 className="text-center mt-4">Effortlessly Manage Files</h3>

      <Container className="p-3">
        <Alert variant={variant}>{syslog}</Alert>
        <div className="w-100 text-center mb-3">
          <Button disabled={disableRefreshButton} onClick={() => listItem()}>
            Refresh List
          </Button>{" "}
        </div>
        <div className="w-100">
          {fileData.length === 0 ? (
            <>
              <h4 className="text-center mt-4">No files found 🙁</h4>
              <h6 className="text-center mt-4">
                (Hint: Try hitting the refresh list button)
              </h6>
            </>
          ) : (
            <ul className="list-group">
              {fileData.map((file) => (
                <li
                  key={file}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {file.length > 60
                    ? `${file.slice(0, 55)}.....${file.slice(-5)}`
                    : file}
                  <div className="d-flex" style={{ gap: "10px" }}>
                    <button
                      disabled={disableFileButtons}
                      className="btn btn-danger ml-2"
                      onClick={() => handleDelete(file)}
                    >
                      <Trash3Fill />
                    </button>
                    <button
                      disabled={disableFileButtons}
                      className="btn btn-primary mr-2"
                      onClick={() => handleDownload(file)}
                    >
                      <Download />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </>
  );
}
