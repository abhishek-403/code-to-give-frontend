import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboardPage = () => {

    const eventEngagementData = {
        labels: ['Event 1', 'Event 2', 'Event 3', 'Event 4', 'Event 5'],
        datasets: [
            {
                label: 'Engagement',
                data: [12, 19, 3, 5, 2],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
        ],
    };

    const eventEngagementOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Event Engagement',
            },
        },
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>

            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Event Management</CardTitle>
                    <CardDescription>Create and manage events.</CardDescription>
                </CardHeader>
                <CardContent className="flex space-x-4">
                    <Link to="/admin/events/create">
                        <Button>Create Event</Button>
                    </Link>
                    <Link to="/admin/events/manage">
                        <Button variant="outline">Manage Events</Button>
                    </Link>
                </CardContent>
            </Card>

			{/* random filler data visualization section temporarily */}
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Data Visualization</CardTitle>
                    <CardDescription>Metrics on engagement, task completion, and feedback.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Bar options={eventEngagementOptions} data={eventEngagementData} />
                </CardContent>
            </Card>

        </div>
    );
};

export default AdminDashboardPage;