export type Branch = {
  id: string;
  name: string;
};

// Get branches from localStorage or use default if none exist
const getStoredBranches = (): Branch[] => {
  const storedBranches = localStorage.getItem('branches');
  if (storedBranches) {
    return JSON.parse(storedBranches);
  }
  
  // Default branches
  const defaultBranches = [
    { id: "1", name: "Abdoun" },
    { id: "2", name: "Abdali" },
    { id: "3", name: "7th Circle" },
    { id: "4", name: "Yasmeen" },
    { id: "5", name: "Abdoun Circle" }
  ];
  
  // Store default branches in localStorage
  localStorage.setItem('branches', JSON.stringify(defaultBranches));
  return defaultBranches;
};

// Initialize branches from storage
export let branches: Branch[] = getStoredBranches();

// Update localStorage whenever branches are modified
const updateStorage = () => {
  localStorage.setItem('branches', JSON.stringify(branches));
};

export const addBranch = (name: string) => {
  if (branches.some(branch => branch.name.toLowerCase() === name.toLowerCase())) {
    throw new Error("Branch with this name already exists");
  }

  const maxId = Math.max(...branches.map(branch => parseInt(branch.id)));
  const newBranch = {
    id: (maxId + 1).toString(),
    name,
  };
  
  branches = [...branches, newBranch];
  updateStorage(); // Update localStorage after adding branch
  return newBranch;
};

// Add function to update branch
export const updateBranch = (id: string, name: string) => {
  const index = branches.findIndex(b => b.id === id);
  if (index !== -1) {
    branches[index].name = name;
    updateStorage(); // Update localStorage after modifying branch
  }
};

// Add function to delete branch
export const deleteBranch = (id: string) => {
  branches = branches.filter(b => b.id !== id);
  updateStorage(); // Update localStorage after deleting branch
};