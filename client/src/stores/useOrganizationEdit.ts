// src/stores/useOrganizationEdit.ts
import { create } from 'zustand';

export type Taxation =
  | 'Налог на профессиональный доход ("самозанятые")'
  | 'УСН (доходы)'
  | 'УСН (доходы минус расходы)'
  | 'АУСН (доходы)'
  | 'АУСН (доходы минус расходы)'
  | 'Только патент'
  | 'Общая';

export type PhysicalType = 'Самозанятый' | 'ИП';
export type OrgType = 'Физическое лицо' | 'Юридическое лицо';

interface SingleOrgState {
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
}

const defaultSingleOrg: SingleOrgState = {
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
};

interface OrgEditStore {
  data: Record<string, SingleOrgState>;

  initForm: (id: string, initial?: Partial<SingleOrgState>) => void;
  setType: (id: string, type: OrgType) => void;
  setStatus: (id: string, status: PhysicalType) => void;
  setLastName: (id: string, lastName: string) => void;
  setFirstName: (id: string, firstName: string) => void;
  setMiddleName: (id: string, middleName: string) => void;
  setPrefix: (id: string, prefix: string) => void;
  setInn: (id: string, inn: string) => void;
  setTaxation: (id: string, taxation: Taxation) => void;
  setShowPrefixTip: (id: string, show: boolean) => void;
  setShowInnTip: (id: string, show: boolean) => void;

  resetForm: (id: string) => void;
}

export const useOrganizationEdit = create<OrgEditStore>((set, get) => ({
  data: {},

  initForm: (id, initial = {}) =>
    set((state) => ({
      data: {
        ...state.data,
        [id]: {
          ...defaultSingleOrg,
          ...initial,
        },
      },
    })),

  setType: (id, type) =>
    set((state) => {
      const prev = state.data[id] ?? defaultSingleOrg;
      const newStatus: PhysicalType = type === 'Физическое лицо' ? 'Самозанятый' : 'ИП';
      return {
        data: {
          ...state.data,
          [id]: {
            ...prev,
            type,
            status: newStatus,
          },
        },
      };
    }),

  setStatus: (id, status) =>
    set((state) => {
      const prev = state.data[id] ?? defaultSingleOrg;
      return {
        data: {
          ...state.data,
          [id]: {
            ...prev,
            status,
          },
        },
      };
    }),

  setLastName: (id, lastName) =>
    set((state) => {
      const prev = state.data[id] ?? defaultSingleOrg;
      return {
        data: {
          ...state.data,
          [id]: {
            ...prev,
            lastName,
          },
        },
      };
    }),

  setFirstName: (id, firstName) =>
    set((state) => {
      const prev = state.data[id] ?? defaultSingleOrg;
      return {
        data: {
          ...state.data,
          [id]: {
            ...prev,
            firstName,
          },
        },
      };
    }),

  setMiddleName: (id, middleName) =>
    set((state) => {
      const prev = state.data[id] ?? defaultSingleOrg;
      return {
        data: {
          ...state.data,
          [id]: {
            ...prev,
            middleName,
          },
        },
      };
    }),

  setPrefix: (id, prefix) =>
    set((state) => {
      const prev = state.data[id] ?? defaultSingleOrg;
      return {
        data: {
          ...state.data,
          [id]: {
            ...prev,
            prefix,
          },
        },
      };
    }),

  setInn: (id, inn) =>
    set((state) => {
      const prev = state.data[id] ?? defaultSingleOrg;
      return {
        data: {
          ...state.data,
          [id]: {
            ...prev,
            inn,
          },
        },
      };
    }),

  setTaxation: (id, taxation) =>
    set((state) => {
      const prev = state.data[id] ?? defaultSingleOrg;
      return {
        data: {
          ...state.data,
          [id]: {
            ...prev,
            taxation,
          },
        },
      };
    }),

  setShowPrefixTip: (id, show) =>
    set((state) => {
      const prev = state.data[id] ?? defaultSingleOrg;
      return {
        data: {
          ...state.data,
          [id]: {
            ...prev,
            showPrefixTip: show,
          },
        },
      };
    }),

  setShowInnTip: (id, show) =>
    set((state) => {
      const prev = state.data[id] ?? defaultSingleOrg;
      return {
        data: {
          ...state.data,
          [id]: {
            ...prev,
            showInnTip: show,
          },
        },
      };
    }),

  resetForm: (id) =>
    set((state) => {
      const newData = { ...state.data };
      delete newData[id];
      return { data: newData };
    }),
}));