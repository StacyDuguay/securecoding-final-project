import { Branch } from "../models/branchModel";
import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

const COLLECTION: string = "branches";

/**
 * Get all branches
 * @returns - Array of all branches
 */
export const getAllBranches = async (): Promise<Branch[]> => {
    try {
        const snapshot: QuerySnapshot<DocumentData> = await getDocuments(COLLECTION);

        const branches: Branch[] = snapshot.docs.map((doc) => {
            const data = doc.data() as Partial<Branch>;

        return {
            id: Number(data.id) || 0, 
            name: data.name ?? "",
            address: data.address ?? "",
            phone: data.phone ?? "",
        };
    });

    return structuredClone(branches);
  } catch (error) {
    throw error;
  }
};

/**
 * Get a branch by ID
 * @param id - Branch ID
 * @returns - Branch object
 * @throws - Error if branch not found
 */
export const getBranchById = async (
    id: number
): Promise<Branch> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(COLLECTION, id.toString());

        if (!doc || !doc.exists) {
            throw new Error(`Branch with ID ${id} not found`);
        }

        const data = doc.data() as Partial<Branch>;

        const branch: Branch = {
            id: Number(data.id) || id,
            name: data.name ?? "",
            address: data.address ?? "",
            phone: data.phone ?? "",
        };

        return structuredClone(branch);
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new branch
 * @param branchData - The data for the new branch
 * @returns - The created branch with generated ID
 */
export const createBranch = async (
    branchData: Branch
): Promise<Branch> => {
    try {
    const existingBranch = await getBranchById(branchData.id).catch((err) => {
      if (err.message.includes("not found")) return null;
      throw err; 
    });

    if (existingBranch) {
      throw new Error(`Branch with ID ${branchData.id} already exists`);
    }

    const newBranch: Partial<Branch> = { ...branchData };
    await createDocument<Branch>(COLLECTION, newBranch, branchData.id.toString());

    return structuredClone(newBranch as Branch);
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing branch
 * @param id - Branch ID
 * @param branchData - Fields to update
 * @returns - Updated branch
 * @throws - Error if branch not found
 */
export const updateBranch = async (
    id: number,
    branchData: Partial<Omit<Branch, "id">>
): Promise<Branch> => {
    try {
        const existingBranch = await getBranchById(id);

        const updatedBranch: Branch = {
            ...existingBranch,
            ...branchData,
        };

        await updateDocument<Branch>(COLLECTION, id.toString(), updatedBranch);

        return structuredClone(updatedBranch);
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a branch
 * @param id - Branch ID
 * @throws - Error if branch not found
 */
export const deleteBranch = async (
    id: number
): Promise<void> => {
    try {
        await getBranchById(id); 
        await deleteDocument(COLLECTION, id.toString());
  } catch (error) {
    throw error;
  }
};
