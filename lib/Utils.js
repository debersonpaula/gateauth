"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function AddSeconds(currentDate, secs) {
    return currentDate + (1000 * secs);
}
exports.AddSeconds = AddSeconds;
function AddMinutes(currentDate, minutes) {
    return AddSeconds(currentDate, minutes * 60);
}
exports.AddMinutes = AddMinutes;
function AddHours(currentDate, hours) {
    return AddMinutes(currentDate, hours * 60);
}
exports.AddHours = AddHours;
function AddDays(currentDate, days) {
    return AddHours(currentDate, days * 24);
}
exports.AddDays = AddDays;
