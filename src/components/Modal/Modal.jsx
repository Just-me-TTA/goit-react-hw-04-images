import { useEffect } from 'react';
import { Backdrop, ModalContainer } from './Modal.styled';
import { createPortal } from 'react-dom';

const modalRoot = document.querySelector('#modal-root');

export const Modal = ({ item, closeModal }) => {
  const handleBackdropClose = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleCloseByEsc = e => {
      if (e.code === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleCloseByEsc);

    return () => {
      window.removeEventListener('keydown', handleCloseByEsc);
    };
  }, [closeModal]);

  return createPortal(
    <Backdrop onClick={handleBackdropClose}>
      <ModalContainer>
        <img src={item.largeImageURL} alt={item.tags} />
      </ModalContainer>
    </Backdrop>,
    modalRoot
  );
};
