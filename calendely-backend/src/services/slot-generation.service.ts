import { DateTime, Interval } from "luxon";


export interface TimeWindow {
    start: DateTime,
    end: DateTime
}

/**
 * Parses a time string in HH:mm format and sets it on a given date in the specified timezone.
 * @param date The date to set the time on.
 * @param timeString The time in HH:mm format (e.g., "14:30").
 * @param timeZone The IANA timezone identifier (e.g., "Asia/Kolkata").
 * @returns A new DateTime object representing the date with the specified time in the given timezone.
 */
export function parseTimeOnDate(date: DateTime, time: string, timeZone: string) {
    // Validate and parse the time string
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(time)) {
        throw new Error(`Invalid time format: ${time}. Expected HH:mm format.`);
    }

    const [hour, minute] = time.split(':').map(Number);

    // Create a new DateTime object with the specified date, time, and timezone
    // setZone() ensures the DateTime object is properly localized to the specified timezone
    return date.setZone(timeZone)
        .set({
            hour,
            minute,
            second: 0,
            millisecond: 0
        });
}

/*
combine the overlapping intervals 
[{09:00-12:00}, {11:00-14:00}] => [{09:00-14:00}]
*/

export function mergeWindows(windows: TimeWindow[]): TimeWindow[] {
    if (windows.length === 0) return [];    

    // Sort windows by start time
    windows.sort((a, b) => a.start.toMillis() - b.start.toMillis());

    const merged: TimeWindow[] = [];
    let current = { ...windows[0] };

    for (let i = 1; i < windows.length; i++) {      
        const next = windows[i];
        if (next.start <= current.end) {
            current.end = next.end > current.end ? next.end : current.end;
        }
        else {      
            merged.push(current);
            current = { ...next };
        }
    }

    merged.push(current);
    return merged;
}

export function splitIntoSlots(windows: TimeWindow[], 
    durationMinutes: number,
    bufferBeforeMinutes: number,
    bufferAfterMinutes: number,
): TimeWindow[] {
    const slots: TimeWindow[] = [];

    const totalMinutes = durationMinutes + bufferBeforeMinutes + bufferAfterMinutes;
    
    for (const window of windows) { 
        let cursor = window.start;

        while (cursor.plus({minutes: totalMinutes}) <= window.end) {  
            const slotStart = cursor.plus({ minutes: bufferBeforeMinutes });
            const slotEnd = slotStart.plus({ minutes: durationMinutes });
            
            slots.push({ start: slotStart, end: slotEnd });   

            cursor = slotEnd.plus({ minutes: bufferAfterMinutes }); 
        }
    }

    return slots;    
}

export function subtractWindows(windows: TimeWindow[], block: TimeWindow): TimeWindow[] {

    const result: TimeWindow[] = [];
    
    for (const w of windows) { 
        let interval = Interval.fromDateTimes(w.start, w.end);
        const blockInterval = Interval.fromDateTimes(block.start, block.end)

        if(!interval.overlaps(blockInterval)) {
            result.push(w);
            continue;
        }

        if(block.start> w.start){
            result.push({start:w.start, end:block.start})
        }
        if(block.end < w.end){
            result.push({start:block.end, end:w.end})
        }   
    }

    return result.filter(w=>w.start <= w.end);
}

export function overlapsBooked(slot: TimeWindow,booked:TimeWindow[],bufferBeforeMinutes:number,bufferAfterMinutes:number): boolean {
    
    const paddedStart= slot.start.minus({minutes:bufferBeforeMinutes});
    const paddedEnd= slot.end.plus({minutes:bufferAfterMinutes});

    return booked.some((b) => {
        const interval = Interval.fromDateTimes(paddedStart,paddedEnd);
        const bookedInterval = Interval.fromDateTimes(b.start,b.end);
        return interval.overlaps(bookedInterval);
    })  
}

export function applyExceptionsForDate(
    date: DateTime,
    baseWindows: TimeWindow[],
    exceptions: Array<{
        type: string,
        startTime: string | null,
        endTime: string | null,
        timeZone: string,
    }>
) : TimeWindow[] {
    let windows = [...baseWindows];

    for(const ex of exceptions) {
        if(ex.type === "BLOCK_FULL_DAY") {
            return []; // no slots for this date
        }

        if(ex.type === "BLOCK_PARTIAL" && ex.startTime && ex.endTime) {
            const block = {
                start: parseTimeOnDate(date, ex.startTime, ex.timeZone),
                end: parseTimeOnDate(date, ex.endTime, ex.timeZone),
            };
            windows = subtractWindows(windows, block);
        }

        if(ex.type === "ADD_AVAILABLE_WINDOW" && ex.startTime && ex.endTime) {
            windows.push({
                start: parseTimeOnDate(date, ex.startTime, ex.timeZone),
                end: parseTimeOnDate(date, ex.endTime, ex.timeZone),
            })
        }
    }

    return mergeWindows(windows);

}