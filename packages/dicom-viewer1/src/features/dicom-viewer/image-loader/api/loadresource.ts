import { LoadParams, IResourceMgr, Priority, IResourceRep } from '../core';

// This is helper to only do fetch stuff. every fetched data will be wrapped into a DataResource.
export const loadResource = async (
  mgr: IResourceMgr,
  params: LoadParams,
  priority: Priority = Priority.Medium,
): Promise<IResourceRep> => {
  const rep = mgr.addResource(params);
  await rep.load(priority);
  return rep;
};
