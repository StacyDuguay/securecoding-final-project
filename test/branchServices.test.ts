import * as branchService from "../src/api/v1/services/branchServices";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";

jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Branch Service", () => {
    const mockBranch = {
        id: 1,
        name: "Main Branch",
        address: "123 Main St",
        phone: "555-0001",
    };

    beforeEach(() => jest.clearAllMocks());

    it("should return all branches", async () => {
        // Arrange
        (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue({
            empty: false,
            docs: [{ data: () => mockBranch }],
        });

        // Act
        const result = await branchService.getAllBranches();

        // Assert
        expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("branches");
        expect(result).toEqual([mockBranch]);
    });

    it("should return a branch by ID", async () => {
        // Arrange
        (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue({
            exists: true,
            data: () => mockBranch,
        });

        // Act
        const result = await branchService.getBranchById(1);

        // Assert
        expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("branches", "1");
        expect(result).toEqual(mockBranch);
    });

    it("should create a new branch", async () => {
        // Arrange
        jest.spyOn(branchService, "getBranchById").mockRejectedValue(new Error("not found"));
        (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(undefined);
        const newBranch = { id: 2, name: "Second Branch", address: "456 Elm St", phone: "555-0002" };

        // Act
        const result = await branchService.createBranch(newBranch);

        // Assert
        expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
            "branches",
            newBranch,
            newBranch.id.toString()
        );
        expect(result).toEqual(newBranch);
    });

    it("should update an existing branch", async () => {
        // Arrange
        const updatedData = { phone: "555-1111" };
        jest.spyOn(branchService, "getBranchById").mockResolvedValue(mockBranch);
        (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(undefined);

        // Act
        const result = await branchService.updateBranch(1, updatedData);

        // Assert
        expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
            "branches",
            "1",
            { ...mockBranch, ...updatedData }
        );
        expect(result.phone).toBe("555-1111");
    });

    it("should delete a branch successfully", async () => {
        // Arrange
        jest.spyOn(branchService, "getBranchById").mockResolvedValue(mockBranch);
        (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(undefined);

        // Act
        await branchService.deleteBranch(1);

        // Assert
        expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("branches", "1");
    });
});
