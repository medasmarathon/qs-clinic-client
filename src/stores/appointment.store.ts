import { defineStore } from "pinia";
import { API, BASE_URL } from "src/globals";
import { httpRequest } from "src/infrastructure/request";
import { Appointment } from "fhir/r5";

export const useAppointmentStore = defineStore("appointment", () => {
    async function getAppointmentById(id: string): Promise<Appointment | null> {
        let appointmentResult = await httpRequest.get<Appointment>(
            `${BASE_URL}${API.Appointment}/${id}`
        );
        return appointmentResult;
    }

    async function upsertAppointment(
        upsertRequest: Appointment
    ): Promise<Appointment | null> {
        let appointmentResult = await httpRequest.put<Appointment>(
            `${BASE_URL}${API.Appointment}`,
            upsertRequest
        );
        return appointmentResult;
    }

    return {
        getAppointmentById,
        upsertAppointment,
    };
});
