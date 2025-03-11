import { Role } from "../model/user.model.js";

export class CredentialsResponseData {
  id: number;
  role: Role;
  constructor(id: number, role: Role) {
    this.id = id;
    this.role = role;
  }
}
