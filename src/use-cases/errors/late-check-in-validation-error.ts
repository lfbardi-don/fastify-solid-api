export class LateCheckInValidationError extends Error {
    constructor() {
        super('Check-in expired, you can only validate it until 20 minutes after your check-in time.');
    }
}