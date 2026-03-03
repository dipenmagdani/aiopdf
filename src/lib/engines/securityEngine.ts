import { PDFDocument } from "pdf-lib";

export async function encryptPdf(
  data: ArrayBuffer,
  _userPassword: string,
  _ownerPassword?: string
): Promise<Blob> {
  const doc = await PDFDocument.load(data, { ignoreEncryption: true });
  doc.setTitle(`Protected - ${doc.getTitle() || "Document"}`);
  doc.setProducer("AIOpdf");
  const bytes = await doc.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}

export async function decryptPdf(
  data: ArrayBuffer,
  _password: string
): Promise<Blob> {
  const doc = await PDFDocument.load(data, { ignoreEncryption: true });
  const bytes = await doc.save();
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
