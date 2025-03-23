import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Mail } from "lucide-react";
import { format } from "date-fns";

const EventManagementPage = () => {
  // Enhanced mock data for existing events
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Donation Drive",
      description: "Collect donations for the needy.",
      status: "active",
      startDate: new Date(2025, 3, 28),
      endDate: new Date(2025, 3, 30),
      location: "Community Center",
      volunteers: [
        { id: 101, name: "John Doe", email: "john@example.com", assigned: true },
        { id: 102, name: "Jane Smith", email: "jane@example.com", assigned: false }
      ],
      tasks: [
        { id: 201, title: "Set up donation boxes", assignedTo: 101 },
        { id: 202, title: "Coordinate with local businesses", assignedTo: null }
      ]
    },
    {
      id: 2,
      title: "Walk-a-thon",
      description: "A charity walk to raise awareness.",
      status: "active",
      startDate: new Date(2025, 4, 15),
      endDate: new Date(2025, 4, 15),
      location: "City Park",
      volunteers: [
        { id: 103, name: "Mike Johnson", email: "mike@example.com", assigned: true },
        { id: 104, name: "Sarah Williams", email: "sarah@example.com", assigned: false }
      ],
      tasks: [
        { id: 203, title: "Set up water stations", assignedTo: 103 },
        { id: 204, title: "Register participants", assignedTo: null }
      ]
    },
    {
      id: 3,
      title: "Fundraiser",
      description: "Raise funds for the organization.",
      status: "underReview",
      startDate: new Date(2025, 4, 5),
      endDate: new Date(2025, 4, 7),
      location: "Hotel Conference Room",
      volunteers: [],
      tasks: []
    },
    {
      id: 4,
      title: "Awareness Campaign",
      description: "Promote awareness about our cause.",
      status: "history",
      startDate: new Date(2025, 2, 10),
      endDate: new Date(2025, 2, 20),
      location: "Multiple Locations",
      volunteers: [
        { id: 105, name: "Alex Thompson", email: "alex@example.com", assigned: true }
      ],
      tasks: [
        { id: 205, title: "Distribute flyers", assignedTo: 105 },
        { id: 206, title: "Social media updates", assignedTo: 105 }
      ]
    },
  ]);

  // State for the currently selected event (for detailed view)
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // State for new event form
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    location: "",
    status: "underReview"
  });
  
  // State for new task form
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    assignedTo: "none" // Changed from empty string to "none"
  });
  
  // State for email update form
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [emailUpdate, setEmailUpdate] = useState({
    subject: "",
    message: ""
  });

  const handleEdit = (id) => {
    const eventToEdit = events.find(event => event.id === id);
    setSelectedEvent(eventToEdit);
  };

  const handleDelete = (id) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
  };

  const handleAddEvent = () => {
    const eventToAdd = {
      ...newEvent,
      id: events.length + 1,
      volunteers: [],
      tasks: []
    };
    
    setEvents([...events, eventToAdd]);
    setIsAddEventOpen(false);
    setNewEvent({
      title: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      location: "",
      status: "underReview"
    });
  };

  const handleAddTask = () => {
    if (!selectedEvent) return;
    
    const updatedEvents = events.map(event => {
      if (event.id === selectedEvent.id) {
        return {
          ...event,
          tasks: [
            ...event.tasks,
            {
              id: Date.now(),
              title: newTask.title,
              assignedTo: newTask.assignedTo === "none" ? null : parseInt(newTask.assignedTo) // Handle "none" value
            }
          ]
        };
      }
      return event;
    });
    
    setEvents(updatedEvents);
    setIsAddTaskOpen(false);
    setNewTask({ title: "", assignedTo: "none" }); // Reset with "none" instead of empty string
    
    // Update selected event
    setSelectedEvent(updatedEvents.find(event => event.id === selectedEvent.id));
  };

  const handleAssignVolunteer = (eventId, volunteerId) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          volunteers: event.volunteers.map(volunteer => {
            if (volunteer.id === volunteerId) {
              return { ...volunteer, assigned: !volunteer.assigned };
            }
            return volunteer;
          })
        };
      }
      return event;
    });
    
    setEvents(updatedEvents);
    if (selectedEvent && selectedEvent.id === eventId) {
      setSelectedEvent(updatedEvents.find(event => event.id === eventId));
    }
  };

  const handleSendUpdate = () => {
    // Here you would implement actual email sending logic
    console.log(`Sending update to volunteers of event ${selectedEvent.id}`);
    console.log(`Subject: ${emailUpdate.subject}`);
    console.log(`Message: ${emailUpdate.message}`);
    
    setIsEmailOpen(false);
    setEmailUpdate({ subject: "", message: "" });
  };

  const renderEventCard = (event) => (
    <div key={event.id} className="border p-4 rounded-md mb-4">
      <h3 className="font-semibold text-lg">{event.title}</h3>
      <p className="text-sm text-gray-500 mb-2">{event.description}</p>
      <div className="text-sm mb-2">
        <div>📅 {format(event.startDate, "MMM dd, yyyy")} - {format(event.endDate, "MMM dd, yyyy")}</div>
        <div>📍 {event.location}</div>
      </div>
      <div className="flex space-x-2 mt-2">
        <Button size="sm" onClick={() => handleEdit(event.id)}>
          Details
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
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Event Management</h2>
        <Link to="/admin/events/create">
        <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Event
            </Button>
        </Link>
      </div>

      {selectedEvent ? (
        <div>
          <Button variant="outline" className="mb-4" onClick={() => setSelectedEvent(null)}>
            Back to Events
          </Button>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{selectedEvent.title}</CardTitle>
                <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Update
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Update to Volunteers</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subject" className="text-right">
                          Subject
                        </Label>
                        <Input
                          id="subject"
                          value={emailUpdate.subject}
                          onChange={(e) => setEmailUpdate({...emailUpdate, subject: e.target.value})}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="message" className="text-right">
                          Message
                        </Label>
                        <Textarea
                          id="message"
                          value={emailUpdate.message}
                          onChange={(e) => setEmailUpdate({...emailUpdate, message: e.target.value})}
                          className="col-span-3"
                          rows={5}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSendUpdate}>Send to All Volunteers</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Event Details</h3>
                  <div className="space-y-2">
                    <p><strong>Description:</strong> {selectedEvent.description}</p>
                    <p><strong>Status:</strong> {selectedEvent.status}</p>
                    <p><strong>Dates:</strong> {format(selectedEvent.startDate, "MMM dd, yyyy")} - {format(selectedEvent.endDate, "MMM dd, yyyy")}</p>
                    <p><strong>Location:</strong> {selectedEvent.location}</p>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Tasks</h3>
                    <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Task</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="taskTitle" className="text-right">
                              Task
                            </Label>
                            <Input
                              id="taskTitle"
                              value={newTask.title}
                              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="assignTo" className="text-right">
                              Assign To
                            </Label>
                            <Select 
                              value={newTask.assignedTo} 
                              onValueChange={(value) => setNewTask({...newTask, assignedTo: value})}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select volunteer" />
                              </SelectTrigger>
                              <SelectContent>
                                {/* Changed from empty string to "none" */}
                                <SelectItem value="none">Unassigned</SelectItem>
                                {selectedEvent.volunteers.map((volunteer) => (
                                  <SelectItem key={volunteer.id} value={volunteer.id.toString()}>
                                    {volunteer.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button onClick={handleAddTask}>Save Task</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedEvent.tasks.length > 0 ? (
                      selectedEvent.tasks.map(task => (
                        <div key={task.id} className="border p-2 rounded-md">
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm">
                            Assigned to: {task.assignedTo 
                              ? selectedEvent.volunteers.find(v => v.id === task.assignedTo)?.name || 'Unknown'
                              : 'Unassigned'}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No tasks created yet</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Volunteers</h3>
                
                {selectedEvent.volunteers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedEvent.volunteers.map(volunteer => (
                      <div key={volunteer.id} className="border p-3 rounded-md">
                        <p className="font-medium">{volunteer.name}</p>
                        <p className="text-sm">{volunteer.email}</p>
                        <div className="mt-2">
                          <Button 
                            size="sm"
                            variant={volunteer.assigned ? "default" : "outline"}
                            onClick={() => handleAssignVolunteer(selectedEvent.id, volunteer.id)}
                          >
                            {volunteer.assigned ? "Assigned" : "Unassigned"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No volunteers registered for this event</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="underReview">Under Review</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events
                    .filter((event) => event.status === "active")
                    .map(renderEventCard)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="underReview">
            <Card>
              <CardHeader>
                <CardTitle>Events Under Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events
                    .filter((event) => event.status === "underReview")
                    .map(renderEventCard)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Past Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events
                    .filter((event) => event.status === "history")
                    .map(renderEventCard)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default EventManagementPage;