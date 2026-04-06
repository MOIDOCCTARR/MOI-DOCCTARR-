export interface DiagnosisDataSource {
  dataset: string;
  sourceUrl: string;
  license: string;
  rowCount: number;
  symptomCount: number;
  conditionCount: number;
  generatedAt: string;
}

export interface SymptomCatalogItem {
  key: string;
  label: string;
  aliases: string[];
  conditionCount: number;
}

export interface ConditionProfile {
  rawName: string;
  name: string;
  slug: string;
  rowCount: number;
  symptomKeys: string[];
  symptomWeights: Record<string, number>;
  totalWeight: number;
}

export const diagnosisDataSource: DiagnosisDataSource;
export const symptomCatalog: SymptomCatalogItem[];
export const featuredSymptomKeys: string[];
export const conditionProfiles: ConditionProfile[];
