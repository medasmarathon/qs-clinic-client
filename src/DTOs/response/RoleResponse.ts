export class RoleResponse {
    role_name?: String;
    receptionAllowed?: boolean = false;
    examinationAllowed?: boolean = false;
    prescriptionAllowed?: boolean = false;
    medicationDeliveryAllowed?: boolean = false;
    userReadable?: boolean = false;
    userWritable?: boolean = false;
    roleReadable?: boolean = false;
    roleWritable?: boolean = false;
}
