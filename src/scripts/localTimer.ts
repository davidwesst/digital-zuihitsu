export function initializeLocalTime() {
    const timeDisplayElement = document.getElementById('localTimeDisplay');
    if (!timeDisplayElement) {
        console.error('Local timer was not found!');
    }
    else {
        function updateTime() {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZoneName: 'short'
            };
            timeDisplayElement!.textContent = now.toLocaleTimeString([], options);
        }
        updateTime(); // Initial call to set time immediately
        setInterval(updateTime, 1000); // Update every second
    }
}