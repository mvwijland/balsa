export const getFileIcon = file => {
  if (file.fileType === 'document') {
    return 'file.svg';
  } else if (file.fileType === 'folder') {
    return 'folder.svg';
  } else {
    return 'spreadsheet.svg';
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
