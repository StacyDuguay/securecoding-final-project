import { Branch } from "../models/branchModel";
import { branches } from "../../../data/branches"

// In-memory storage
const branchStorage: Branch[] = [...branches];

/**
 * Get all branches
 * @returns Array of all branches
 */
export const getAllBranches = async (): Promise<Branch[]> => {
    return structuredClone(branchStorage);
};

/**
 * Get a branch by ID
 * @param id Branch ID
 * @returns Branch object
 * @throws Error if branch not found
 */
export const getBranchById = async (id: number): Promise<Branch> => {
    const branch = branchStorage.find(b => b.id === id);

    if (!branch) {
        throw new Error(`Branch with ID ${id} not found`);
    }

    return structuredClone(branch);
};

/**
 * Create a new branch
 * @param branchData The data for the new branch
 * @returns The created branch with generated ID
 */
export const createBranch = async (
    branchData: Omit<Branch, "id">
): Promise<Branch> => {
    const newBranch: Branch = {
    id: Date.now(), // unique enough for in-memory storage
    ...branchData,
  };

  branchStorage.push(newBranch);

  return structuredClone(newBranch);
};

/**
 * Update an existing branch
 * @param id Branch ID
 * @param branchData Fields to update
 * @returns Updated branch
 * @throws Error if branch not found
 */
export const updateBranch = async (
    id: number,
    branchData: Partial<Omit<Branch, "id">>
): Promise<Branch> => {
    const index = branchStorage.findIndex(b => b.id === id);
    
    if (index === -1) {
        throw new Error(`Branch with ID ${id} not found`)
    };

    branchStorage[index] = { 
        ...branchStorage[index], 
        ...branchData 
    };

    return structuredClone(branchStorage[index]);
};

/**
 * Delete a branch
 * @param id Branch ID
 * @throws Error if branch not found
 */
export const deleteBranch = async (id: number): Promise<void> => {
    const index = branchStorage.findIndex(b => b.id === id);

    if (index === -1) {
        throw new Error(`Branch with ID ${id} not found`)
    };

    branchStorage.splice(index, 1);
};
