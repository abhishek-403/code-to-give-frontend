export const useUpdateEventMutation = () => {
	// Implement the mutation logic to update event details
	// This would typically use React Query or your preferred state management
	const mutate = async (eventId: string, eventData: Partial<Event>) => {
	  try {
		// Make API call to update event
		const response = await fetch(`/api/events/${eventId}`, {
		  method: 'PATCH',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(eventData),
		});
  
		if (!response.ok) {
		  throw new Error('Failed to update event');
		}
  
		return response.json();
	  } catch (error) {
		console.error('Error updating event:', error);
		throw error;
	  }
	};
  
	return { mutate };
  };