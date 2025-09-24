import React from 'react'

export default function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null
  return (
    <div className="modal-backdrop" style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',zIndex:1050}}>
      <div className="card p-3" style={{minWidth:320}}>
        <h5>{title}</h5>
        <p>{message}</p>
        <div className="text-end">
          <button className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
