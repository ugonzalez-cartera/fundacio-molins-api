export abstract class User {
  constructor(
    public email: string,
    public givenName: string,
    public familyName: string,
    public role: string,
  ) {}
}
