export interface UserProfile {
  Id?: string;
  UserCreated?: boolean;
  Name?: string;
  Image?: string;
  AdditionalFields?: AdditionalFields;
}

export interface AdditionalFields {
  optOutPersonalDataUse?: string;
}
