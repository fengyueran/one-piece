import { Data } from './data';
import { DataResource } from './dataresource';

const parseData = async (data: Data): Promise<DataResource> => new DataResource(data);

export { parseData };
