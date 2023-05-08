import { useEffect, useMemo, useRef, useState } from 'react';

import { MPR } from './mpr';
import { Plane } from '../helpers';
import { DicomViewer } from '../dicom-viewer';
import { MPRManager, getSeriesDicom, OnStateChange } from './mpr-manager';

interface Props {
  planes?: Plane[];
  getSeriesDicom: getSeriesDicom;
  onStateChange?: OnStateChange;
}

export const MPRContainer: React.FC<Props> = (props) => {
  const { getSeriesDicom, onStateChange } = props;

  const planes = useMemo(() => {
    return props.planes || [Plane.Axial, Plane.Sagittal, Plane.Coronal];
  }, [props.planes]);

  const mprManagerRef = useRef(new MPRManager());
  const [, forceUpdate] = useState<object>();

  useEffect(() => {
    const start = async () => {
      await mprManagerRef.current.createDicomManagers(
        planes,
        getSeriesDicom,
        (data) => {
          if (onStateChange) {
            onStateChange(data);
          }
        }
      );
      forceUpdate({});
    };
    start();

    const mprManager = mprManagerRef.current;

    return () => {
      mprManager.destroy();
    };
  }, [planes, getSeriesDicom, onStateChange]);

  const renderViewers = () =>
    [Plane.Axial, Plane.Sagittal, Plane.Coronal].map((plane) => {
      const dicomManager = mprManagerRef.current.getDicomManager(plane);
      return (
        dicomManager && <DicomViewer key={plane} dicomManager={dicomManager} />
      );
    });

  return <MPR>{renderViewers()}</MPR>;
};
