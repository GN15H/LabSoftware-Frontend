import { EvidenceType } from "./types";

interface IEvidence {
  id: number;
  description: string;
  filePath: string;
  evidenceType: EvidenceType;
}

export class Evidence {
  id: number;
  description: string;
  filePath: string;
  evidenceType: EvidenceType;

  constructor({ id, description, filePath, evidenceType }: IEvidence) {
    this.id = id;
    this.description = description;
    this.filePath = filePath;
    this.evidenceType = evidenceType;
  }
}
