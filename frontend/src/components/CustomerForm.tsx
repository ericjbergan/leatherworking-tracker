import { TextField, Grid } from '@mui/material';

interface CustomerFormProps {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function CustomerForm({ customer, onChange }: CustomerFormProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Name"
          value={customer.name}
          onChange={(e) => onChange('name', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={customer.email}
          onChange={(e) => onChange('email', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Phone"
          value={customer.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          required
        />
      </Grid>
    </Grid>
  );
} 