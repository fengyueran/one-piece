import { ModalFactory, ModalType } from './modal-factory';

export * from './modal';
export type { ModalBaseProps } from './base-modal';
export * from './animated-modal';

const info = ModalFactory.createModal(ModalType.Message);

export const toaster = { info };
