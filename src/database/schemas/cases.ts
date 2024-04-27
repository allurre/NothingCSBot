import { Schema, model, Document } from "mongoose";
import { logger } from "#root/logger.js";
import { ICommonCase } from "../interfaces/case.js";

const CaseSchema: Schema = new Schema({
  _id: { type: String, required: true },
  name: {
    type: [
      {
        lang_code: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    required: true,
  },
  description: {
    type: [
      {
        lang_code: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    required: false,
  },
  loot: [{ type: String, required: true, default: 0 }],
  can_drop: { type: Boolean, required: true, default: false },
  price: { type: Number, required: true, default: -1 },
  release: { type: Boolean, required: true, default: false },
  file_id: { type: String, required: false, default: undefined },
});

const Case = model<ICommonCase>("Case", CaseSchema);

export default Case;

export async function getCase(
  id: string,
): Promise<(Document & ICommonCase) | undefined> {
  if (!id) {
    logger.error("Case Id is required.");
    return undefined;
  }

  const caseDatabase = await Case.findById(id);
  if (caseDatabase) {
    return caseDatabase;
  }
  logger.error("Case is not found.");
  return undefined;
}

export function createCase(
  id: string,
  name: string,
): (Document & ICommonCase) | undefined {
  if (!id || !name) {
    logger.error("New Case data is required.");
    return undefined;
  }

  const caseDatabase = new Case({
    _id: id,
    name: [
      {
        lang_code: "en",
        value: name,
      },
    ],
  });
  return caseDatabase;
}

export async function getAllReleaseCases(): Promise<
  Array<Document & ICommonCase> | undefined
> {
  const releasedCases = await Case.find({ release: true });
  if (releasedCases.length > 0) {
    return releasedCases;
  }

  return undefined;
}

export async function getAllUnReleasedCases(): Promise<
  Array<Document & ICommonCase> | undefined
> {
  const unReleasedCases = await Case.find({ release: false });
  if (unReleasedCases.length > 0) {
    return unReleasedCases;
  }

  return undefined;
}

export async function getAllCases(): Promise<
  Array<Document & ICommonCase> | undefined
> {
  const allCases = await Case.find();
  if (allCases.length > 0) {
    return allCases;
  }

  return undefined;
}

export async function updateCaseData(
  id: string,
  newCaseData: Partial<ICommonCase>,
): Promise<(Document & ICommonCase) | undefined> {
  const caseDocument = await Case.findById(id);
  if (!caseDocument) {
    logger.error("Case is not found.");
    return undefined;
  }
  Object.assign(caseDocument, newCaseData);
  await caseDocument.save();
  return caseDocument;
}
