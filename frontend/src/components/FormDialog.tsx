import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface FormDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
  submitButtonText?: string;
}

export default function FormDialog({
  open,
  title,
  onClose,
  onSubmit,
  children,
  submitButtonText = 'Save',
}: FormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained" color="primary">
          {submitButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 