// src/stores/useOrganizationForm.ts
import { create } from 'zustand';

type Taxation =
  | 'Налог на профессиональный доход ("самозанятые")'
  | 'УСН (доходы)'
  | 'УСН (доходы минус расходы)'
  | 'АУСН (доходы)'
  | 'АУСН (доходы минус расходы)'
  | 'Только патент'
  | 'Общая';

type PhysicalType = 'Самозанятый' | 'ИП';
type OrgType = 'Физическое лицо' | 'Юридическое лицо';

interface OrgFormState {
  type: OrgType;
  status: PhysicalType;
  lastName: string;
  firstName: string;
  middleName: string;
  prefix: string;
  inn: string;
  taxation: Taxation;
  showPrefixTip: boolean;
  showInnTip: boolean;

  setType: (v: OrgType) => void;
  setStatus: (v: PhysicalType) => void;
  setLastName: (v: string) => void;
  setFirstName: (v: string) => void;
  setMiddleName: (v: string) => void;
  setPrefix: (v: string) => void;
  setInn: (v: string) => void;
  setTaxation: (v: Taxation) => void;
  setShowPrefixTip: (v: boolean) => void;
  setShowInnTip: (v: boolean) => void;
}

export const useOrgFormStore = create<OrgFormState>((set) => ({
  type: 'Физическое лицо',
  status: 'Самозанятый',
  lastName: '',
  firstName: '',
  middleName: '',
  prefix: '',
  inn: '',
  taxation: 'Налог на профессиональный доход ("самозанятые")',
  showPrefixTip: false,
  showInnTip: false,

  setType: (type) => set({ type, status: type === 'Физическое лицо' ? 'Самозанятый' : 'ИП' }),
  setStatus: (status) => set({ status }),
  setLastName: (lastName) => set({ lastName }),
  setFirstName: (firstName) => set({ firstName }),
  setMiddleName: (middleName) => set({ middleName }),
  setPrefix: (prefix) => set({ prefix }),
  setInn: (inn) => set({ inn }),
  setTaxation: (taxation) => set({ taxation }),
  setShowPrefixTip: (showPrefixTip) => set({ showPrefixTip }),
  setShowInnTip: (showInnTip) => set({ showInnTip }),
}));