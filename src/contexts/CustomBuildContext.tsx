'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type CoreType = 'web' | 'mobile' | 'both' | null;

export interface SelectedAddOn {
  id: string;
  name: string;
  price: number;
}

interface CustomBuildState {
  step: number;
  core: CoreType;
  addOns: SelectedAddOn[];
}

interface CustomBuildContextType {
  state: CustomBuildState;
  updateState: (state: CustomBuildState) => void;
  resetState: () => void;
}

const CustomBuildContext = createContext<CustomBuildContextType | undefined>(undefined);

const STORAGE_KEY = 'hexadigitall_custom_build';

export function CustomBuildProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CustomBuildState>({
    step: 1,
    core: null,
    addOns: []
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse custom build state from localStorage:', e);
      }
    }
    setIsHydrated(true);
  }, []);

  const updateState = (newState: CustomBuildState) => {
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const resetState = () => {
    const newState: CustomBuildState = {
      step: 1,
      core: null,
      addOns: []
    };
    setState(newState);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!isHydrated) {
    return children;
  }

  return (
    <CustomBuildContext.Provider value={{ state, updateState, resetState }}>
      {children}
    </CustomBuildContext.Provider>
  );
}

export function useCustomBuild() {
  const context = useContext(CustomBuildContext);
  if (context === undefined) {
    throw new Error('useCustomBuild must be used within CustomBuildProvider');
  }
  return context;
}
