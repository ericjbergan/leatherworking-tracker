import { TextField, Grid } from '@mui/material';

interface ProductFormProps {
  product: {
    name: string;
    description: string;
    price: number;
    stock: number;
  };
  onChange: (field: string, value: string | number) => void;
}

export default function ProductForm({ product, onChange }: ProductFormProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Name"
          value={product.name}
          onChange={(e) => onChange('name', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          multiline
          rows={3}
          value={product.description}
          onChange={(e) => onChange('description', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Price"
          type="number"
          value={product.price}
          onChange={(e) => onChange('price', parseFloat(e.target.value))}
          required
          InputProps={{
            startAdornment: '$',
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Stock"
          type="number"
          value={product.stock}
          onChange={(e) => onChange('stock', parseInt(e.target.value))}
          required
        />
      </Grid>
    </Grid>
  );
} 