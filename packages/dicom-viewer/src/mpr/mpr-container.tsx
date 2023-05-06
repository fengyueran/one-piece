import { useEffect, useMemo, useRef, useState } from 'react';

import { MPR } from './mpr';
import { Plane } from '../helpers';
import { DicomViewer } from '../dicom-viewer';
import { MPRManager, getSeriesDicom, State } from './mpr-manager';

interface Props {
  planes?: Plane[];
  getSeriesDicom: getSeriesDicom;
}

export const MPRContainer: React.FC<Props> = (props) => {
  const { getSeriesDicom } = props;

  const planes = useMemo(() => {
    return props.planes || [Plane.Axial, Plane.Sagittal, Plane.Coronal];
  }, [props.planes]);

  const mprManagerRef = useRef(new MPRManager());
  const [viewerReady, setViewerReady] = useState(false);
  const [, forceUpdate] = useState<object>();

  useEffect(() => {
    const start = async () => {
      const handlerMap = {
        [State.Ready]: () => setViewerReady(true),
      };
      await mprManagerRef.current.createDicomManagers(planes, getSeriesDicom);
      forceUpdate({});
    };
    start();

    const mprManager = mprManagerRef.current;

    return () => {
      mprManager.destroy();
    };
  }, [planes, getSeriesDicom]);

  const renderViewers = () =>
    [Plane.Axial, Plane.Sagittal, Plane.Coronal].map((plane) => {
      const dicomManager = mprManagerRef.current.getDicomManager(plane);
      return (
        dicomManager && <DicomViewer key={plane} dicomManager={dicomManager} />
      );
    });

  return <MPR>{renderViewers()}</MPR>;
};
