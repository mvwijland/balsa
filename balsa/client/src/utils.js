export const getFileIcon = file => {
  if (file.fileType === 'document') {
    return 'newFile2.png';
  } else if (file.fileType === 'folder') {
    return 'folder.svg';
  } else {
    return 'spreadsheet.png';
  }
};

export const getFileUrl = file => {
  const data = { params: { id: file.id } };
  if (file.fileType === 'document') {
    data.name = 'document';
  } else if (file.fileType === 'folder') {
    data.name = 'home';
  } else {
    data.name = 'spreadsheet';
  }
  return data;
};
