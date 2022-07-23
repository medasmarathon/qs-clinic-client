import { defineStore } from "pinia";
import { API, BASE_URL } from "src/globals";
import { httpRequest } from "src/infrastructure/request";
import { Patient } from "fhir/r5";

export const usePatientStore = defineStore("patient", () => {
    async function getPatientById(id: string): Promise<Patient | null> {
        let patientResult = await httpRequest.get<Patient>(
            `${BASE_URL}${API.Patient}/${id}`
        );
        return patientResult;
    }

    async function upsertPatient(
        upsertRequest: Patient
    ): Promise<Patient | null> {
        let patientResult = await httpRequest.put<Patient>(
            `${BASE_URL}${API.Patient}`,
            upsertRequest
        );
        return patientResult;
    }

    return {
        getPatientById,
        upsertPatient,
    };
});
