/**
 * File Handling & Text Extraction Module
 */

window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

async function parseUploadedFile(file) {
    const fileType = file.name.split('.').pop().toLowerCase();
    
    if (fileType === 'txt') {
        return await file.text();
    } else if (fileType === 'pdf') {
        return await parsePDF(file);
    } else if (fileType === 'docx') {
        return await parseDOCX(file);
    } else {
        throw new Error('Unsupported file format');
    }
}

async function parsePDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
    }
    return fullText;
}

async function parseDOCX(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value;
}