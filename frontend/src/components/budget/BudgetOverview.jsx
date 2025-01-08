import React, { useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    LinearProgress,
    Divider,
    Stack,
    Paper,
    Alert,
    IconButton
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[3],
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
    }
}));

const StatCard = ({ title, value }) => (
    <Box 
        sx={{ 
            p: 2, 
            bgcolor: 'background.paper', 
            borderRadius: 1, 
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }
        }}
    >
        <Typography variant="body2" color="textSecondary" gutterBottom>
            {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ fontWeight: 500 }}>
            ${value.toLocaleString()}
        </Typography>
    </Box>
);

const CategoryProgress = ({ category, spent, totalBudget }) => {
    const percentage = (spent / totalBudget) * 100;

    return (
        <Box mb={2}>
            <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{category}</Typography>
                <Typography variant="body2" color="textSecondary">
                    ${spent.toLocaleString()} ({percentage.toFixed(1)}% of total)
                </Typography>
            </Box>
            <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(0, 0, 0, 0.08)',
                    '& .MuiLinearProgress-bar': {
                        bgcolor: '#2E2957',
                        borderRadius: 3,
                    }
                }}
            />
        </Box>
    );
};

const SectionHeader = ({ title, expanded, onToggle }) => (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onToggle} size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
    </Box>
);

const BudgetOverview = () => {
    const { budget, summary, loading, error } = useSelector(
        (state) => ({
            budget: state.budget.budget,
            summary: state.budget.summary,
            loading: state.budget.loading,
            error: state.budget.error
        }),
        (prev, next) => {
            return prev.loading === next.loading &&
                prev.error === next.error &&
                prev.budget?.id === next.budget?.id &&
                prev.budget?.totalAmount === next.budget?.totalAmount &&
                prev.summary?.totalSpent === next.summary?.totalSpent &&
                prev.summary?.totalPaid === next.summary?.totalPaid &&
                prev.summary?.totalPending === next.summary?.totalPending;
        }
    );

    if (loading) return <Box>Loading...</Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!budget || !summary) return null;

    return (
        <Box>
            {/* Stats Overview */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="Total Budget"
                        value={budget.totalAmount}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="Total Spent"
                        value={summary.totalSpent}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="Total Paid"
                        value={summary.totalPaid}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="Pending Payments"
                        value={summary.totalPending}
                    />
                </Grid>
            </Grid>

            {/* Budget Progress */}
            <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                    Budget Utilization
                </Typography>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2" color="textSecondary">
                        ${summary.totalSpent.toLocaleString()} / ${budget.totalAmount.toLocaleString()}
                    </Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={Math.min((summary.totalSpent / budget.totalAmount) * 100, 100)}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(0, 0, 0, 0.08)',
                        '& .MuiLinearProgress-bar': {
                            bgcolor: '#2E2957',
                            borderRadius: 4,
                        }
                    }}
                />
            </Box>

            {/* Category Breakdown */}
            <Box>
                <Typography variant="h6" gutterBottom>
                    Category Breakdown
                </Typography>
                <Grid container spacing={3}>
                    {Object.entries(summary.spentByCategory || {}).map(([category, spent], index, array) => {
                        // Calculate dynamic grid size
                        let mdSize = 12; // Default full width
                        const totalItems = array.length;
                        
                        if (totalItems === 2) {
                            mdSize = 6; // Two equal columns
                        } else if (totalItems === 3) {
                            mdSize = 4; // Three equal columns
                        } else if (totalItems >= 4) {
                            const itemsInFirstRow = totalItems % 3 === 0 ? 3 : 
                                                  totalItems % 2 === 0 ? 2 : 3;
                            const isInFirstRow = index < itemsInFirstRow;
                            mdSize = isInFirstRow ? 12 / itemsInFirstRow : 6;
                        }

                        return (
                            <Grid item xs={12} md={mdSize} key={category}>
                                <CategoryProgress
                                    category={category}
                                    spent={spent}
                                    totalBudget={budget.totalAmount}
                                />
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </Box>
    );
};

export default BudgetOverview; 