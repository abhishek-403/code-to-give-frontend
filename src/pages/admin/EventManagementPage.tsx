// src/pages/admin/EventManagementPage.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const EventManagementPage = () => {
  // Mock data for existing events
  const [events, _] = useState([
    {
      id: 1,
      title: "Donation Drive",
      description: "Collect donations for the needy.",
      status: "active",
    },
    {
      id: 2,
      title: "Walk-a-thon",
      description: "A charity walk to raise awareness.",
      status: "active",
    },
    {
      id: 3,
      title: "Fundraiser",
      description: "Raise funds for the organization.",
      status: "underReview",
    },
    {
      id: 4,
      title: "Awareness Campaign",
      description: "Promote awareness about our cause.",
      status: "history",
    },
  ]);

  const handleEdit = (id: number) => {
    console.log(`Edit event ${id}`);
    // Implement edit functionality
  };

  const handleDelete = (id: number) => {
    console.log(`Delete event ${id}`);
    // Implement delete functionality
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Event Management</h2>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="underReview">Under Review</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Active Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events
                  .filter((event) => event.status === "active")
                  .map((event) => (
                    <div key={event.id} className="border p-4 rounded-md mb-4">
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleEdit(event.id)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(event.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="underReview">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Events Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events
                  .filter((event) => event.status === "underReview")
                  .map((event) => (
                    <div key={event.id} className="border p-4 rounded-md mb-4">
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleEdit(event.id)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(event.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Past Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events
                  .filter((event) => event.status === "history")
                  .map((event) => (
                    <div key={event.id} className="border p-4 rounded-md mb-4">
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleEdit(event.id)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(event.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventManagementPage;
