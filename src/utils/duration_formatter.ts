export default function durationFormatter(duration: number): string {
    const seconds: number = Math.floor((duration / 1000) % 60);
    const minutes: number = Math.floor((duration / (1000 * 60)) % 60);
    const hours: number = Math.floor(duration / (1000 * 60 * 60));

    const hoursFormat: string = addZero(hours);
    const minutesFormat: string = addZero(minutes);
    const secondsFormat: string = addZero(seconds);

    return (hours > 0) ? `${hoursFormat}h:${minutesFormat}m:${secondsFormat}s` : `${minutesFormat}m:${secondsFormat}s`;
}

function addZero(time: number): string {
    return (time < 10) ? "0" + time : `${time}`;
}