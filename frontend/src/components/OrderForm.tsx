import { useState } from 'react';
import { TextField, Grid, Select, MenuItem, FormControl, InputLabel, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Customer } from '../types/customer';
import { Product } from '../types/product';

interface OrderItem {
  productId: string;
  quantity: number;
}

interface OrderFormProps {
  order: {
    customerId: string;
    status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
    items: OrderItem[];
    totalAmount: number;
    notes?: string;
  };
  customers: Customer[];
  products: Product[];
  onChange: (field: string, value: any) => void;
}

export default function OrderForm({ order, customers, products, onChange }: OrderFormProps) {
  const [newItem, setNewItem] = useState({ productId: '', quantity: 1 });

  const handleAddItem = () => {
    if (newItem.productId && newItem.quantity > 0) {
      const updatedItems = [...order.items, {
        productId: newItem.productId,
        quantity: newItem.quantity,
      }];
      onChange('items', updatedItems);
      setNewItem({ productId: '', quantity: 1 });
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = order.items.filter((_, i) => i !== index);
    onChange('items', updatedItems);
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid component="div" xs={12}>
          <FormControl fullWidth>
            <InputLabel>Customer</InputLabel>
            <Select
              value={order.customerId}
              label="Customer"
              onChange={(e) => onChange('customerId', e.target.value)}
              required
            >
              {customers.map((customer) => (
                <MenuItem key={customer._id} value={customer._id}>
                  {customer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid component="div" xs={12}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={order.status}
              label="Status"
              onChange={(e) => onChange('status', e.target.value)}
              required
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid component="div" xs={12}>
          <Typography variant="h6" gutterBottom>
            Order Items
          </Typography>
          {order.items.map((item, index) => {
            const product = products.find(p => p._id === item.productId);
            return (
              <Grid container key={index} spacing={2} alignItems="center">
                <Grid component="div" xs={6}>
                  <Typography>
                    {product?.name} (${product?.price.toFixed(2)})
                  </Typography>
                </Grid>
                <Grid component="div" xs={4}>
                  <Typography>Quantity: {item.quantity}</Typography>
                </Grid>
                <Grid component="div" xs={2}>
                  <Button
                    color="error"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
        <Grid component="div" xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid component="div" xs={6}>
              <FormControl fullWidth>
                <InputLabel>Product</InputLabel>
                <Select
                  value={newItem.productId}
                  label="Product"
                  onChange={(e) => setNewItem(prev => ({ ...prev, productId: e.target.value }))}
                >
                  {products.map((product) => (
                    <MenuItem key={product._id} value={product._id}>
                      {product.name} (${product.price.toFixed(2)})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid component="div" xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                value={newItem.quantity}
                onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid component="div" xs={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddItem}
                disabled={!newItem.productId || newItem.quantity < 1}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid component="div" xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Notes"
            value={order.notes || ''}
            onChange={(e) => onChange('notes', e.target.value)}
          />
        </Grid>
      </Grid>
    </div>
  );
} 