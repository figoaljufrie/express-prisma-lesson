import { reminderSchedule } from "./reminder"
import { reminder2Schedule } from "./reminder2";

export const initScheduler = () => {
  //tambahin scheduler lagi:
  reminderSchedule();
  reminder2Schedule()
};