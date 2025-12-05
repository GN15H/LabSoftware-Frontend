import { EvidenceType } from "./types";

export interface IEvidenceMap {
  id: number;
  file_path: string;
}

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

  static fromMap({ id, file_path }: IEvidenceMap): Evidence {
    return new Evidence({
      id: id,
      description: "",
      filePath: file_path,
      evidenceType: 'photo'
    })
  }
}

