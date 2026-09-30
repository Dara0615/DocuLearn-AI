/**
 * Gemini AI Engine & API Integration Module
 */

async function callGeminiApi(prompt) {
    const apiKey = localStorage.getItem('doculearn_gemini_key');
    
    if (!apiKey) {
        return null; // Triggers local fallback mock in app.js
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (err) {
        console.error("Gemini API Error:", err);
        return null;
    }
}

function generateMockSummary(docName) {
    return `### Summary for ${docName}\n\n- **Core Topic**: Introduction and fundamentals covered in the document.\n- **Key Finding 1**: Important theoretical concepts and practical applications.\n- **Key Finding 2**: Structured workflows and key takeaways for quick study.\n- **Conclusion**: Essential reading material for course assessments.`;
}

function generateMockQuiz() {
    return [
        {
            question: "What is the primary objective of this document?",
            options: ["To provide an overview of the core subject", "To test advanced theories", "To list references only", "None of the above"],
            answer: 0,
            explanation: "The document establishes key foundational concepts right at the beginning."
        },
        {
            question: "Which feature helps in setting review milestones?",
            options: ["File Uploader", "Deadline Calendar", "Flashcards", "Theme Switcher"],
            answer: 1,
            explanation: "The Deadline Calendar provides scheduling tools."
        }
    ];
}