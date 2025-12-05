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

const COLLECTION = "branches";

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
                id: doc.id, 
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
 * @param id - Firestore document ID
 * @returns - Branch object
 * @throws - Error if branch not found
 */
export const getBranchById = async (id: string): Promise<Branch> => {
    try {
        const doc: DocumentSnapshot<DocumentData> | null = await getDocumentById(COLLECTION, id);

        if (!doc || !doc.exists) {
            throw new Error(`Branch with ID ${id} not found`);
        }

        const data = doc.data() as Partial<Branch>;

        const branch: Branch = {
            id: doc.id,
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
 * @param branchData - The data for the new branch (no ID)
 * @returns - The created branch with generated ID
 */
export const createBranch = async (
    branchData: Omit<Branch, "id">
): Promise<Branch> => {
    try {
        const newId = await createDocument<Branch>(COLLECTION, branchData);

        const newBranch: Branch = {
            id: newId, 
            ...branchData,
        };

        return structuredClone(newBranch);
    } catch (error) {
        throw error;
    }
};

/**
 * Update an existing branch
 * @param id - Firestore document ID
 * @param branchData - Fields to update
 * @returns - Updated branch
 * @throws - Error if branch not found
 */
export const updateBranch = async (
    id: string,
    branchData: Partial<Omit<Branch, "id">>
): Promise<Branch> => {
    try {
        const existingBranch = await getBranchById(id);

        const updatedBranch: Branch = {
            ...existingBranch,
            ...branchData,
        };

        await updateDocument<Branch>(COLLECTION, id, updatedBranch);

        return structuredClone(updatedBranch);
    } catch (error) {
        throw error;
    }
};

/**
 * Delete a branch
 * @param id - Firestore document ID
 * @throws - Error if branch not found
 */
export const deleteBranch = async (id: string): Promise<void> => {
    try {
        await getBranchById(id); 
        await deleteDocument(COLLECTION, id);
    } catch (error) {
        throw error;
    }
}

