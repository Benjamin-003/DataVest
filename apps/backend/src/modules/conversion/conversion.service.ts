import { prisma } from '../../prisma/client';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
  parseTagValue: true,
  trimValues: true,
});


let nodeCounter = 1; // commence à 1 car le nœud racine est 0

function buildTree(obj: unknown, tag: string, parentId: number, nodes: TreeNode[]): number {
  const id = nodeCounter++;
  const node: TreeNode = {
    id,
    tag,
    value: '',
    parentId,
    children: [],
  };
  nodes.push(node);

  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    node.value = String(obj);
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const childId = buildTree(item, `${tag}[${index}]`, id, nodes);
      node.children.push(childId);
    });
  } else if (typeof obj === 'object' && obj !== null) {
    Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
      const childId = buildTree(value, key, id, nodes);
      node.children.push(childId);
    });
  }

  return id;
}

export const conversionService = {

  async create(userId: string, fileName: string, xmlContent: string, userName: string) {
    // Conversion XML → JSON
    const jsonObject = parser.parse(xmlContent);
    const jsonContent = JSON.stringify(jsonObject, null, 2);

    // Construction de l'arbre de nœuds
    nodeCounter = 1;
    const nodes: TreeNode[] = [];
    buildTree(jsonObject, 'root', 0, nodes);

    // Nœud racine
    const rootNode: RootNode = {
      id: 0,
      user_name: userName,
      parentId: -1,
      children: nodes.filter(n => n.parentId === 0).map(n => n.id),
    };

    const tree: (RootNode | TreeNode)[] = [rootNode, ...nodes];
    const treeContent = JSON.stringify(tree, null, 2);

    return prisma.conversion.create({
      data: { userId, fileName, xmlContent, jsonContent, treeContent },
    });
  },

  async findAllByUser(userId: string) {
    return prisma.conversion.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        createdAt: true,
      },
    });
  },

  async findOneByUser(userId: string, conversionId: string) {
    const conversion = await prisma.conversion.findFirst({
      where: { id: conversionId, userId },
    });
    if (!conversion) throw new Error('Conversion introuvable');
    return conversion;
  },

  async delete(userId: string, conversionId: string) {
    const conversion = await prisma.conversion.findFirst({
      where: { id: conversionId, userId },
    });
    if (!conversion) throw new Error('Conversion introuvable');
    return prisma.conversion.delete({ where: { id: conversionId } });
  },
};