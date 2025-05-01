import { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import {
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Inventory as ProductsIcon,
} from '@mui/icons-material';
import { orderApi, customerApi, productApi } from '../api';

const StatCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: any }) => (
  <Paper
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      height: 140,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Icon sx={{ mr: 1 }} />
      <Typography component="h2" variant="h6" color="primary">
        {title}
      </Typography>
    </Box>
    <Typography component="p" variant="h4">
      {value}
    </Typography>
  </Paper>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [ordersResponse, customersResponse, productsResponse] = await Promise.all([
          orderApi.getAll(),
          customerApi.getAll(),
          productApi.getAll(),
        ]);

        const activeOrders = ordersResponse.data.filter(
          (order: any) => order.status !== 'Completed' && order.status !== 'Cancelled'
        ).length;

        setStats({
          activeOrders,
          totalCustomers: customersResponse.data.length,
          totalProducts: productsResponse.data.length,
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Active Orders" value={stats.activeOrders} icon={OrdersIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Total Customers" value={stats.totalCustomers} icon={CustomersIcon} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Products" value={stats.totalProducts} icon={ProductsIcon} />
        </Grid>
      </Grid>
    </Box>
  );
} 