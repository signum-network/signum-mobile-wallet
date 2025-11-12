export enum OperationType {
  Add = "Add",
  Remove = "Remove",
}

// Form schemas

export type ManageCommitment = {
  type: OperationType;
  amount: number;
};
