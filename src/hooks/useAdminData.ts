import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { AdminKPI, FeatureFlags, PromptConfig } from '../types';

export const useAdminData = () => {
  const [kpis, setKpis] = useState<AdminKPI | null>(null);
  const [flags, setFlags] = useState<FeatureFlags | null>(null);
  const [prompts, setPrompts] = useState<PromptConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [k, f, p] = await Promise.all([
          adminService.getKPIs(),
          adminService.getFeatureFlags(),
          adminService.getPrompts()
        ]);
        setKpis(k);
        setFlags(f);
        setPrompts(p);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateFlag = async (flag: keyof FeatureFlags, value: boolean) => {
    if (!flags) return;
    setFlags({ ...flags, [flag]: value });
    await adminService.updateFeatureFlag(flag, value);
  };

  return { kpis, flags, prompts, loading, updateFlag };
};
