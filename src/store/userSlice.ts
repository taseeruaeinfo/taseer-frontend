import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  type: "creator" | "brand";
  profilePic: string;
  phone: string;
  nationality: string;
  countryCode: string;
  city: string;
  dob: string;
}

const initialState: UserState | any = null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (_state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
    logout: () => {
      return null;
    },
  },
});

export const { loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
