onmessage = async (e) => {
  // Retrieve message sent to work from main script
  const message = e.data;

  // Get handle to draft file
  const root = await navigator.storage.getDirectory();
  console.log(root, "root");
  const draftDirHandle = await root.getDirectoryHandle("draft", {
    create: true,
  });
  const draftHandle = await draftDirHandle.getFileHandle("draft.txt", {
    create: true,
  });
  // Get sync access handle
  const accessHandle = await draftHandle.createSyncAccessHandle();

  // Get size of the file.
  const fileSize = accessHandle.getSize();
  // Read file content to a buffer.
  const buffer = new DataView(new ArrayBuffer(fileSize));
  const readBuffer = accessHandle.read(buffer, { at: 0 });
  console.log(readBuffer, "readBuffer");

  // Write the message to the end of the file.
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);
  accessHandle.write(encodedMessage, { at: readBuffer });

  // Persist changes to disk.
  accessHandle.flush();

  // Always close FileSystemSyncAccessHandle if done.
  accessHandle.close();
  const estimate = await navigator.storage.estimate();
  postMessage(
    "success" +
      "    percent: " +
      (((estimate?.usage ?? 0) / (estimate?.quota ?? 0)) * 100).toFixed(2) +
      "    avilible: " +
      ((estimate?.quota ?? 0) / 1024 / 1024).toFixed(2) +
      "MB"
  );
};
