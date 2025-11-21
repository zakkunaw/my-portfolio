// Admin Panel JavaScript
// Data structure and management for portfolio

// Initialize IndexedDB for large files
let db;
const DB_NAME = 'PortfolioMediaDB';
const DB_VERSION = 1;
const MEDIA_STORE = 'projectMedia';

// Initialize IndexedDB
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        db.createObjectStore(MEDIA_STORE, { keyPath: 'projectId' });
      }
    };
  });
}

// Save media to IndexedDB
function saveMediaToDB(projectId, mediaArray) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    const transaction = db.transaction([MEDIA_STORE], 'readwrite');
    const store = transaction.objectStore(MEDIA_STORE);
    const request = store.put({ projectId, media: mediaArray });
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Load media from IndexedDB
function loadMediaFromDB(projectId) {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve([]);
      return;
    }
    
    const transaction = db.transaction([MEDIA_STORE], 'readonly');
    const store = transaction.objectStore(MEDIA_STORE);
    const request = store.get(projectId);
    
    request.onsuccess = () => {
      resolve(request.result?.media || []);
    };
    request.onerror = () => resolve([]);
  });
}

// Initialize default data
const defaultData = {
  profile: {
    fullName: "Your Name",
    jobTitle: "Your Title",
    bio: "Your bio description here. Tell people about yourself and what you do.",
    email: "your.email@example.com",
    avatarUrl: "",
    availableForWork: true
  },
  projects: [],
  products: []
};

// Load data from localStorage or use defaults
function loadData() {
  const saved = localStorage.getItem('portfolioData');
  return saved ? JSON.parse(saved) : defaultData;
}

// Save data to localStorage and IndexedDB for large files
function saveData(data) {
  localStorage.setItem('portfolioData', JSON.stringify(data));
}

// Toast notification
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification fixed top-4 right-4 z-50 animate-slide-in';
  
  const bgColor = type === 'success' ? 'bg-gray-900' : 'bg-red-600';
  const icon = type === 'success' 
    ? '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
    : '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
  
  toast.innerHTML = `
    <div class="${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
      <div class="flex-shrink-0">${icon}</div>
      <span class="font-medium">${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slide-out 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Tab switching
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('[id^="tab-"]').forEach(el => {
    el.classList.remove('tab-active', 'border-blue-600', 'text-blue-600');
    el.classList.add('border-transparent', 'text-gray-500');
  });
  
  // Show selected tab
  document.getElementById(`content-${tabName}`).classList.remove('hidden');
  const activeTab = document.getElementById(`tab-${tabName}`);
  activeTab.classList.add('tab-active', 'border-blue-600', 'text-blue-600');
  activeTab.classList.remove('border-transparent', 'text-gray-500');
}

// Profile management
function loadProfile() {
  const data = loadData();
  const profile = data.profile;
  
  document.getElementById('fullName').value = profile.fullName || '';
  document.getElementById('jobTitle').value = profile.jobTitle || '';
  document.getElementById('bio').value = profile.bio || '';
  document.getElementById('email').value = profile.email || '';
  document.getElementById('avatarUrl').value = profile.avatarUrl || '';
  document.getElementById('availableForWork').checked = profile.availableForWork;
}

document.getElementById('profileForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const data = loadData();
  
  data.profile = {
    fullName: document.getElementById('fullName').value,
    jobTitle: document.getElementById('jobTitle').value,
    bio: document.getElementById('bio').value,
    email: document.getElementById('email').value,
    avatarUrl: document.getElementById('avatarUrl').value,
    availableForWork: document.getElementById('availableForWork').checked
  };
  
  saveData(data);
  showToast('Profile saved successfully!', 'success');
});

// Projects management
async function loadProjects() {
  const data = loadData();
  const container = document.getElementById('projectsList');
  container.innerHTML = '';
  
  if (data.projects.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">No projects yet. Add your first project!</p>';
    return;
  }
  
  // Load media from IndexedDB for each project
  for (const project of data.projects) {
    if (project.hasMedia) {
      try {
        const media = await loadMediaFromDB(project.id);
        project.media = media;
      } catch (e) {
        console.error('Error loading media for project:', project.id, e);
      }
    }
  }
  
  data.projects.forEach((project, index) => {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50';
    div.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background: ${project.color}">
          ${project.name.charAt(0)}
        </div>
        <div>
          <h4 class="font-semibold">${project.name}</h4>
          <p class="text-sm text-gray-500">${project.description}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick="editProject(${index})" class="text-blue-600 hover:text-blue-700 px-3 py-1">Edit</button>
        <button onclick="deleteProject(${index})" class="text-red-600 hover:text-red-700 px-3 py-1">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

async function openProjectModal(index = null) {
  const modal = document.getElementById('projectModal');
  const form = document.getElementById('projectForm');
  form.reset();
  document.getElementById('mediaPreview').innerHTML = '';
  
  if (index !== null) {
    const data = loadData();
    const project = data.projects[index];
    document.getElementById('projectIndex').value = index;
    document.getElementById('projectName').value = project.name;
    document.getElementById('projectDesc').value = project.description;
    document.getElementById('projectColor').value = project.color;
    document.getElementById('projectClient').value = project.client || '';
    document.getElementById('projectCompany').value = project.company || '';
    document.getElementById('projectYear').value = project.year || '';
    document.getElementById('projectFullDescription').value = project.fullDescription || '';
    document.getElementById('projectWebsiteUrl').value = project.websiteUrl || '';
    
    // Load and show existing media from IndexedDB
    if (project.hasMedia) {
      try {
        const media = await loadMediaFromDB(project.id);
        if (media && media.length > 0) {
          showMediaPreview(media);
        }
      } catch (e) {
        console.error('Error loading media:', e);
      }
    }
  } else {
    document.getElementById('projectIndex').value = '';
  }
  
  modal.classList.remove('hidden');
}

// Handle file input preview
document.getElementById('projectMedia')?.addEventListener('change', async function(e) {
  const files = Array.from(e.target.files);
  const previewContainer = document.getElementById('mediaPreview');
  previewContainer.innerHTML = '';
  
  for (const file of files) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const div = document.createElement('div');
      div.className = 'relative rounded-lg overflow-hidden border';
      
      if (file.type.startsWith('image/')) {
        div.innerHTML = `<img src="${event.target.result}" class="w-full h-20 object-cover" />`;
      } else if (file.type.startsWith('video/')) {
        div.innerHTML = `<video src="${event.target.result}" class="w-full h-20 object-cover"></video>`;
      }
      
      previewContainer.appendChild(div);
    };
    reader.readAsDataURL(file);
  }
});

function showMediaPreview(mediaArray) {
  const previewContainer = document.getElementById('mediaPreview');
  previewContainer.innerHTML = '';
  
  mediaArray.forEach(media => {
    const div = document.createElement('div');
    div.className = 'relative rounded-lg overflow-hidden border';
    
    if (media.type === 'image') {
      div.innerHTML = `<img src="${media.data}" class="w-full h-20 object-cover" />`;
    } else if (media.type === 'video') {
      div.innerHTML = `<video src="${media.data}" class="w-full h-20 object-cover"></video>`;
    }
    
    previewContainer.appendChild(div);
  });
}

function closeProjectModal() {
  document.getElementById('projectModal').classList.add('hidden');
}

document.getElementById('projectForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Show loading
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';
  
  try {
    const data = loadData();
    const index = document.getElementById('projectIndex').value;
    const projectId = index === '' ? Date.now().toString() : data.projects[parseInt(index)].id || Date.now().toString();
    
    // Process media files
    const mediaFiles = document.getElementById('projectMedia').files;
    const mediaArray = [];
    
    if (mediaFiles && mediaFiles.length > 0) {
      // Check file sizes (max 100MB per file)
      const maxSize = 100 * 1024 * 1024; // 100MB
      for (const file of mediaFiles) {
        if (file.size > maxSize) {
          alert(`File "${file.name}" terlalu besar (max 100MB). Silakan compress dulu atau gunakan file lebih kecil.`);
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          return;
        }
      }
      
      // Process files
      submitBtn.textContent = 'Processing files...';
      for (const file of mediaFiles) {
        try {
          const base64 = await fileToBase64(file);
          mediaArray.push({
            type: file.type.startsWith('image/') ? 'image' : 'video',
            data: base64,
            name: file.name
          });
        } catch (err) {
          console.error('Error processing file:', file.name, err);
          alert(`Gagal memproses file "${file.name}". Coba lagi.`);
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          return;
        }
      }
    } else if (index !== '' && data.projects[parseInt(index)].media) {
      // Keep existing media if no new files uploaded
      mediaArray.push(...data.projects[parseInt(index)].media);
    }
    
    // Save media to IndexedDB if exists
    if (mediaArray.length > 0) {
      try {
        await saveMediaToDB(projectId, mediaArray);
      } catch (dbError) {
        console.error('Error saving media to IndexedDB:', dbError);
        showToast('Error saving media: ' + dbError.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        return;
      }
    }
    
    const project = {
      id: projectId,
      name: document.getElementById('projectName').value,
      description: document.getElementById('projectDesc').value,
      color: document.getElementById('projectColor').value || '#6366f1',
      link: `project-detail.html?id=${projectId}`,
      client: document.getElementById('projectClient')?.value || '',
      company: document.getElementById('projectCompany')?.value || '',
      year: document.getElementById('projectYear')?.value || new Date().getFullYear().toString(),
      fullDescription: document.getElementById('projectFullDescription')?.value || '',
      websiteUrl: document.getElementById('projectWebsiteUrl')?.value || '#',
      hasMedia: mediaArray.length > 0
    };
    
    if (index === '') {
      data.projects.push(project);
    } else {
      data.projects[parseInt(index)] = project;
    }
    
    // Save project data (without media) to localStorage
    try {
      localStorage.setItem('portfolioData', JSON.stringify(data));
      
      await loadProjects();
      closeProjectModal();
      showToast('Project saved successfully!', 'success');
    } catch (storageError) {
      console.error('Storage error:', storageError);
      showToast('Failed to save: ' + storageError.message, 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  } catch (error) {
    console.error('Error saving project:', error);
    alert('Terjadi error: ' + error.message);
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// Helper function to convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function editProject(index) {
  openProjectModal(index);
}

function deleteProject(index) {
  if (confirm('Delete this project?')) {
    const data = loadData();
    data.projects.splice(index, 1);
    saveData(data);
    loadProjects();
  }
}

// Products management
function loadProducts() {
  const data = loadData();
  const container = document.getElementById('productsList');
  container.innerHTML = '';
  
  if (data.products.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">No products yet. Add your first product!</p>';
    return;
  }
  
  data.products.forEach((product, index) => {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50';
    div.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style="background: ${product.color}">
          ${product.name.charAt(0)}
        </div>
        <div>
          <h4 class="font-semibold">${product.name}</h4>
          <p class="text-xs text-gray-500">${product.tag}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <button onclick="editProduct(${index})" class="text-blue-600 hover:text-blue-700 px-3 py-1">Edit</button>
        <button onclick="deleteProduct(${index})" class="text-red-600 hover:text-red-700 px-3 py-1">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function openProductModal(index = null) {
  const modal = document.getElementById('productModal');
  const form = document.getElementById('productForm');
  form.reset();
  
  if (index !== null) {
    const data = loadData();
    const product = data.products[index];
    document.getElementById('productIndex').value = index;
    document.getElementById('productName').value = product.name;
    document.getElementById('productTag').value = product.tag;
    document.getElementById('productColor').value = product.color;
    document.getElementById('productLink').value = product.link || '';
  } else {
    document.getElementById('productIndex').value = '';
  }
  
  modal.classList.remove('hidden');
}

function closeProductModal() {
  document.getElementById('productModal').classList.add('hidden');
}

document.getElementById('productForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const data = loadData();
  const index = document.getElementById('productIndex').value;
  
  const product = {
    name: document.getElementById('productName').value,
    tag: document.getElementById('productTag').value,
    color: document.getElementById('productColor').value || '#6366f1',
    link: document.getElementById('productLink').value || '#'
  };
  
  if (index === '') {
    data.products.push(product);
  } else {
    data.products[parseInt(index)] = product;
  }
  
  saveData(data);
  loadProducts();
  closeProductModal();
  showToast('Product saved successfully!', 'success');
});

function editProduct(index) {
  openProductModal(index);
}

function deleteProduct(index) {
  if (confirm('Delete this product?')) {
    const data = loadData();
    data.products.splice(index, 1);
    saveData(data);
    loadProducts();
  }
}

// Data export/import
function exportData() {
  const data = loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'portfolio-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const fileInput = document.getElementById('importFile');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Please select a file');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      localStorage.setItem('portfolioData', JSON.stringify(data));
      alert('Data imported successfully!');
      location.reload();
    } catch (error) {
      alert('Invalid JSON file');
    }
  };
  reader.readAsText(file);
}

// Load media from session storage if available
function loadProjectMedia(projectId) {
  try {
    const mediaData = sessionStorage.getItem('projectMedia');
    if (mediaData) {
      const media = JSON.parse(mediaData);
      return media[projectId] || [];
    }
  } catch (e) {
    console.error('Error loading media:', e);
  }
  return [];
}

// Initialize on load
document.addEventListener('DOMContentLoaded', async function() {
  try {
    await initDB();
    console.log('IndexedDB initialized successfully');
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    showToast('Warning: Large file storage may not work', 'error');
  }
  
  loadProfile();
  await loadProjects();
  loadProducts();
});
