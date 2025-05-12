// src/types/subscription.types.ts
export interface Package {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
}

export interface Document {
  id: string;
  name: string;
  description: string;
  isUploaded: boolean;
  file?: File;
}

export interface ContactPerson {
  name: string;
  idNumber: string;
  mobileNumber: string;
  email: string;
  designation: string;
}

export interface CompanyDetails {
  name: string;
  email: string;
  registrationNumber: string;
  registrationAddress: string;
  presentAddress: string;
  isSameAsRegistration: boolean;
}
