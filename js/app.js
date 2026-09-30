/**
 * Main Application Logic & View Controller
 */

let state = {
    documents: [],
    activeTab: 'dashboard',
    apiKey: localStorage.getItem('doculearn_gemini_key') || ''
};

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initDragAndDrop();
    switchTab('dashboard');
});

function switchTab(tabId) {
    state.activeTab = tabId;
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-brand-50', 'text-brand-600', 'dark:bg-brand-900/30', 'dark:text-brand-400');
    });
    
    const activeNav = document.getElementById(`nav-${tabId}`);
    if (activeNav) {
        activeNav.classList.add('bg-brand-50', 'text-brand-600', 'dark:bg-brand-900/30', 'dark:text-brand-400');
    }

    const viewContainer = document.getElementById('app-view');
    const titleEl = document.getElementById('page-title');

    if (tabId === 'dashboard') {
        titleEl.textContent = 'Dashboard';
        viewContainer.innerHTML = renderDashboard();
    } else if (tabId === 'files') {
        titleEl.textContent = 'My Documents';
        viewContainer.innerHTML = renderFilesView();
    } else if (tabId === 'calendar') {
        titleEl.textContent = 'Deadlines & Schedule';
        viewContainer.innerHTML = renderCalendarView();
    } else if (tabId === 'ai-lab') {
        titleEl.textContent = 'AI Learning Studio';
        viewContainer.innerHTML = renderAILabView();
    }
    lucide.createIcons();
}

function renderDashboard() {
    return `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
                <div class="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg">
                    <i data-lucide="file-text" class="w-6 h-6"></i>
                </div>
                <div>
                    <h4 class="text-2xl font-bold">${state.documents.length}</h4>
                    <p class="text-xs text-gray-500">Uploaded Files</p>
                </div>
            </div>
            <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
                <div class="p-3 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 rounded-lg">
                    <i data-lucide="clock" class="w-6 h-6"></i>
                </div>
                <div>
                    <h4 class="text-2xl font-bold">${state.documents.filter(d => d.deadline).length}</h4>
                    <p class="text-xs text-gray-500">Upcoming Deadlines</p>
                </div>
            </div>
            <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
                <div class="p-3 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg">
                    <i data-lucide="sparkles" class="w-6 h-6"></i>
                </div>
                <div>
                    <h4 class="text-2xl font-bold">Ready</h4>
                    <p class="text-xs text-gray-500">AI Assistant</p>
                </div>
            </div>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 class="font-bold mb-4 text-sm">Recent Uploads</h3>
            ${state.documents.length === 0 ? '<p class="text-xs text-gray-400">No documents uploaded yet. Click "Upload File" to get started.</p>' : ''}
            <div class="space-y-2">
                ${state.documents.map(doc => `
                    <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-between text-sm">
                        <div class="flex items-center space-x-3">
                            <i data-lucide="file" class="w-4 h-4 text-brand-500"></i>
                            <span class="font-medium">${doc.name}</span>
                        </div>
                        <span class="text-xs text-gray-400">${doc.subject || 'General'}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderFilesView() {
    return `<div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 class="font-bold text-sm mb-4">All Uploaded Files</h3>
        <div class="space-y-3">
            ${state.documents.length === 0 ? '<p class="text-xs text-gray-400">No documents uploaded yet.</p>' : ''}
            ${state.documents.map(doc => `
                <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between">
                    <div>
                        <p class="font-bold text-sm">${doc.name}</p>
                        <p class="text-xs text-gray-400">${doc.subject} • Deadline: ${doc.deadline || 'None'}</p>
                    </div>
                    <button onclick="switchTab('ai-lab')" class="px-3 py-1.5 bg-brand-500 text-white text-xs rounded-lg">Study with AI</button>
                </div>
            `).join('')}
        </div>
    </div>`;
}

function renderCalendarView() {
    const events = state.documents.filter(d => d.deadline).map(d => ({ title: d.name, date: d.deadline }));
    return `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 class="font-bold text-sm mb-4">Study Schedule & Deadlines</h3>
            ${renderCalendarGrid(events)}
        </div>
    `;
}

function renderAILabView() {
    return `
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
            <h3 class="font-bold text-sm">AI Study Tools</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onclick="alert('Summarizing active file...')" class="p-4 border rounded-xl hover:border-brand-500 text-left">
                    <p class="font-bold text-sm">Generate Summary</p>
                    <p class="text-xs text-gray-400 mt-1">Get bullet points and main concepts from your document.</p>
                </button>
                <button onclick="alert('Generating quiz...')" class="p-4 border rounded-xl hover:border-brand-500 text-left">
                    <p class="font-bold text-sm">Create Practice Quiz</p>
                    <p class="text-xs text-gray-400 mt-1">Generate multiple choice questions based on key concepts.</p>
                </button>
            </div>
        </div>
    `;
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
}

function saveApiKey() {
    const key = document.getElementById('api-key-input').value.trim();
    localStorage.setItem('doculearn_gemini_key', key);
    state.apiKey = key;
    closeModal('api-key-modal');
    alert('API Key Saved successfully!');
}

function initDragAndDrop() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });
}

async function handleFileUploadSubmit() {
    const fileInput = document.getElementById('file-input');
    if (fileInput.files.length) {
        await handleFile(fileInput.files[0]);
        closeModal('upload-modal');
    } else {
        alert('Please select a file first.');
    }
}

async function handleFile(file) {
    try {
        const text = await parseUploadedFile(file);
        const subject = document.getElementById('file-subject').value || 'General';
        const deadline = document.getElementById('file-deadline').value || null;

        state.documents.push({
            id: Date.now(),
            name: file.name,
            content: text,
            subject: subject,
            deadline: deadline
        });

        switchTab(state.activeTab);
        alert(`File "${file.name}" uploaded and parsed successfully!`);
    } catch (err) {
        alert('Error parsing file: ' + err.message);
    }
}