import { Appointment, Patient } from "fhir/r5";
import { CLINIC_NAME } from "src/globals";

export class PatientInfoVM {
    patient: Patient;
    currentAppointment: Appointment;
    orderNumber: number;

    public get code() {
        return this.patient.identifier?.find(
            (id) => id.use === "official" && id.assigner === CLINIC_NAME
        )?.value;
    }
    public get telecom() {
        return this.patient.telecom?.map((com) => com.value);
    }
    public get fullname() {
        let humanName = this.patient.name?.find((n) => n.use === "official");
        return humanName
            ? `${humanName?.family} ${humanName?.given?.join(" ")}`
            : "";
    }
    public get visitStatus() {
        return this.currentAppointment.status;
    }
}

export class ReceptionVM {
    patientWaitingList: PatientInfoVM[];
}
