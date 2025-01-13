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
  return [
    { id: "1", name: "Abdoun" },
    { id: "2", name: "Abdali" },
    { id: "3", name: "7th Circle" },
    { id: "4", name: "Yasmeen" },
    { id: "5", name: "Abdoun Circle" }
  ];
};

export let branches: Branch[] = getStoredBranches();

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
  
  localStorage.setItem('branches', JSON.stringify(branches));
  return newBranch;
};