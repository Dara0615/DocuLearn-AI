/**
 * Schedule & Calendar Helper Module
 */

function renderCalendarGrid(events = []) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let html = `<div class="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-gray-500 mb-2">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
    </div><div class="grid grid-cols-7 gap-1 text-xs">`;

    // Padding blank days
    for (let i = 0; i < firstDay; i++) {
        html += `<div class="h-16 p-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg"></div>`;
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = events.filter(e => e.date === dateStr);
        const isToday = day === now.getDate();

        html += `<div class="h-16 p-1 border border-gray-100 dark:border-gray-700/50 rounded-lg ${isToday ? 'bg-brand-50/50 dark:bg-brand-900/20 border-brand-500' : 'bg-white dark:bg-gray-800'} overflow-hidden">
            <span class="font-bold text-xs ${isToday ? 'text-brand-500' : ''}">${day}</span>
            <div class="mt-1 space-y-1">
                ${dayEvents.map(e => `<div class="text-[10px] truncate px-1 py-0.5 rounded bg-brand-500 text-white">${e.title}</div>`).join('')}
            </div>
        </div>`;
    }

    html += `</div>`;
    return html;
}