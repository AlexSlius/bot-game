import { Injectable } from '@nestjs/common'

@Injectable()
export class ReminderService {
    private reminders = new Map<string, NodeJS.Timeout>()

    setReminder(chatId: string, callback: () => void, ms: number = 1800000) {
        this.clearReminder(chatId)

        const timeout = setTimeout(() => {
            this.reminders.delete(chatId)
            callback()
        }, ms)

        this.reminders.set(chatId, timeout)
    }

    clearReminder(chatId: string) {
        const timeout = this.reminders.get(chatId);
        
        if (timeout) {
            clearTimeout(timeout)
            this.reminders.delete(chatId)
        }
    }

    hasReminder(chatId: string) {
        return this.reminders.has(chatId)
    }
}
