export interface Response<T> {
  success: boolean;
  data: T;
  message: string;
}
export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  INTERESTED = 'interested',
  CONVERTED = 'converted',
}

export enum LeadSource {
  WEBSITE = 'website',
  REFERRAL = 'referral',
  AD = 'ad',
  MANUAL = 'manual',
}
