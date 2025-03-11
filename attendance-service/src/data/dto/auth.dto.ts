export type Role = "admin" | "employee";

export class CredentialsResponseData {
  id: number;
  role: Role;
  constructor(id: number, role: Role) {
    this.id = id;
    this.role = role;
  }
}
