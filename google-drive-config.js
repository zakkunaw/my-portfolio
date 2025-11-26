// Google Drive API Configuration
// Get your API key from: https://console.cloud.google.com/

const GOOGLE_DRIVE_CONFIG = {
  apiKey: '', // Akan diisi nanti dari admin panel
  clientId: '', // OAuth 2.0 Client ID
  appId: '',
  scope: 'https://www.googleapis.com/auth/drive.file',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  folderId: '' // Portfolio folder ID di Google Drive
};

// Initialize Google Drive API
let gapi = window.gapi;
let googleAuth = null;
let isGoogleDriveReady = false;

// Load Google API
function loadGoogleDriveAPI() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      gapi.load('client:auth2', () => {
        resolve();
      });
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Initialize Google Drive
async function initGoogleDrive(apiKey, clientId) {
  try {
    await gapi.client.init({
      apiKey: apiKey,
      clientId: clientId,
      discoveryDocs: GOOGLE_DRIVE_CONFIG.discoveryDocs,
      scope: GOOGLE_DRIVE_CONFIG.scope
    });
    
    googleAuth = gapi.auth2.getAuthInstance();
    isGoogleDriveReady = true;
    
    // Check if user is already signed in
    if (!googleAuth.isSignedIn.get()) {
      await googleAuth.signIn();
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing Google Drive:', error);
    return false;
  }
}

// Sign in to Google Drive
async function signInGoogleDrive() {
  if (!googleAuth) {
    throw new Error('Google Drive not initialized');
  }
  
  if (!googleAuth.isSignedIn.get()) {
    await googleAuth.signIn();
  }
  
  return googleAuth.isSignedIn.get();
}

// Upload file to Google Drive
async function uploadToGoogleDrive(file, projectId) {
  if (!isGoogleDriveReady) {
    throw new Error('Google Drive not ready. Please configure API credentials.');
  }
  
  if (!googleAuth.isSignedIn.get()) {
    await signInGoogleDrive();
  }
  
  try {
    // Get or create portfolio folder
    let folderId = GOOGLE_DRIVE_CONFIG.folderId;
    if (!folderId) {
      folderId = await createPortfolioFolder();
      GOOGLE_DRIVE_CONFIG.folderId = folderId;
      // Save folder ID to localStorage
      const config = getGoogleDriveConfig();
      config.folderId = folderId;
      saveGoogleDriveConfig(config);
    }
    
    // Create project folder if not exists
    const projectFolderId = await getOrCreateProjectFolder(folderId, projectId);
    
    // Prepare file metadata
    const metadata = {
      name: file.name,
      mimeType: file.type,
      parents: [projectFolderId]
    };
    
    // Convert file to base64
    const base64Data = await fileToBase64(file);
    const base64Content = base64Data.split(',')[1];
    
    // Upload file using multipart upload
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
    
    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: ' + file.type + '\r\n' +
      'Content-Transfer-Encoding: base64\r\n\r\n' +
      base64Content +
      close_delim;
    
    const response = await gapi.client.request({
      path: '/upload/drive/v3/files',
      method: 'POST',
      params: { uploadType: 'multipart' },
      headers: {
        'Content-Type': 'multipart/related; boundary="' + boundary + '"'
      },
      body: multipartRequestBody
    });
    
    // Make file publicly accessible (optional)
    await makeFilePublic(response.result.id);
    
    return {
      id: response.result.id,
      name: response.result.name,
      webViewLink: `https://drive.google.com/file/d/${response.result.id}/view`,
      webContentLink: `https://drive.google.com/uc?id=${response.result.id}&export=download`,
      thumbnailLink: file.type.startsWith('image/') 
        ? `https://drive.google.com/thumbnail?id=${response.result.id}&sz=w400`
        : null
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
}

// Create portfolio folder in Google Drive
async function createPortfolioFolder() {
  const metadata = {
    name: 'Portfolio Media',
    mimeType: 'application/vnd.google-apps.folder'
  };
  
  const response = await gapi.client.drive.files.create({
    resource: metadata,
    fields: 'id'
  });
  
  return response.result.id;
}

// Get or create project folder
async function getOrCreateProjectFolder(parentFolderId, projectId) {
  // Search for existing folder
  const response = await gapi.client.drive.files.list({
    q: `name='${projectId}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    spaces: 'drive'
  });
  
  if (response.result.files.length > 0) {
    return response.result.files[0].id;
  }
  
  // Create new folder
  const metadata = {
    name: projectId,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentFolderId]
  };
  
  const createResponse = await gapi.client.drive.files.create({
    resource: metadata,
    fields: 'id'
  });
  
  return createResponse.result.id;
}

// Make file publicly accessible
async function makeFilePublic(fileId) {
  try {
    await gapi.client.drive.permissions.create({
      fileId: fileId,
      resource: {
        role: 'reader',
        type: 'anyone'
      }
    });
  } catch (error) {
    console.warn('Could not make file public:', error);
  }
}

// Delete file from Google Drive
async function deleteFromGoogleDrive(fileId) {
  if (!isGoogleDriveReady) {
    throw new Error('Google Drive not initialized');
  }
  
  try {
    await gapi.client.drive.files.delete({
      fileId: fileId
    });
    return true;
  } catch (error) {
    console.error('Error deleting from Google Drive:', error);
    return false;
  }
}

// Get file metadata from Google Drive
async function getFileFromGoogleDrive(fileId) {
  if (!isGoogleDriveReady) {
    throw new Error('Google Drive not initialized');
  }
  
  try {
    const response = await gapi.client.drive.files.get({
      fileId: fileId,
      fields: 'id, name, mimeType, webViewLink, webContentLink, thumbnailLink'
    });
    return response.result;
  } catch (error) {
    console.error('Error getting file from Google Drive:', error);
    return null;
  }
}

// Save Google Drive config to localStorage
function saveGoogleDriveConfig(config) {
  localStorage.setItem('googleDriveConfig', JSON.stringify(config));
}

// Load Google Drive config from localStorage
function getGoogleDriveConfig() {
  const saved = localStorage.getItem('googleDriveConfig');
  if (saved) {
    const config = JSON.parse(saved);
    GOOGLE_DRIVE_CONFIG.apiKey = config.apiKey || '';
    GOOGLE_DRIVE_CONFIG.clientId = config.clientId || '';
    GOOGLE_DRIVE_CONFIG.folderId = config.folderId || '';
    return config;
  }
  return { apiKey: '', clientId: '', folderId: '' };
}

// Helper function to convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
