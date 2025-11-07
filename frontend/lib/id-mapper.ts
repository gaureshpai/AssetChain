// frontend/lib/id-mapper.ts

// This map stores the mapping from hashed ID to original integer ID.
// It's a client-side, in-memory map.
const idMap = new Map<string, number>();

export function addIdMapping(hashedId: string, originalId: number): void {
  idMap.set(hashedId, originalId);
}

export function getOriginalId(hashedId: string): number | undefined {
  return idMap.get(hashedId);
}

export function clearIdMappings(): void {
  idMap.clear();
}
