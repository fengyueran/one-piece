import React, { useEffect, useState, useRef } from 'react';
import * as ccloader from '@cc/loader';
import { SceneModelTicker } from '@cc/viewers-reducer';

import {
  getDicom,
  makeImg3DByDicomBufferList,
  createDicomSceneModel,
  Plane,
  getBasicInfo,
} from '../helpers';
import { DicomSceneModel } from '../scene';
import { DicomViewer } from './dicom-viewer';
import { Image3DFromDicom, Image3D, makeAxialLoader } from '../image-loader';

export const DicomViewerContainer = () => {
  const [ready, setReady] = useState(false);
  const sceneModel = useRef<DicomSceneModel>();
  const basicInfo = useRef<any>();
  const crosshair = useRef<ccloader.image.SliceIndexAndCoords2D>();
  useEffect(() => {
    const start = async () => {
      console.log('loading');
      const bufferList = await getDicom();
      const img3D = await makeImg3DByDicomBufferList(bufferList);

      sceneModel.current = createDicomSceneModel(Plane.Axial, img3D);
      const axial = makeAxialLoader(img3D);

      basicInfo.current = getBasicInfo(img3D, sceneModel.current);

      sceneModel.current.nc.on('crosshairChanged', (e: [number, number, number]) => {
        const coords2D = sceneModel.current!.info.coords3DTo2D(e);
        if (!crosshair.current) {
          setReady(true);
          crosshair.current = coords2D;
          console.log('finish');
        }
      });
    };
    start();
  }, []);

  useEffect(() => {
    const ticker = new SceneModelTicker([() => sceneModel.current!]);

    ticker.startTick();

    return ticker.destory;
  }, []);

  const attachParent = (parent: HTMLElement) => {
    sceneModel.current?.attachParentDom(parent);
  };
  const attachInput = (input: HTMLElement) => {
    sceneModel.current?.attachInputDom(input);
  };
  const detachParent = () => {
    sceneModel.current?.detachParentDom();
  };
  const detachInput = () => {
    sceneModel.current?.detachInputDom();
  };
  const scrollBarProps = {
    count: basicInfo.current?.spaceInfo.count,
    crosshair: crosshair.current!,
  };
  const setCrosshair = (crosshair: ccloader.image.SliceIndexAndCoords2D) => {
    const coords3D = sceneModel.current?.info.coords2DTo3D(crosshair);

    if (coords3D) {
      sceneModel.current?.setCrosshair(coords3D);
    }
  };

  return (
    <DicomViewer
      attachParent={attachParent}
      attachInput={attachInput}
      detachParent={detachParent}
      detachInput={detachInput}
      scrollBarProps={scrollBarProps}
      setCrosshair={setCrosshair}
      isViewerReady={ready && !!crosshair.current}
    />
  );
};

export default DicomViewer;
