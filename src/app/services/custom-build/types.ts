// Shared types for custom build steps

export type CoreType = 'web' | 'mobile' | 'both' | null;

export interface SelectedAddOn {
  id: string;
  name: string;
  price: number;
}
