import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';

export const useConfirm = () => {
    const [dialog, setDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null
    });

    const showConfirm = (title, message) => {
        return new Promise((resolve) => {
            setDialog({
                isOpen: true,
                title,
                message,
                onConfirm: (confirmed) => {
                    setDialog({ ...dialog, isOpen: false });
                    resolve(confirmed);
                }
            });
        });
    };

    const ConfirmDialog = () => {
        const handleClose = () => {
            dialog.onConfirm(false);
        };

        const handleConfirm = () => {
            dialog.onConfirm(true);
        };

        return (
            <Dialog
                open={dialog.isOpen}
                onClose={handleClose}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">
                    {dialog.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        {dialog.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="error" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return {
        showConfirm,
        ConfirmDialog
    };
}; 