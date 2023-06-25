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

export default function Management() {
  const [fileData, setFileData] = useState(() => {
    const storedData = sessionStorage.getItem("myData");
    return storedData ? JSON.parse(storedData) : [];
  });
  const [downloadPath, setDownloadPath] = useState("");
  const shouldLog = useRef(true);
  const [syslog, setSyslog] = useState("All Systems Operational");
  const [variant, setVariant] = useState("primary");

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
          console.log(`${folderPath} already exists.`);
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
    }
  }, []);
  const listItem = async () => {
    try {
      setVariant("info");
      setSyslog("Contacting Storage");
      const res = await storage.ref().child("images/").listAll();
      const newData = [];
      res.items.forEach((item) => {
        newData.push(item.name);
      });
      setFileData(newData);
      setVariant("success");
      setSyslog("List Refreshed");
    } catch (err) {
      setVariant("danger");
      setSyslog(err.message);
    }
  };
  const handleDownload = async (name) => {
    try {
      const fileRef = storage.ref().child(`images/${name}`);
      const downloadUrl = await fileRef.getDownloadURL();
      const client = await getClient();
      const response = await client.get(downloadUrl, {
        responseType: ResponseType.Binary,
      });
      const data = response.data;
      await writeBinaryFile(`${downloadPath}/${name}`, data);
      console.log("Downloaded file");
    } catch (err) {
      setVariant("danger");
      setSyslog(err.message);
    }
  };
  return (
    <>
      <NavigationBar />
      <h3 className="text-center mt-4">Effortlessly Manage Files</h3>

      <Container className="p-3">
        <Alert variant={variant}>{syslog}</Alert>
        <div className="w-100 text-center mb-3">
          <Button onClick={() => listItem()}>Refresh List</Button>{" "}
        </div>
        <div className="w-100">
          {fileData.length === 0 ? (
            <>
              <h4 className="text-center mt-4">No files found 🙁</h4>
              <h6 className="text-center mt-4">
                (Hint: Try hitting the refresh button)
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
                      className="btn btn-danger ml-2"
                      onClick={() => handleDelete(file.name)}
                    >
                      <Trash3Fill />
                    </button>
                    <button
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
