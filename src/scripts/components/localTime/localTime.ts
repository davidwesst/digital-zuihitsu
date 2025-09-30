import template from './localTime.html?raw';

class LocalTime extends HTMLElement {
    private intervalId?: number;

    connectedCallback(): void {
        if (!this.innerHTML.trim()) {
            this.innerHTML = template;
        }

        const timeElement = this.querySelector('time');
        if (!timeElement) {
            console.error('LocalTimeWidget: <time> tag missing inside template.');
            return;
        }

        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZoneName: 'short'
            };
            timeElement.textContent = now.toLocaleTimeString([], options);
            timeElement.setAttribute('datetime', now.toISOString());
        };

        updateTime();
        this.intervalId = window.setInterval(updateTime, 1000);
    }

    disconnectedCallback(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}

if (!customElements.get('local-time-widget')) {
    customElements.define('local-time-widget', LocalTime);
}
