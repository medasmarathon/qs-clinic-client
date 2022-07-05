export class RoleResponse {
  role_name?: String;
  reception_allowed?: boolean = false;
  examination_allowed?: boolean = false;
  prescription_allowed?: boolean = false;
  medication_delivery_allowed?: boolean = false;
  user_readable?: boolean = false;
  user_writable?: boolean = false;
  role_readable?: boolean = false;
  role_writable?: boolean = false;
}
