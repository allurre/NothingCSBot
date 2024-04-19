import { Schema, model, Document } from "mongoose";
import { logger } from "#root/logger.js";
import { ICommonCase } from "../interfaces/case.js";

const CaseSchema: Schema = new Schema({
  _id: { type: String, required: true },
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
    name,
  });
  return caseDatabase;
}

export async function getAllReleasedCases(): Promise<
  Array<Document & ICommonCase> | undefined
> {
  const releasedCases = await Case.find({ release: true });
  return releasedCases;
}

export async function getAllUnReleasedCases(): Promise<
  Array<Document & ICommonCase> | undefined
> {
  const releasedCases = await Case.find({ release: false });
  return releasedCases;
}

export async function getAllCases(): Promise<
  Array<Document & ICommonCase> | undefined
> {
  const allCases = await Case.find();
  return allCases;
}

export async function updateCaseData(
  id: string,
  newcasedata: Partial<ICommonCase>,
): Promise<(Document & ICommonCase) | undefined> {
  const caseDocument = await Case.findById(id);
  if (!caseDocument) {
    logger.error("Case is not found.");
    return undefined;
  }
  Object.assign(caseDocument, newcasedata);
  await caseDocument.save();
  return caseDocument;
}
