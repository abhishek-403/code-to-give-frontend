import { Availabitity } from "@/lib/constants/server-constants";
import { createSlice } from "@reduxjs/toolkit";

export interface EventsState {
  availability: Availabitity[];
  voluneeringDomain: { label: string; value: string }[];
}

const initialState: EventsState = {
  availability: [],
  voluneeringDomain: [],
};

export const eventsSlice = createSlice({
  name: "eventsDetails",
  initialState: initialState,
  reducers: {
    setEventDetails: (state, action) => {
        
        return {
            ...state,
            voluneeringDomain: action.payload,
        };
    },
    resetEventDetails: (_) => {
      return {
        voluneeringDomain: [],
        availability: [],
      };
    },
  },
});

export const { resetEventDetails, setEventDetails } = eventsSlice.actions;

export default eventsSlice.reducer;
