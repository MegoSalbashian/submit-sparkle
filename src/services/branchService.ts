export type Branch = {
  id: string;
  name: string;
};

// Default branches that will always be available
const DEFAULT_BRANCHES: Branch[] = [
  { id: "1", name: "Abdoun" },
  { id: "2", name: "Abdali" },
  { id: "3", name: "7th Circle" },
  { id: "4", name: "Yasmeen" },
  { id: "5", name: "Abdoun Circle" },
  { id: "6", name: "Sweifieh" },
  { id: "7", name: "Gardens" },
  { id: "8", name: "Khalda" },
  { id: "9", name: "Dabouq" },
  { id: "10", name: "Shmeisani" },
  { id: "11", name: "Mecca Street" },
  { id: "12", name: "Rabieh" }
];

// Get branches from localStorage and merge with defaults
const getStoredBranches = (): Branch[] => {
  try {
    const storedBranchesString = localStorage.getItem('custom_branches');
    const storedBranches = storedBranchesString ? JSON.parse(storedBranchesString) : [];
    
    // Merge stored branches with default branches, preventing duplicates
    const mergedBranches = [...DEFAULT_BRANCHES];
    
    storedBranches.forEach((storedBranch: Branch) => {
      if (!mergedBranches.some(branch => branch.name.toLowerCase() === storedBranch.name.toLowerCase())) {
        mergedBranches.push(storedBranch);
      }
    });
    
    return mergedBranches;
  } catch (error) {
    console.error('Error loading branches:', error);
    return DEFAULT_BRANCHES;
  }
};

// Initialize branches
export let branches: Branch[] = getStoredBranches();

// Update storage with only custom branches
const updateStorage = () => {
  try {
    // Only store branches that aren't in the default set
    const customBranches = branches.filter(
      branch => !DEFAULT_BRANCHES.some(
        defaultBranch => defaultBranch.name.toLowerCase() === branch.name.toLowerCase()
      )
    );
    localStorage.setItem('custom_branches', JSON.stringify(customBranches));
  } catch (error) {
    console.error('Error saving branches:', error);
  }
};

export const addBranch = (name: string) => {
  if (branches.some(branch => branch.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("Branch with this name already exists");
  }

  const maxId = Math.max(...branches.map(branch => parseInt(branch.id)));
  const newBranch = {
    id: (maxId + 1).toString(),
    name: name.trim(),
  };
  
  branches = [...branches, newBranch];
  updateStorage();
  return newBranch;
};

export const updateBranch = (id: string, name: string) => {
  const index = branches.findIndex(b => b.id === id);
  if (index !== -1) {
    branches[index].name = name.trim();
    updateStorage();
  }
};

export const deleteBranch = (id: string) => {
  // Prevent deletion of default branches
  const isDefaultBranch = DEFAULT_BRANCHES.some(branch => branch.id === id);
  if (isDefaultBranch) {
    throw new Error("Cannot delete default branch");
  }
  
  branches = branches.filter(b => b.id !== id);
  updateStorage();
};