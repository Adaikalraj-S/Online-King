"use client"

import React, { createContext, useContext, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const DialogContext = createContext();

export const useDialog = () => useContext(DialogContext);

export const DialogProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [onConfirm, setOnConfirm] = useState(null);
    const [onCancel, setOnCancel] = useState(null);

    const showDialog = (onConfirmCallback, onCancelCallback) => {
        setOnConfirm(() => onConfirmCallback);
        setOnCancel(() => onCancelCallback);
        setOpen(true);
    };

    const handleClose = (action) => {
        setOpen(false);
        if (action === 'confirm' && onConfirm) {
            onConfirm();
        } else if (action === 'cancel' && onCancel) {
            onCancel();
        }
    };

    return (
        <DialogContext.Provider value={{ showDialog }}>
            {children}
            <Dialog open={open} onClose={() => handleClose('cancel')}>
                <DialogTitle>Save Changes</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to save the changes before going back?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose('cancel')} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleClose('confirm')} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </DialogContext.Provider>
    );
};
