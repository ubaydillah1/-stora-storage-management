import React from "react";
import ItemLists from "./ItemLists";

const SelectedItems = () => {
  const dummyFolders = [
    { id: 1, name: "Project A" },
    { id: 2, name: "Dokumen Penting" },
    { id: 9, name: "Foto Liburan" },
  ];

  const dummyFiles = [
    { id: 4, name: "Laporan Final.pdf" },
    { id: 5, name: "Presentasi.pptx" },
    { id: 6, name: "Dokumentasi API.docx" },
    { id: 7, name: "Sertifikat.jpg" },
    { id: 8, name: "Video Demo.mp4" },
  ];
  return <ItemLists files={dummyFiles} folders={dummyFolders} />;
};

export default SelectedItems;
