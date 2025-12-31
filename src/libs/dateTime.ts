import type { Range } from "@components/base/DatePickerRange/DatePickerRange.types";

export enum Day {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export interface RangeDate {
  start_date: string;
  end_date: string;
}

type Direction = "previous" | "next" | "current";

export const dateTime = {
  formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }).format(date);
  },

  getRangeDaily(date: Date): Range {
    return {
      start_date: date,
      end_date: date,
    };
  },

  /**
   *
   * @param startDay
   * Sunday: 0
   * Monday: 1
   * Tuesday: 2
   * Wednesday: 3
   * Thursday: 4
   * Friday: 5
   * Saturday: 6
   *
   * @returns
   */
  getRangeWeekly(date: Date, direction: Direction = "previous"): Range {
    if (direction === "previous") {
      const today = new Date(date);
      today.setDate(date.getDate() - 6);
      return {
        start_date: today,
        end_date: date,
      };
    }

    if (direction === "next") {
      const end = new Date(date);
      end.setDate(date.getDate() + 6);
      return {
        start_date: date,
        end_date: end,
      };
    }

    const startDate = new Date(date);
    const endDate = new Date(date);

    startDate.setDate(date.getDate() + (0 - date.getDay()));
    endDate.setDate(date.getDate() + (6 - date.getDay()));

    return {
      start_date: startDate,
      end_date: endDate,
    };
  },

  /**
   *
   * @param year
   * @param month
   * month: 1 - 12
   * @returns
   */
  getRangeThisMonth(
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1
  ): Range {
    if (month < 1 || month > 12) {
      throw new Error("Month must be between 1 and 12.");
    }

    const firstDate = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0);

    return {
      start_date: firstDate,
      end_date: lastDate,
    };
  },

  /**
   *
   * @param year
   * @returns
   */
  getRangeThisYear(year = new Date().getFullYear()): Range {
    const firstDate = new Date(year, 0, 1);
    const lastDate = new Date(year, 12, 0);

    return {
      start_date: firstDate,
      end_date: lastDate,
    };
  },

  /**
   *
   * @param value
   * @param locale
   * @param options
   * @returns
   */
  getDate(value?: Date, locale = "id", options?: Intl.DateTimeFormatOptions) {
    const dates = new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      ...options,
    }).format(value || new Date());
    return dates;
  },

  /**
   *
   * @param utcDateString
   * @returns
   */
  formatTimeFromUTC(utcDateString: string): string {
    const date = new Date(utcDateString);

    const time = new Intl.DateTimeFormat("id-ID", {
      hour: "numeric",
      minute: "numeric",
    })
      .format(date)
      .split(".");

    return `${time[0]}:${time[1]}`;
  },

  /**
   *
   * @param utcDateString
   * @returns
   */
  convertToLocalTime(utcDateString: string): string {
    const utcDate = new Date(utcDateString);

    // Get the timezone offset in minutes and convert it to milliseconds
    const timezoneOffset = utcDate.getTimezoneOffset() * -1; // Negative for offset direction
    const localTime = new Date(utcDate.getTime() + timezoneOffset * 60 * 1000);

    // Format to ISO string but retain the 'Z' to match your desired format
    const isoString = localTime.toISOString();
    return isoString.slice(0, -1) + "Z";
  },

  getRangeTime(start: string, end: string) {
    return `${this.formatTimeFromUTC(start)} - ${this.formatTimeFromUTC(end)}`;
  },

  /**
   *
   * @param totalSeconds
   * @returns
   *
   * return: 2h 34m 34s
   */
  convertSecondsToTimeFormat(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    if (!hours && !minutes) return `${seconds}s`;
    if (!hours) return `${minutes}m ${seconds}s`;
    return `${hours}h ${minutes}m ${seconds}s`;
  },

  /**
   *
   * @param startYear
   * @param endYear
   * @returns
   *
   */
  generateYears(startYear: number, endYear = new Date().getFullYear()) {
    return Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );
  },

  generateMonths(year = new Date().getFullYear()) {
    return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ].map((month, index) => {
      return {
        label: month,
        value: this.getRangeThisMonth(year, index + 1),
      };
    });
  },

  formatSecondsToHMS(seconds: number, showZero?: boolean): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const hoursStr = hours.toString().padStart(2, "0");
    const minutesStr = minutes.toString().padStart(2, "0");
    const secondsStr = secs.toString().padStart(2, "0");

    if (hoursStr === "00" && !showZero) return `${minutesStr} : ${secondsStr}`;
    return `${hoursStr} : ${minutesStr} : ${secondsStr}`;
  },

  secondsToHMS(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
  },

  HMSToSeconds(h: number, m: number, s: number) {
    return h * 3600 + m * 60 + s;
  },
};
