import React from 'react';

type Props = {
  title: string;
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<Props> = ({ title, show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="modal d-block" role="dialog" aria-labelledby="modalTitle">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 id="modalTitle" className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
