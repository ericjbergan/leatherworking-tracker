import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FormDialog from '../components/FormDialog';
import OrderForm from '../components/OrderForm';
import { orderApi, customerApi, projectApi } from '../api';
import { Customer } from '../types/customer';
import { Product } from '../types/product';

interface OrderItem {
  productId: string;
  quantity: number;
}

interface Order {
  _id: string;
  customerId: string;
  items: OrderItem[];
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderForm, setOrderForm] = useState<{
    customerId: string;
    status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
    items: OrderItem[];
    totalAmount: number;
    notes?: string;
  }>({
    customerId: '',
    status: 'Pending',
    items: [],
    totalAmount: 0,
    notes: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersResponse, customersResponse, productsResponse] = await Promise.all([
          orderApi.getAll(),
          customerApi.getAll(),
          projectApi.getAll(),
        ]);
        setOrders(ordersResponse.data);
        setCustomers(customersResponse.data);
        setProducts(productsResponse.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (order?: Order) => {
    if (order) {
      setSelectedOrder(order);
      setOrderForm({
        customerId: order.customerId,
        status: order.status,
        items: order.items,
        totalAmount: order.totalAmount,
        notes: order.notes || '',
      });
    } else {
      setSelectedOrder(null);
      setOrderForm({
        customerId: '',
        status: 'Pending',
        items: [],
        totalAmount: 0,
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleFormChange = (field: string, value: any) => {
    setOrderForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (selectedOrder) {
        await orderApi.update(selectedOrder._id, orderForm);
      } else {
        await orderApi.create(orderForm);
      }
      const response = await orderApi.getAll();
      setOrders(response.data);
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save order');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await orderApi.delete(id);
      const response = await orderApi.getAll();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to delete order');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Orders</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Order
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow key={order._id}>
                  <TableCell>
                    {customers.find(c => c._id === order.customerId)?.name || 'Unknown Customer'}
                  </TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(order)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <FormDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title={selectedOrder ? 'Edit Order' : 'Add Order'}
        onSubmit={handleSubmit}
      >
        <OrderForm
          order={orderForm}
          onChange={handleFormChange}
          customers={customers}
          products={products}
        />
      </FormDialog>
    </Box>
  );
} 