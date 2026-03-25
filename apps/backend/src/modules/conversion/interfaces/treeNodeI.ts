interface TreeNode {
  id: number;
  value: string;
  tag: string;
  parentId: number | null;
  children: number[];
}